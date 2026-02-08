'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Search, Edit, Trash2, Eye, Wrench, QrCode,
  Activity, Thermometer, Zap, Droplets, AlertTriangle,
  CheckCircle2, XCircle, MoreVertical, Filter, Battery,
  Cpu, Calendar
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// --- MOCK DATA TYPES ---
type EquipmentStatus = 'operational' | 'alert' | 'offline' | 'maintenance';
type EquipmentCategory = 'hvac' | 'electrical' | 'hydraulic' | 'automation';

type MockEquipment = {
  id: string;
  name: string;
  clientName: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
  healthScore: number;
  nextMaintenance: string;
  serialNumber: string;
  location: string;
  model: string;
  brand: string;
  image?: string;
};

// --- MOCK DATA GENERATION ---
const MOCK_EQUIPMENTS: MockEquipment[] = [
  {
    id: '1', name: 'Chiller Carrier 30TR', clientName: 'Shopping Center Norte',
    category: 'hvac', status: 'operational', healthScore: 98,
    nextMaintenance: '15/03/2024', serialNumber: 'CH-2023-889',
    location: 'Cobertura - Bloco A', model: '30XW-V', brand: 'Carrier'
  },
  {
    id: '2', name: 'Gerador Diesel 500kVA', clientName: 'Hospital Santa Clara',
    category: 'electrical', status: 'alert', healthScore: 75,
    nextMaintenance: '10/02/2024', serialNumber: 'GEN-550-X',
    location: 'Subsolo - Sala Técnica', model: 'C15', brand: 'Caterpillar'
  },
  {
    id: '3', name: 'Bomba de Recalque Principal', clientName: 'Condomínio Solar',
    category: 'hydraulic', status: 'offline', healthScore: 45,
    nextMaintenance: 'URGENTE', serialNumber: 'PUMP-001',
    location: 'Casa de Máquinas 1', model: 'NB-50', brand: 'Schneider'
  },
  {
    id: '4', name: 'Painel Elétrico QGBT', clientName: 'Indústria Metalúrgica',
    category: 'electrical', status: 'operational', healthScore: 92,
    nextMaintenance: '20/04/2024', serialNumber: 'PNL-MAIN-01',
    location: 'Sala Elétrica Principal', model: 'Prisma P', brand: 'Schneider'
  },
  {
    id: '5', name: 'Sistema VRF Unidade Externa', clientName: 'Escola Internacional',
    category: 'hvac', status: 'maintenance', healthScore: 60,
    nextMaintenance: 'Em Andamento', serialNumber: 'VRF-OUT-04',
    location: 'Telhado - Ala Sul', model: 'Multi V 5', brand: 'LG'
  },
  {
    id: '6', name: 'Nobreak 20kVA', clientName: 'Hospital Santa Clara',
    category: 'electrical', status: 'operational', healthScore: 100,
    nextMaintenance: '12/06/2024', serialNumber: 'NBK-20-PRO',
    location: 'Sala de TI', model: '9155', brand: 'Eaton'
  },
];

const CATEGORY_ICONS = {
  hvac: <Thermometer size={20} />,
  electrical: <Zap size={20} />,
  hydraulic: <Droplets size={20} />,
  automation: <Cpu size={20} />
};

const CATEGORY_NAMES = {
  hvac: 'Climatização',
  electrical: 'Elétrica',
  hydraulic: 'Hidráulica',
  automation: 'Automação'
};

