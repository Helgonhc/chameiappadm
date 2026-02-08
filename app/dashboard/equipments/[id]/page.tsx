'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft, Trash2, Loader2, Calendar, Wrench, QrCode, MapPin,
  Building2, Edit, Save, FileText, AlertTriangle, CheckCircle,
  Clock, DollarSign, Upload, History, Plus, Activity, Zap, Thermometer
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// --- MOCK DATA (Synced with Dashboard/QR) ---
const MOCK_EQUIPMENTS: any[] = [
  {
    id: '1', name: 'Chiller Carrier 30TR', clients: { name: 'Shopping Center Norte', phone: '(11) 9999-9999', address: 'Av. Otto Baumgart, 500' },
    model: '30XW-V', brand: 'Carrier', qr_code: 'EQ-000001', location: 'Cobertura - Bloco A', status: 'operational',
    healthScore: 98, next_maintenance_date: '2024-03-15', last_maintenance: '2024-01-10', maintenance_frequency_months: 6,
    purchase_date: '2022-05-20', purchase_value: 150000, supplier: 'Carrier Brasil', serial_number: 'CH-2023-889',
    category: 'hvac'
  },
  {
    id: '2', name: 'Gerador Diesel 500kVA', clients: { name: 'Hospital Santa Clara', phone: '(11) 8888-8888', address: 'Rua das Flores, 123' },
    model: 'C15', brand: 'Caterpillar', qr_code: 'EQ-000002', location: 'Subsolo - Sala Técnica', status: 'alert',
    healthScore: 75, next_maintenance_date: '2024-02-10', last_maintenance: '2023-11-15', maintenance_frequency_months: 12,
    purchase_date: '2021-08-10', purchase_value: 350000, supplier: 'Sotreq', serial_number: 'GEN-550-X',
    category: 'electrical'
  },
  {
    id: '3', name: 'Bomba de Recalque Principal', clients: { name: 'Condomínio Solar', phone: '(11) 7777-7777', address: 'Rua do Sol, 45' },
    model: 'NB-50', brand: 'Schneider', qr_code: 'EQ-000003', location: 'Casa de Máquinas 1', status: 'offline',
    healthScore: 45, next_maintenance_date: '2024-01-20', last_maintenance: '2023-06-20', maintenance_frequency_months: 6,
    purchase_date: '2020-03-15', purchase_value: 12000, supplier: 'Schneider Motobombas', serial_number: 'PUMP-001',
    category: 'hydraulic'
  },
  {
    id: '4', name: 'Painel Elétrico QGBT', clients: { name: 'Indústria Metalúrgica' },
    model: 'Prisma P', brand: 'Schneider', qr_code: 'EQ-000004'
  },
  {
    id: '5', name: 'Sistema VRF Unidade Externa', clients: { name: 'Escola Internacional' },
    model: 'Multi V 5', brand: 'LG', qr_code: 'EQ-000005'
  },
  {
    id: '6', name: 'Nobreak 20kVA', clients: { name: 'Hospital Santa Clara' },
    model: '9155', brand: 'Eaton', qr_code: 'EQ-000006'
  },
];

const MOCK_HISTORY = [
  { id: 1, title: 'Manutenção Preventiva Mensal', date: '2024-01-10', technician: 'Carlos Silva', type: 'preventive', status: 'completed' },
  { id: 2, title: 'Substituição de Filtros', date: '2023-12-15', technician: 'João Souza', type: 'corrective', status: 'completed' },
  { id: 3, title: 'Inspeção Geral', date: '2023-11-20', technician: 'Carlos Silva', type: 'inspection', status: 'completed' },
];

const MOCK_DOCS = [
  { id: 1, title: 'Manual do Usuário.pdf', date: '2022-05-20', size: '2.4 MB', type: 'pdf' },
  { id: 2, title: 'Nota Fiscal.pdf', date: '2022-05-20', size: '150 KB', type: 'pdf' },
  { id: 3, title: 'Relatório Técnico Jan/24.docx', date: '2024-01-12', size: '1.1 MB', type: 'doc' },
];

