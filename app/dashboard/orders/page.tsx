'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Search, Filter, Calendar, Clock,
  MapPin, Layout, List as ListIcon, MoreHorizontal,
  ArrowRight, Building2, ChevronRight, ChevronLeft,
  Maximize2, Minimize2, X
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

// --- MOCK DATA ---
const MOCK_ORDERS = [
  {
    id: 'OS-2024-001', title: 'Manutenção Preventiva - Chiller 01', client: 'Shopping Center Norte',
    status: 'in_progress', priority: 'medium', technician: 'Carlos Silva',
    date: '2024-02-07', deadline: '2024-02-07T18:00:00', type: 'preventive', location: 'Cobertura'
  },
  {
    id: 'OS-2024-002', title: 'Vazamento em Tubulação de Água Gelada', client: 'Hospital Santa Clara',
    status: 'open', priority: 'high', technician: 'João Souza',
    date: '2024-02-07', deadline: '2024-02-07T12:00:00', type: 'corrective', location: 'Subsolo 2'
  },
  {
    id: 'OS-2024-003', title: 'Instalação de Novo Ponto de Energia', client: 'Escola Internacional',
    status: 'pending', priority: 'low', technician: 'Pedro Santos',
    date: '2024-02-06', deadline: '2024-02-08T10:00:00', type: 'installation', location: 'Sala 104'
  },
  {
    id: 'OS-2024-004', title: 'Troca de Disjuntor Geral', client: 'Indústria Metalúrgica',
    status: 'completed', priority: 'critical', technician: 'Ana Oliveira',
    date: '2024-02-05', deadline: '2024-02-05T14:00:00', type: 'corrective', location: 'QGBT Principal'
  },
  {
    id: 'OS-2024-005', title: 'Limpeza de Dutos de Ar Condicionado', client: 'Condomínio Solar',
    status: 'open', priority: 'medium', technician: 'Carlos Silva',
    date: '2024-02-08', deadline: '2024-02-08T16:00:00', type: 'preventive', location: 'Andares 1-5'
  },
  {
    id: 'OS-2024-006', title: 'Calibração de Sensores de Temperatura', client: 'Laboratório Central',
    status: 'open', priority: 'medium', technician: 'Mariana Costa',
    date: '2024-02-09', deadline: '2024-02-09T11:00:00', type: 'preventive', location: 'Sala Limpa'
  },
  {
    id: 'OS-2024-007', title: 'Reparo no Sistema de Combate a Incêndio', client: 'Shopping Center Norte',
    status: 'pending', priority: 'high', technician: 'Roberto Almeida',
    date: '2024-01-30', deadline: '2024-02-01T09:00:00', type: 'corrective', location: 'Estacionamento'
  },
  {
    id: 'OS-2024-008', title: 'Inspeção de Para-raios (SPDA)', client: 'Edifício Comercial Paulista',
    status: 'completed', priority: 'medium', technician: 'Carlos Silva',
    date: '2024-01-25', deadline: '2024-01-25T17:00:00', type: 'inspection', location: 'Telhado'
  }
];

const COLUMNS = [
  { id: 'open', label: 'Aberto', color: 'bg-purple-50 border-purple-100' },
  { id: 'in_progress', label: 'Em Andamento', color: 'bg-blue-50 border-blue-100' },
  { id: 'pending', label: 'Pendente', color: 'bg-amber-50 border-amber-100' },
  { id: 'completed', label: 'Concluído', color: 'bg-emerald-50 border-emerald-100' },
];

