'use client';

import { useState } from 'react';
import {
  Plus, Search, Filter, FileText, CheckCircle, XCircle,
  Clock, DollarSign, User, Calendar, MoreVertical,
  ArrowRight, Calculator, PieChart, TrendingUp, Send, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// --- MOCK DATA ---
const MOCK_QUOTES = [
  {
    id: 'Q-2024-001',
    quote_number: '001/24',
    title: 'Instalação de Sistema VRF - 3 Andares',
    client: 'Shopping Center Norte',
    client_avatar: 'S',
    status: 'negotiating',
    total_value: 45800.00,
    created_at: '2026-02-01',
    valid_until: '2026-03-01',
    items_count: 12,
    probability: 'high'
  },
  {
    id: 'Q-2024-002',
    quote_number: '002/24',
    title: 'Manutenção Preventiva Anual - Geradores',
    client: 'Hospital Santa Clara',
    client_avatar: 'H',
    status: 'sent',
    total_value: 12500.00,
    created_at: '2026-02-05',
    valid_until: '2026-02-20',
    items_count: 5,
    probability: 'medium'
  },
  {
    id: 'Q-2024-003',
    quote_number: '003/24',
    title: 'Troca de Cabeamento de Rede',
    client: 'Escola Internacional',
    client_avatar: 'E',
    status: 'draft',
    total_value: 3200.00,
    created_at: '2026-02-07',
    valid_until: '2026-02-15',
    items_count: 8,
    probability: 'low'
  },
  {
    id: 'Q-2024-004',
    quote_number: '004/24',
    title: 'Reforma do Quadro Elétrico Principal',
    client: 'Condomínio Solar',
    client_avatar: 'C',
    status: 'approved',
    total_value: 8900.00,
    created_at: '2026-01-28',
    valid_until: '2026-02-28',
    items_count: 15,
    probability: 'won'
  },
  {
    id: 'Q-2024-005',
    quote_number: '005/24',
    title: 'Instalação de Câmeras de Segurança',
    client: 'Restaurante Bom Sabor',
    client_avatar: 'R',
    status: 'rejected',
    total_value: 2500.00,
    created_at: '2026-01-20',
    valid_until: '2026-02-10',
    items_count: 4,
    probability: 'lost'
  },
  {
    id: 'Q-2024-006',
    quote_number: '006/24',
    title: 'Contrato Mensal de Manutenção',
    client: 'Academia Fit',
    client_avatar: 'A',
    status: 'negotiating',
    total_value: 1500.00,
    created_at: '2026-02-06',
    valid_until: '2026-02-06',
    items_count: 1,
    probability: 'medium'
  }
];

const STAGES = [
  { id: 'draft', label: 'Rascunho', color: 'bg-slate-50 text-slate-600 border-slate-200', dot: 'bg-slate-400' },
  { id: 'sent', label: 'Enviado', color: 'bg-blue-50 text-blue-600 border-blue-200', dot: 'bg-blue-500' },
  { id: 'negotiating', label: 'Em Negociação', color: 'bg-purple-50 text-purple-600 border-purple-200', dot: 'bg-purple-500' },
  { id: 'approved', label: 'Aprovado', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', dot: 'bg-emerald-500' },
  { id: 'rejected', label: 'Perdido', color: 'bg-red-50 text-red-600 border-red-200', dot: 'bg-red-500' },
];

export default function QuotesPage() {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [filter, setFilter] = useState('');

  // Dynamic import handling for PDF
  const handleGeneratePDF = async (quote: any) => {
    try {
      const { generateQuotePDF } = await import('@/app/utils/pdfGenerator');
      generateQuotePDF(quote);
      toast.success('Gerando PDF...');
    } catch (error) {
      console.error("Erro ao importar gerador de PDF:", error);
      toast.error("Erro ao gerar PDF.");
    }
  };

  const handleNewQuote = () => {
    toast('Funcionalidade de Criação em Desenvolvimento (Demo)', {
      icon: '🚧',
    });
  }

  // Calculations
  const totalPipeline = MOCK_QUOTES.filter(q => q.status !== 'rejected').reduce((acc, q) => acc + q.total_value, 0);
  const totalPotential = MOCK_QUOTES.filter(q => q.status === 'negotiating' || q.status === 'sent').reduce((acc, q) => acc + q.total_value, 0);

  const getStageTotal = (stageId: string) => {
    return MOCK_QUOTES.filter(q => q.status === stageId).reduce((acc, q) => acc + q.total_value, 0);
  };

  const filteredQuotes = MOCK_QUOTES.filter(q =>
    q.title.toLowerCase().includes(filter.toLowerCase()) ||
    q.client.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn pb-24 max-w-[1600px] mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase flex items-center gap-3">
            <DollarSign className="text-emerald-500" /> Funil de Vendas
          </h1>
          <p className="text-slate-500 font-medium mt-1">Gerencie suas propostas comerciais e feche mais negócios.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex shadow-sm">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <div className="rotate-90"><MoreVertical size={16} /></div> Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <div className="rotate-0"><MoreVertical size={16} /></div> Lista
            </button>
          </div>
          <button
            onClick={handleNewQuote}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-200/50 flex items-center gap-2"
          >
            <Plus size={20} /> <span className="hidden sm:inline">Nova Proposta</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-none bg-white p-6 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Pipeline Total</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">R$ {totalPipeline.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-2 bg-emerald-50 w-fit px-2 py-1 rounded-full">
              <TrendingUp size={14} /> +12% vs mês anterior
            </div>
          </div>
        </div>
        <div className="card border-none bg-white p-6 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-purple-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Em Negociação</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">R$ {totalPotential.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
            <div className="flex items-center gap-1 text-xs font-medium text-purple-600 mt-2">
              {MOCK_QUOTES.filter(q => q.status === 'negotiating' || q.status === 'sent').length} oportunidades ativas
            </div>
          </div>
        </div>
        <div className="card border-none bg-white p-6 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Taxa de Conversão</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">28%</h3>
            <div className="flex items-center gap-1 text-xs font-medium text-slate-400 mt-2">
              Média do setor: 22%
            </div>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 group relative">
          <div className="flex items-center w-full px-4 py-3 border border-gray-200 rounded-xl bg-white transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 shadow-sm">
            <Search className="text-gray-400 group-hover:text-indigo-500 transition-colors mr-3" size={20} />
            <input
              type="text"
              placeholder="Buscar orçamentos..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1 w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {viewMode === 'kanban' && (
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x px-1 custom-scrollbar min-h-[500px]">
          {STAGES.map(stage => {
            const stageQuotes = filteredQuotes.filter(q => q.status === stage.id);
            const stageTotal = getStageTotal(stage.id);

            return (
              <div key={stage.id} className="min-w-[320px] max-w-[320px] flex flex-col snap-center shrink-0">
                {/* Column Header */}
                <div className={`mb-4 p-4 rounded-xl border ${stage.color} bg-white flex justify-between items-center shadow-sm`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stage.dot}`}></div>
                    <span className="font-bold text-sm tracking-wide uppercase">{stage.label}</span>
                  </div>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold text-slate-600">{stageQuotes.length}</span>
                </div>

                {/* Column Summary */}
                <div className="mb-4 px-2">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Valor na etapa</p>
                  <p className="text-lg font-black text-slate-700 tracking-tight">R$ {stageTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>

                {/* Cards Container */}
                <div className="flex-1 flex flex-col gap-4">
                  {stageQuotes.map(quote => (
                    <div key={quote.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-indigo-200 transition-all cursor-move group relative">
                      <div className="flex justify-between items-center mb-3">
                        <span className="bg-slate-50 text-slate-500 text-[10px] font-mono font-bold px-2 py-1 rounded border border-slate-100">{quote.quote_number}</span>
                        <button className="text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={16} /></button>
                      </div>

                      <h4 className="font-bold text-slate-800 text-sm mb-1 leading-snug group-hover:text-indigo-600 transition-colors">{quote.title}</h4>

                      <div className="flex items-center gap-2 mb-4 mt-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${quote.client_avatar === 'S' ? 'bg-indigo-500' : 'bg-slate-400'}`}>
                          {quote.client_avatar}
                        </div>
                        <span className="text-xs text-slate-500 font-medium truncate">{quote.client}</span>
                      </div>

                      <div className="border-t border-slate-50 pt-3 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Valor</span>
                          <span className="text-sm font-black text-slate-800">R$ {quote.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
                        </div>

                        <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleGeneratePDF(quote) }}
                            className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Gerar PDF"
                          >
                            <FileText size={14} />
                          </button>

                          {quote.status === 'draft' && (
                            <button className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors" title="Enviar">
                              <Send size={14} />
                            </button>
                          )}
                          {(quote.status === 'negotiating' || quote.status === 'sent') && (
                            <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors" title="Aprovar">
                              <CheckCircle size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-bold text-slate-500">
              <tr>
                <th className="px-6 py-4">Orçamento</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Valor Total</th>
                <th className="px-6 py-4">Validade</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{quote.title}</span>
                      <span className="text-xs text-slate-400 font-mono mt-0.5">{quote.quote_number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${quote.client_avatar === 'S' ? 'bg-indigo-500' : 'bg-slate-400'}`}>
                        {quote.client_avatar}
                      </div>
                      <span className="font-medium text-slate-700">{quote.client}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${STAGES.find(s => s.id === quote.status)?.color
                      }`}>
                      {STAGES.find(s => s.id === quote.status)?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-slate-800">
                    R$ {quote.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(quote.valid_until).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleGeneratePDF(quote) }}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Gerar PDF"
                      >
                        <FileText size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredQuotes.length === 0 && (
            <div className="p-12 text-center text-slate-400 font-medium">
              <p>Nenhum orçamento encontrado nesta visão.</p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(203, 213, 225, 0.5);
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: rgba(148, 163, 184, 0.8);
        }
      `}</style>
    </div>
  );
}