const STATUS_CONFIG = {
  operational: { label: 'Operacional', color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  alert: { label: 'Em Alerta', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
  offline: { label: 'Parado', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  maintenance: { label: 'Em Manutenção', color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
};

export default function EquipmentsPage() {
  const router = useRouter();
  const [equipments, setEquipments] = useState<MockEquipment[]>(MOCK_EQUIPMENTS);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // KPI Calculations
  const totalAssets = equipments.length;
  const criticalAssets = equipments.filter(e => e.status === 'offline' || e.status === 'alert').length;
  const avgHealth = Math.round(equipments.reduce((acc, curr) => acc + curr.healthScore, 0) / totalAssets) || 0;

  const filteredEquipments = equipments.filter(eq => {
    const matchesSearch =
      eq.name.toLowerCase().includes(search.toLowerCase()) ||
      eq.clientName.toLowerCase().includes(search.toLowerCase()) ||
      eq.serialNumber.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = filterCategory === 'all' || eq.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || eq.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEdit = (id: string) => {
    toast.success('Modo de edição simulado');
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este ativo?')) {
      setEquipments(prev => prev.filter(e => e.id !== id));
      toast.success('Equipamento removido');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-20">
      {/* Header & KPIs */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/30">
                <Wrench size={24} />
              </div>
              Gestão de Ativos
            </h1>
            <p className="text-slate-500 mt-1 pl-1">Monitoramento em tempo real de equipamentos e infraestrutura.</p>
          </div>

          <button className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
            <Plus size={20} />
            <span>Novo Equipamento</span>
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Assets */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Cpu size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total de Ativos</p>
              <h3 className="text-2xl font-black text-slate-800">{totalAssets}</h3>
            </div>
          </div>

          {/* Asset Health */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${avgHealth > 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              <Activity size={24} />
            </div>
            <div className="flex-1">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Saúde Média</p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black text-slate-800">{avgHealth}%</h3>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${avgHealth > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${avgHealth}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Assets */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Ativos Críticos</p>
              <h3 className="text-2xl font-black text-slate-800">{criticalAssets}</h3>
            </div>
          </div>

          {/* Maintenance Status */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Manutenções Hoje</p>
              <h3 className="text-2xl font-black text-slate-800">2</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, tag ou número de série..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 text-sm outline-none transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-slate-50 text-slate-600 text-sm font-medium rounded-xl border-none focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <option value="all">Todas Categorias</option>
            <option value="hvac">Climatização</option>
            <option value="electrical">Elétrica</option>
            <option value="hydraulic">Hidráulica</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-slate-50 text-slate-600 text-sm font-medium rounded-xl border-none focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <option value="all">Todos Status</option>
            <option value="operational">Operacional</option>
            <option value="alert">Em Alerta</option>
            <option value="offline">Parado</option>
            <option value="maintenance">Em Manutenção</option>
          </select>

          <button className="px-4 py-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipments.map((item) => (
          <div key={item.id} className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col overflow-hidden">
            {/* Card Header with Status Color */}
            <div className={`h-2 w-full ${STATUS_CONFIG[item.status].bg.replace('bg-', 'bg-opacity-100 bg-')}`}></div>

            <div className="p-5 flex-1 flex flex-col gap-4">
              {/* Top Row: Icon/Category & Menu */}
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl ${STATUS_CONFIG[item.status].bg} ${STATUS_CONFIG[item.status].color}`}>
                  {CATEGORY_ICONS[item.category]}
                </div>
                <div className="flex gap-1">
                  <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors" title="QR Code">
                    <QrCode size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                </div>
              </div>

              {/* Main Info */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-700 transition-colors">{item.name}</h3>
                <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                  <Building2 size={14} />
                  {item.clientName}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Marca</span>
                  <span className="font-semibold text-slate-700">{item.brand}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Modelo</span>
                  <span className="font-semibold text-slate-700">{item.model}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">Localização</span>
                  <span className="font-semibold text-slate-700">{item.location}</span>
                </div>
              </div>

              {/* Status & Maintenance Badge */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_CONFIG[item.status].bg} ${STATUS_CONFIG[item.status].color} ${STATUS_CONFIG[item.status].border}`}>
                  {STATUS_CONFIG[item.status].label}
                </span>

                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Próxima Manut.</span>
                  <span className={`text-xs font-bold ${item.nextMaintenance === 'URGENTE' ? 'text-red-500' : 'text-slate-700'}`}>
                    {item.nextMaintenance}
                  </span>
                </div>
              </div>
            </div>

            {/* Health Bar Bottom */}
            <div className="h-1.5 w-full bg-slate-100">
              <div
                className={`h-full transition-all duration-500 ${item.healthScore > 80 ? 'bg-emerald-500' : item.healthScore > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${item.healthScore}%` }}
                title={`Saúde do Ativo: ${item.healthScore}%`}
              ></div>
            </div>
          </div>
        ))}

        {/* Add New Mock Card */}
        <button className="group border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-3 p-8 text-slate-400 hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-600 transition-all duration-300 min-h-[300px]">
          <div className="p-4 bg-slate-100 rounded-full group-hover:bg-indigo-100 group-hover:scale-110 transition-all">
            <Plus size={32} />
          </div>
          <span className="font-bold">Cadastrar Novo Ativo</span>
        </button>
      </div>

      {filteredEquipments.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
            <Search size={32} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium">Nenhum equipamento encontrado com os filtros atuais.</p>
          <button
            onClick={() => { setSearch(''); setFilterCategory('all'); setFilterStatus('all'); }}
            className="mt-4 text-indigo-600 font-bold text-sm hover:underline"
          >
            Limpar Filtros
          </button>
        </div>
      )}
    </div>
  );
}

// Helper component for icon
function Building2({ size }: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  )
}