export default function ServiceOrdersPage() {
  const { isDemoMode } = useAuthStore();
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setOrders(MOCK_ORDERS);
  }, []);

  // Collapsed states for both views - defaulting to all collapsed
  const [collapsedCols, setCollapsedCols] = useState<string[]>(['open', 'in_progress', 'pending', 'completed']);
  const [collapsedLists, setCollapsedLists] = useState<string[]>(['open', 'in_progress', 'pending', 'completed']);

  // Simulated filtering
  const filteredOrders = orders.filter(order =>
    order.title.toLowerCase().includes(filter.toLowerCase()) ||
    order.client.toLowerCase().includes(filter.toLowerCase()) ||
    order.id.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleColumn = (colId: string) => {
    setCollapsedCols(prev =>
      prev.includes(colId) ? prev.filter(id => id !== colId) : [...prev, colId]
    );
  };

  const toggleList = (listId: string) => {
    setCollapsedLists(prev =>
      prev.includes(listId) ? prev.filter(id => id !== listId) : [...prev, listId]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'low': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical': return 'Crítica';
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return priority;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Ordens de Serviço</h1>
          <p className="text-slate-500 font-medium">Gerencie o fluxo de trabalho da sua equipe técnica.</p>
        </div>

        <div className="flex gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              title="Visão Kanban"
            >
              <Layout size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              title="Visão Lista"
            >
              <ListIcon size={20} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Buscar por OS, cliente ou serviço..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl h-14 pl-12 pr-6 text-sm font-semibold text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>

            <button className="h-14 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-indigo-500 transition-all">
              <Filter size={18} /> Filtros Avançados
            </button>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
            <Plus size={18} /> <span className="hidden sm:inline">Nova OS</span>
          </button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por cliente, título ou ID..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x min-h-[500px]">
          {COLUMNS.map(col => {
            const colOrders = filteredOrders.filter(o => o.status === col.id);
            const isCollapsed = collapsedCols.includes(col.id);

            return (
              <div
                key={col.id}
                className={`transition-all duration-300 ease-in-out flex flex-col bg-slate-50/50 rounded-2xl border border-slate-200/60 p-3 h-full cursor-default ${isCollapsed ? 'w-16 min-w-[64px] items-center py-4 bg-slate-100' : 'min-w-[300px] max-w-[300px]'}`}
              >
                {/* Header */}
                <div
                  onClick={() => toggleColumn(col.id)}
                  className={`flex items-center justify-between p-3 mb-2 rounded-xl transition-colors cursor-pointer hover:bg-white/80 ${isCollapsed ? 'flex-col h-full justify-start gap-4 py-2' : `border-l-4 ${col.color.replace('bg-', 'border-').split(' ')[1]} bg-white shadow-sm`}`}
                  title={isCollapsed ? "Expandir" : "Recolher"}
                >
                  {isCollapsed ? (
                    <>
                      <div className={`w-3 h-3 rounded-full ${col.color.replace('bg-', 'bg-').split(' ')[0].replace('50', '500')}`}></div>
                      <span className="writing-mode-vertical text-xs font-bold text-slate-500 uppercase tracking-widest rotate-180 whitespace-nowrap pt-4">{col.label}</span>
                      <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full mt-2">{colOrders.length}</span>
                      <div className="mt-auto pt-4 text-slate-400">
                        <Maximize2 size={16} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-700">{col.label}</h3>
                        <Minimize2 size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">{colOrders.length}</span>
                    </>
                  )}
                </div>

                {/* Content */}
                {!isCollapsed && (
                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar pr-1 animate-fadeIn">
                    {colOrders.map(order => (
                      <div key={order.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group animate-slideUp">
                        <div className="flex justify-between items-start mb-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getPriorityColor(order.priority)}`}>
                            {getPriorityLabel(order.priority)}
                          </span>
                          <button className="text-slate-300 hover:text-slate-600">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>

                        <h4 className="font-bold text-slate-800 mb-1 leading-snug group-hover:text-indigo-600 transition-colors">{order.title}</h4>
                        <p className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1">
                          <Building2 size={12} /> {order.client}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700 border border-indigo-200">
                              {order.technician.charAt(0)}
                            </div>
                            <span className="text-xs text-slate-500 font-medium truncate max-w-[80px]">{order.technician.split(' ')[0]}</span>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
                            <Clock size={12} />
                            {new Date(order.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    ))}
                    {colOrders.length === 0 && (
                      <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                        <p className="text-slate-400 text-sm font-medium">Vazio</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* List View - Grouped by Status */}
      {viewMode === 'list' && (
        <div className="space-y-4 animate-fadeIn">
          {COLUMNS.map(col => {
            const colOrders = filteredOrders.filter(o => o.status === col.id);
            const isListCollapsed = collapsedLists.includes(col.id);

            return (
              <div key={col.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-slideUp">
                <div
                  className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${isListCollapsed ? 'bg-slate-50 hover:bg-slate-100' : `border-b border-slate-100 bg-white hover:bg-slate-50 border-l-4 ${col.color.replace('bg-', 'border-').split(' ')[1]}`}`}
                  onClick={() => toggleList(col.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${col.color.replace('bg-', 'bg-').split(' ')[0].replace('50', '500')}`}></div>
                    <h3 className="font-bold text-slate-700">{col.label}</h3>
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{colOrders.length}</span>
                  </div>
                  {isListCollapsed ? <ChevronRight size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400 rotate-90 transition-transform" />}
                </div>

                {!isListCollapsed && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          <th className="p-4">ID</th>
                          <th className="p-4">Descrição</th>
                          <th className="p-4">Cliente</th>
                          <th className="p-4">Técnico</th>
                          <th className="p-4">Prioridade</th>
                          <th className="p-4 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {colOrders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="p-4 font-mono text-xs font-bold text-slate-400">{order.id}</td>
                            <td className="p-4">
                              <p className="font-bold text-slate-800 text-sm">{order.title}</p>
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {order.location}</p>
                            </td>
                            <td className="p-4 text-sm font-medium text-slate-600">{order.client}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                  {order.technician.charAt(0)}
                                </div>
                                <span className="text-sm text-slate-600">{order.technician}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getPriorityColor(order.priority)}`}>
                                {getPriorityLabel(order.priority)}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                <ArrowRight size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {colOrders.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400 text-sm italic">
                              Nenhuma ordem nesta categoria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <style jsx>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
}