export default function EquipmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [equipment, setEquipment] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'documents'>('info');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadEquipment();
  }, [params.id]);

  async function loadEquipment() {
    try {
      // Mock Data Strategy
      const mockEq = MOCK_EQUIPMENTS.find(e => e.id === params.id);
      if (mockEq) {
        setEquipment(mockEq);
        setLoading(false);
        return;
      }

      // Fallback to Supabase
      const { data, error } = await supabase
        .from('equipments')
        .select('*, clients(name, phone, address)')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setEquipment(data);
    } catch (error) {
      console.error('Erro:', error);
      // Fallback for Demo
      setEquipment(MOCK_EQUIPMENTS[0]);
    } finally {
      setLoading(false);
    }
  }

  const handleEditToggle = () => {
    if (isEditing) {
      toast.success('Alterações salvas (Simulação)');
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!equipment) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/equipments" className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-indigo-600">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-800">{equipment.name}</h1>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${equipment.status === 'operational' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {equipment.status === 'operational' ? 'Operacional' : equipment.status === 'alert' ? 'Alerta' : 'Parado'}
            </span>
          </div>
          <p className="text-slate-500 font-medium">{equipment.clients?.name}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/equipments/${params.id}/qrcode`} className="btn-secondary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors">
            <QrCode size={18} /> <span className="hidden sm:inline">QR Code</span>
          </Link>
          <button onClick={handleEditToggle} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
            {isEditing ? <Save size={18} /> : <Edit size={18} />}
            <span className="hidden sm:inline">{isEditing ? 'Salvar' : 'Editar'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100/50 rounded-xl border border-slate-200/50 backdrop-blur-sm sticky top-0 z-10">
        {[
          { id: 'info', icon: Wrench, label: 'Visão Geral' },
          { id: 'history', icon: History, label: 'Histórico' },
          { id: 'documents', icon: FileText, label: 'Documentos' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === tab.id
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
              }`}
          >
            <tab.icon size={18} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Info Tab */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideUp">
          {/* Left Column - Main Info */}
          <div className="col-span-1 md:col-span-2 space-y-6">

            {/* Health & Usage Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Activity className="text-indigo-600" size={20} />
                Saúde do Ativo
              </h3>

              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent"
                      className={`${equipment.healthScore > 80 ? 'text-emerald-500' : 'text-amber-500'}`}
                      strokeDasharray={2 * Math.PI * 56}
                      strokeDashoffset={2 * Math.PI * 56 * (1 - (equipment.healthScore || 0) / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-800">{equipment.healthScore || 0}%</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500 font-medium">Disponibilidade (Uptime)</span>
                      <span className="font-bold text-slate-700">99.8%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[99.8%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500 font-medium">Confiabilidade</span>
                      <span className="font-bold text-slate-700">95.0%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[95%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Specs */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Wrench className="text-slate-400" size={20} />
                Especificações Técnicas
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Marca</span>
                  <span className="font-bold text-slate-700">{isEditing ? <input defaultValue={equipment.brand} className="bg-transparent w-full border-b border-indigo-300 outline-none" /> : equipment.brand}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Modelo</span>
                  <span className="font-bold text-slate-700">{isEditing ? <input defaultValue={equipment.model} className="bg-transparent w-full border-b border-indigo-300 outline-none" /> : equipment.model}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Número de Série</span>
                  <span className="font-mono font-bold text-slate-700">{equipment.serial_number}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Localização</span>
                  <span className="font-bold text-slate-700 flex items-center gap-2">
                    <MapPin size={14} className="text-indigo-500" />
                    {isEditing ? <input defaultValue={equipment.location} className="bg-transparent w-full border-b border-indigo-300 outline-none" /> : equipment.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Dates & Financial */}
          <div className="col-span-1 space-y-6">
            {/* Maintenance Schedule */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
              <h3 className="font-bold text-white/90 mb-4 flex items-center gap-2">
                <Calendar className="text-white/80" size={20} />
                Próxima Manutenção
              </h3>
              <div className="text-center py-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10 mb-4">
                <span className="text-3xl font-black block">
                  {equipment.next_maintenance_date ? new Date(equipment.next_maintenance_date).getDate() : '--'}
                </span>
                <span className="text-sm font-bold uppercase opacity-80">
                  {equipment.next_maintenance_date ? new Date(equipment.next_maintenance_date).toLocaleDateString('pt-BR', { month: 'long' }) : 'Não agendado'}
                </span>
              </div>
              <div className="text-sm text-white/80 space-y-2">
                <div className="flex justify-between">
                  <span>Última:</span>
                  <span className="font-bold">{equipment.last_maintenance ? new Date(equipment.last_maintenance).toLocaleDateString('pt-BR') : '--/--/----'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frequência:</span>
                  <span className="font-bold text-white">{equipment.maintenance_frequency_months || 12} meses</span>
                </div>
              </div>
            </div>

            {/* Financial Data */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <DollarSign className="text-emerald-500" size={20} />
                Financeiro
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Valor de Compra</span>
                  <span className="text-lg font-bold text-slate-800">
                    {equipment.purchase_value ? `R$ ${equipment.purchase_value.toLocaleString('pt-BR')}` : 'R$ --'}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-400 font-medium block">Data de Compra</span>
                  <span className="text-sm font-bold text-slate-700">
                    {equipment.purchase_date ? new Date(equipment.purchase_date).toLocaleDateString('pt-BR') : '--/--/----'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4 animate-slideUp">
          {MOCK_HISTORY.map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`p-3 rounded-full ${item.type === 'preventive' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                <Clock size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800">{item.title}</h4>
                <div className="flex gap-4 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {item.date}</span>
                  <span className="flex items-center gap-1">👤 {item.technician}</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold flex items-center gap-1">
                <CheckCircle size={12} /> Concluído
              </span>
            </div>
          ))}
          <button className="w-full py-3 text-center text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">
            Ver Histórico Completo
          </button>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-4 animate-slideUp">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-slate-700">Arquivos Anexados</h3>
            <button className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1 rounded-lg">
              <Plus size={14} /> Novo Arquivo
            </button>
          </div>

          {MOCK_DOCS.map((doc, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-4 hover:border-indigo-200 transition-colors cursor-pointer group">
              <div className={`p-3 rounded-lg ${doc.type === 'pdf' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                <FileText size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{doc.title}</h4>
                <p className="text-xs text-slate-400">{doc.date} • {doc.size}</p>
              </div>
              <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-indigo-600 transition-colors">
                <Upload size={18} className="transform rotate-180" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
