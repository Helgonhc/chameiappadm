'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { Calendar, Clock, User, Check, X, MessageCircle, Loader2, AlertTriangle, Send, ChevronRight, Edit, Trash2, CalendarClock, Building2, MapPin, FileText, Info, CheckCircle, ArrowRight, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface MaintenanceRequest {
  id: string;
  request_number: string;
  client_id: string;
  title: string;
  description?: string;
  suggested_date: string;
  suggested_time_period: string;
  confirmed_date?: string;
  admin_notes?: string;
  status: string;
  created_at: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  requester_name?: string;
  requester_email?: string;
  maintenance_type_name?: string;
  maintenance_color?: string;
  equipment_name?: string;
  display_status?: string;
  city?: string;
  state?: string;
  whatsapp_count?: number;
  rescheduled_reason?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  equipment_brand?: string;
  equipment_model?: string;
}

export default function MaintenanceRequestsPage() {
  const { profile, isDemoMode } = useAuthStore();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('pendente');
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [responseForm, setResponseForm] = useState({
    action: 'confirmar' as 'confirmar' | 'reagendar',
    confirmed_date: '',
    admin_notes: ''
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    suggested_date: '',
    suggested_time_period: 'manha',
    admin_notes: ''
  });

  useEffect(() => {
    loadMockRequests();
  }, []);

  function loadMockRequests() {
    const mock: MaintenanceRequest[] = [
      {
        id: 'req_1',
        request_number: 'SOL-001',
        client_id: 'c1',
        title: 'Vazamento em Condensadora',
        description: 'Vazamento persistente de água na condensadora do hall principal, gerando poça no corredor. Perigo de escorregamento.',
        suggested_date: new Date().toISOString().split('T')[0],
        suggested_time_period: 'manha',
        status: 'pendente',
        priority: 'high',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        client_name: 'Condomínio Solar das Palmeiras',
        city: 'São Paulo',
        state: 'SP',
        whatsapp_count: 2,
        requester_name: 'Carlos Alberto (Zelador)',
        equipment_name: 'Chiller Unidade 04',
        equipment_brand: 'Carrier',
        equipment_model: '30XW-V',
        admin_notes: 'Técnico avisado por telefone.'
      },
      {
        id: 'req_2',
        request_number: 'SOL-002',
        client_id: 'c2',
        title: 'Barulho Estranho no Split',
        description: 'Equipamento emitindo ruído metálico forte ao ligar. Resfriamento parece normal por enquanto, mas o barulho incomoda os funcionários.',
        suggested_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        suggested_time_period: 'tarde',
        status: 'reagendado',
        priority: 'medium',
        created_at: new Date(Date.now() - 7200000).toISOString(),
        client_name: 'Shopping Alpha Mall',
        city: 'Barueri',
        state: 'SP',
        whatsapp_count: 0,
        requester_name: 'Ana Paula (Adm)',
        equipment_name: 'Split Sala Reunião 1',
        equipment_brand: 'Daikin',
        equipment_model: 'FTKC-25',
        rescheduled_reason: 'Cliente não terá ninguém para receber na data original.'
      },
      {
        id: 'req_3',
        request_number: 'SOL-003',
        client_id: 'c3',
        title: 'Parada Total - CPD',
        description: 'Ar condicionado do CPD parou de funcionar. Temperatura subindo rapidamente. CRÍTICO para os servidores!',
        suggested_date: new Date().toISOString().split('T')[0],
        suggested_time_period: 'manha',
        status: 'confirmado',
        priority: 'urgent',
        created_at: new Date(Date.now() - 1800000).toISOString(),
        client_name: 'Hospital Santa Clara',
        city: 'São Paulo',
        state: 'SP',
        whatsapp_count: 5,
        requester_name: 'Eng. Roberto',
        equipment_name: 'Ar Central CPD',
        equipment_brand: 'Trane',
        equipment_model: 'RTWD'
      },
      {
        id: 'req_4',
        request_number: 'SOL-004',
        client_id: 'c4',
        title: 'Manutenção Preventiva de Rotina',
        description: 'Solicitação de limpeza mensal dos filtros conforme contrato.',
        suggested_date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        suggested_time_period: 'qualquer',
        status: 'convertido',
        priority: 'low',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        client_name: 'Indústria MetalFlex',
        city: 'São Paulo',
        state: 'SP',
        whatsapp_count: 1,
        requester_name: 'Sérgio Santos',
        equipment_name: 'Split Recepção',
        equipment_brand: 'LG',
        equipment_model: 'Dual Inverter'
      }
    ];
    setRequests(mock);
    setLoading(false);
  }

  async function loadRequests() {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests_with_details')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao carregar solicitações');
    } finally {
      setLoading(false);
    }
  }

  const filteredRequests = requests.filter(r => {
    const matchesSearch =
      r.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase()) ||
      r.request_number?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pendente') return r.status === 'pendente' || r.status === 'reagendado';
    return r.status === statusFilter;
  });

  // Estatísticas
  const pendentes = requests.filter(r => r.status === 'pendente').length;
  const reagendados = requests.filter(r => r.status === 'reagendado').length;
  const confirmados = requests.filter(r => r.status === 'confirmado' || r.status === 'aceito').length;

  function openResponseModal(request: MaintenanceRequest) {
    setSelectedRequest(request);
    setResponseForm({
      action: 'confirmar',
      confirmed_date: request.suggested_date,
      admin_notes: ''
    });
    setShowModal(true);
  }

  async function handleRespond() {
    if (!selectedRequest || !profile) return;
    if (!responseForm.confirmed_date) {
      toast.error('Selecione uma data');
      return;
    }

    setSaving(true);
    try {
      const newStatus = responseForm.action === 'confirmar' ? 'confirmado' : 'reagendado';

      const { error } = await supabase
        .from('maintenance_requests')
        .update({
          status: newStatus,
          confirmed_date: `${responseForm.confirmed_date}T12:00:00`,
          admin_notes: responseForm.admin_notes || null,
          responded_by: profile.id,
          responded_at: new Date().toISOString()
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      toast.success(newStatus === 'confirmado' ? 'Data confirmada!' : 'Nova data enviada ao cliente!');
      setShowModal(false);
      loadRequests();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleConvertToContract(request: MaintenanceRequest) {
    if (!profile) return;
    if (!confirm('Converter esta solicitação em manutenção agendada?')) return;

    try {
      const { data, error } = await supabase.rpc('convert_maintenance_request_to_contract', {
        p_request_id: request.id,
        p_admin_id: profile.id
      });

      if (error) throw error;
      toast.success('Manutenção agendada com sucesso!');
      loadRequests();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  function openEditModal(request: MaintenanceRequest) {
    setSelectedRequest(request);
    setEditForm({
      title: request.title,
      description: request.description || '',
      suggested_date: request.confirmed_date || request.suggested_date,
      suggested_time_period: request.suggested_time_period,
      admin_notes: request.admin_notes || ''
    });
    setShowEditModal(true);
  }

  async function handleEditRequest() {
    if (!selectedRequest) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({
          title: editForm.title,
          description: editForm.description || null,
          confirmed_date: editForm.suggested_date ? `${editForm.suggested_date}T12:00:00` : null,
          admin_notes: editForm.admin_notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;
      toast.success('Solicitação atualizada!');
      setShowEditModal(false);
      loadRequests();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteRequest(request: MaintenanceRequest) {
    if (!confirm(`Excluir solicitação "${request.title}"?\n\nEsta ação não pode ser desfeita.`)) return;

    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .delete()
        .eq('id', request.id);

      if (error) throw error;
      toast.success('Solicitação excluída!');
      loadRequests();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleReschedule(request: MaintenanceRequest) {
    setSelectedRequest(request);
    setResponseForm({
      action: 'reagendar',
      confirmed_date: '',
      admin_notes: ''
    });
    setShowModal(true);
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'pendente': return 'bg-amber-500';
      case 'confirmado': return 'bg-emerald-500';
      case 'reagendado': return 'bg-blue-500';
      case 'aceito': return 'bg-emerald-500';
      case 'recusado': return 'bg-red-500';
      case 'cancelado': return 'bg-gray-500';
      case 'convertido': return 'bg-purple-500';
      case 'atrasado': return 'bg-red-600';
      case 'urgente': return 'bg-amber-600';
      default: return 'bg-gray-500';
    }
  }

  function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
      pendente: 'Aguardando',
      confirmado: 'Confirmado',
      reagendado: 'Nova Data',
      aceito: 'Aceito',
      recusado: 'Recusado',
      cancelado: 'Cancelado',
      convertido: 'Agendado',
      atrasado: 'Atrasado',
      urgente: 'Urgente'
    };
    return labels[status] || status;
  }

  function getTimePeriodLabel(period: string) {
    const labels: Record<string, string> = {
      manha: 'Manhã',
      tarde: 'Tarde',
      qualquer: 'Qualquer horário'
    };
    return labels[period] || period;
  }

  function getPriorityConfig(priority?: string) {
    switch (priority) {
      case 'urgent': return { label: 'URGENTE', color: 'text-red-600', bg: 'bg-red-50', pulse: true, dot: 'bg-red-500' };
      case 'high': return { label: 'ALTA', color: 'text-orange-600', bg: 'bg-orange-50', pulse: false, dot: 'bg-orange-500' };
      case 'medium': return { label: 'MÉDIA', color: 'text-blue-600', bg: 'bg-blue-50', pulse: false, dot: 'bg-blue-500' };
      case 'low': return { label: 'BAIXA', color: 'text-slate-600', bg: 'bg-slate-50', pulse: false, dot: 'bg-slate-400' };
      default: return { label: 'NORMAL', color: 'text-slate-500', bg: 'bg-slate-50', pulse: false, dot: 'bg-slate-300' };
    }
  }

  function RequestLifecycle({ status }: { status: string }) {
    const steps = [
      { id: 'pendente', label: 'Solicitado', activeStatuses: ['pendente', 'reagendado', 'confirmado', 'aceito', 'convertido'] },
      { id: 'análise', label: 'Em Análise', activeStatuses: ['reagendado', 'confirmado', 'aceito', 'convertido'] },
      { id: 'agendado', label: 'Agendado', activeStatuses: ['confirmado', 'aceito', 'convertido'] },
      { id: 'convertido', label: 'Concluído', activeStatuses: ['convertido'] },
    ];

    return (
      <div className="flex items-center justify-between w-full px-10 py-6 bg-white dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
        {steps.map((step, index) => {
          const isActive = step.activeStatuses.includes(status);
          const isLast = index === steps.length - 1;
          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-500/10' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                  {isActive ? <Check size={14} strokeWidth={3} /> : index + 1}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div className={`flex-1 h-0.5 mx-4 rounded-full transition-all ${isActive && steps[index + 1].activeStatuses.includes(status) ? 'bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-slate-100 dark:bg-white/5'}`} />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  function handleWhatsApp(request: MaintenanceRequest) {
    const phone = (request.client_phone || '').replace(/\D/g, '');
    const num = phone.length <= 11 ? '55' + phone : phone;
    const msg = `Olá ${request.requester_name || request.client_name}! Sobre sua solicitação de manutenção...`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  async function handleConfirmPresence(request: MaintenanceRequest) {
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({ status: 'confirmado' })
        .eq('id', request.id);

      if (error) throw error;
      toast.success('Presença do técnico confirmada!');
      loadRequests();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao confirmar presença');
    }
  }

  function handleConvertToMaintenance(request: MaintenanceRequest) {
    handleConvertToContract(request);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 animate-fadeIn pb-10">
      <style jsx global>{`
        @keyframes custom-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); box-shadow: 0 0 15px rgba(239, 68, 68, 0.5); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-urgent-pulse {
          animation: custom-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/20 text-white">
              <Clock size={28} strokeWidth={2.5} />
            </div>
            Solicitações <span className="text-amber-500">de Manutenção</span>
          </h1>
          <p className="text-slate-500 font-semibold mt-2 flex items-center gap-2">
            Inbox de Manutenção Corretiva
            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
            {pendentes} novas solicitações
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/maintenance" className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-white hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            <Calendar size={18} strokeWidth={2.5} />
            Cronograma Preventivo
          </Link>
        </div>
      </div>

      {/* Premium Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Aguardando', count: pendentes + reagendados, icon: Clock, color: 'shadow-amber-500/20 text-amber-600 bg-amber-100', filter: 'pendente', urgency: 'PRECISA DE RESPOSTA' },
          { label: 'Confirmadas', count: confirmados, icon: Check, color: 'shadow-emerald-500/20 text-emerald-600 bg-emerald-100', filter: 'confirmado', urgency: 'AGUARDANDO EXECUÇÃO' },
          { label: 'Total Geral', count: requests.length, icon: Calendar, color: 'shadow-indigo-500/20 text-indigo-600 bg-indigo-100', filter: 'all', urgency: 'HISTÓRICO COMPLETO' }
        ].map((stat) => (
          <div
            key={stat.filter}
            className={`relative group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 rounded-[32px] transition-all cursor-pointer hover:shadow-2xl hover:-translate-y-1 ${statusFilter === stat.filter ? 'ring-4 ring-indigo-500/10 border-indigo-200' : ''}`}
            onClick={() => setStatusFilter(stat.filter)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-2xl ${stat.color} dark:bg-opacity-10 shadow-lg`}>
                <stat.icon size={24} strokeWidth={3} />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.urgency}</span>
            </div>
            <p className="text-4xl font-black text-slate-800 dark:text-white leading-none tabular-nums tracking-tighter">{stat.count}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">{stat.label}</p>
            <div className={`absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-500 ${statusFilter === stat.filter ? 'w-full' : 'w-0 group-hover:w-1/3'}`} />
          </div>
        ))}
      </div>
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors`}>
            <Search size={22} strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="Buscar por protocolo, cliente ou descrição do problema..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[24px] h-16 pl-14 pr-8 text-sm font-bold text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-xl shadow-slate-200/20 dark:shadow-none"
          />
        </div>
      </div>

      {/* Split View Container */}
      <div className="flex flex-col lg:flex-row gap-6 h-[800px] overflow-hidden">
        {/* Left Side: Requests List */}
        <div className="w-full lg:w-5/12 xl:w-4/12 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
          {filteredRequests.length === 0 ? (
            <div className="bg-white/50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[40px] py-20 text-center">
              <Send className="w-16 h-16 mx-auto mb-4 text-slate-300 animate-pulse" />
              <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Nenhuma solicitação</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => setSelectedRequest(request)}
                className={`group relative p-5 rounded-[32px] border transition-all cursor-pointer hover:shadow-xl hover:-translate-y-0.5 ${selectedRequest?.id === request.id
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-indigo-300 text-slate-800 dark:text-slate-200'
                  }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110 ${selectedRequest?.id === request.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-white/5'}`}>
                      <Building2 size={20} className={selectedRequest?.id === request.id ? 'text-white' : 'text-indigo-600'} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-black text-[13px] uppercase tracking-tight line-clamp-1 font-outfit ${selectedRequest?.id === request.id ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                          {request.client_name}
                        </h3>
                        {request.priority && (
                          <div className={`w-1.5 h-1.5 rounded-full ${request.priority === 'urgent' ? 'bg-red-500 animate-pulse ring-2 ring-red-500/20' :
                            request.priority === 'high' ? 'bg-orange-500' :
                              request.priority === 'medium' ? 'bg-blue-500' :
                                'bg-slate-400'
                            }`} />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin size={10} className={selectedRequest?.id === request.id ? 'text-white/60' : 'text-slate-400'} />
                        <p className={`text-[9px] font-black uppercase tracking-widest ${selectedRequest?.id === request.id ? 'text-white/60' : 'text-slate-400'}`}>
                          {request.city} {request.state ? `- ${request.state}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[8px] font-black uppercase tracking-tighter px-2 py-1 rounded-full whitespace-nowrap shadow-sm ${request.display_status === 'atrasado' ? 'bg-red-500 text-white' :
                      request.display_status === 'urgente' ? 'bg-amber-500 text-white' :
                        request.status === 'pendente' ? (selectedRequest?.id === request.id ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-700') :
                          request.status === 'confirmado' ? (selectedRequest?.id === request.id ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700') :
                            'bg-slate-100 text-slate-600'
                      }`}>
                      {request.display_status === 'atrasado' ? 'Atrasado' :
                        request.display_status === 'urgente' ? 'Urgente' :
                          request.status === 'pendente' ? 'Pendente' :
                            request.status === 'aceito' ? 'Aceito' :
                              request.status === 'confirmado' ? 'Confirmado' :
                                request.status}
                    </span>
                  </div>
                </div>

                <div className={`text-[11px] font-medium line-clamp-2 mb-4 leading-relaxed font-inter ${selectedRequest?.id === request.id ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                  {request.description}
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-current opacity-10">
                  <div className="flex items-center gap-2">
                    <Clock size={12} />
                    <span className="text-[10px] font-black tabular-nums tracking-widest">
                      {new Date(request.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </span>
                  </div>
                  {request.whatsapp_count ? request.whatsapp_count > 0 && (
                    <div className="flex items-center gap-1.5 ring-1 ring-emerald-500/20 px-2 py-0.5 rounded-lg">
                      <MessageCircle size={10} className="text-emerald-500" />
                      <span className="text-[8px] font-black text-emerald-500">{request.whatsapp_count}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Detail & Interaction Panel */}
        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[40px] shadow-sm overflow-hidden flex flex-col relative animate-fadeIn">
          {selectedRequest ? (
            <>
              {/* Request Lifecycle Tracker */}
              <RequestLifecycle status={selectedRequest.status} />

              {/* Detail Header */}
              <div className="px-10 py-8 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center shadow-lg border border-slate-100 dark:border-white/5 text-indigo-600">
                    <Building2 size={32} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">{selectedRequest.client_name}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin size={14} className="text-slate-400" />
                      <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{selectedRequest.city}, {selectedRequest.state}</span>
                      <div className="w-1 h-1 bg-slate-300 rounded-full mx-1" />
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Protocolo #{selectedRequest.id.substring(0, 8)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => openEditModal(selectedRequest)} className="p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-400 hover:text-indigo-600 hover:shadow-sm transition-all active:scale-95">
                    <Edit size={20} />
                  </button>
                  <button onClick={() => handleDeleteRequest(selectedRequest)} className="p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-400 hover:text-red-500 hover:shadow-sm transition-all active:scale-95">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* Detail Content */}
              <div className="flex-1 overflow-y-auto px-10 py-10 space-y-12 custom-scrollbar">
                {/* Description Box */}
                <div className="relative">
                  <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                    <div className="w-8 h-1 bg-indigo-600 rounded-full" /> Descrição do Chamado
                  </h3>
                  <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[40px] border border-slate-100 dark:border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <FileText size={80} />
                    </div>
                    <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium italic relative z-10">
                      "{selectedRequest.description}"
                    </p>
                  </div>
                </div>

                {/* Tech Card - Equipment Snapshot */}
                {(selectedRequest.equipment_name) && (
                  <div className="relative">
                    <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                      <div className="w-8 h-1 bg-indigo-600 rounded-full" /> Snapshot do Equipamento
                    </h3>
                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-md p-8 rounded-[40px] border border-slate-200/50 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-none relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Info size={120} />
                      </div>
                      <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                        <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                          <Edit size={40} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 rounded-full text-[9px] font-black uppercase tracking-widest">
                              Manutenção Ativa
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">ID: {selectedRequest.id.substring(0, 6)}</span>
                          </div>
                          <h4 className="text-xl font-black text-slate-800 dark:text-white mb-2">{selectedRequest.equipment_name}</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Marca</p>
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedRequest.equipment_brand || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Modelo</p>
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedRequest.equipment_model || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600">
                        <User size={18} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Solicitante</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedRequest.requester_name || 'Não informado'}</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600">
                        <MessageCircle size={18} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white tabular-nums">{selectedRequest.client_phone || 'Não informado'}</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-100 dark:border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600">
                        <Calendar size={18} strokeWidth={2.5} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Sugerida</span>
                    </div>
                    <p className="text-sm font-black text-slate-800 dark:text-white tabular-nums">
                      {selectedRequest.suggested_date ? new Date(selectedRequest.suggested_date + 'T12:00:00').toLocaleDateString('pt-BR') : 'A definir'}
                    </p>
                  </div>
                </div>

                {/* Admin Notes */}
                {(selectedRequest.admin_notes || selectedRequest.rescheduled_reason) && (
                  <div>
                    <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] mb-6">Histórico & Notas</h3>
                    <div className="space-y-4">
                      {selectedRequest.rescheduled_reason && (
                        <div className="p-6 bg-blue-50 dark:bg-blue-500/5 rounded-[32px] border border-blue-100 dark:border-blue-500/10 flex gap-4">
                          <Info className="text-blue-500 shrink-0" size={20} />
                          <div>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Motivo do Reagendamento</p>
                            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">{selectedRequest.rescheduled_reason}</p>
                          </div>
                        </div>
                      )}
                      {selectedRequest.admin_notes && (
                        <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-[32px] border border-slate-100 dark:border-white/10 flex gap-4">
                          <Edit className="text-slate-400 shrink-0" size={20} />
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Notas Administrativas</p>
                            <p className="text-sm text-slate-800 dark:text-slate-300 font-medium">{selectedRequest.admin_notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Detail Footer: Instant Actions */}
              <div className="px-10 py-8 bg-white/40 dark:bg-white/5 backdrop-blur-lg border-t border-slate-200/50 dark:border-white/10 flex flex-wrap items-center justify-between gap-6">
                {/* Primary Actions */}
                <div className="flex flex-wrap items-center gap-4">
                  {selectedRequest.status === 'pendente' && (
                    <button
                      onClick={() => openResponseModal(selectedRequest)}
                      className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/40 active:scale-95 transition-all flex items-center gap-3"
                    >
                      <Check size={20} strokeWidth={3} /> Responder
                    </button>
                  )}

                  {selectedRequest.status === 'aceito' && (
                    <button
                      onClick={() => handleConfirmPresence(selectedRequest)}
                      className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/40 active:scale-95 transition-all flex items-center gap-3"
                    >
                      <CheckCircle size={20} strokeWidth={3} /> Confirmar Técnico
                    </button>
                  )}

                  {(selectedRequest.status === 'confirmado' || selectedRequest.status === 'reagendado') && (
                    <button
                      onClick={() => handleConvertToMaintenance(selectedRequest)}
                      className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/40 active:scale-95 transition-all flex items-center gap-3"
                    >
                      <ArrowRight size={20} strokeWidth={3} /> Gerar Manutenção
                    </button>
                  )}
                </div>

                {/* Secondary Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  {selectedRequest.client_phone && (
                    <button
                      onClick={() => handleWhatsApp(selectedRequest)}
                      className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition-all active:scale-95 shadow-sm"
                      title="Chamar no WhatsApp"
                    >
                      <MessageCircle size={20} strokeWidth={2.5} />
                    </button>
                  )}

                  <button
                    onClick={() => handleReschedule(selectedRequest)}
                    className="flex items-center gap-3 px-6 py-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-white hover:bg-white dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"
                  >
                    <CalendarClock size={20} strokeWidth={2.5} /> Reagendar
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-20 relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

              <div className="relative z-10 animate-float">
                <div className="w-48 h-48 bg-white dark:bg-white/5 backdrop-blur-xl rounded-[60px] border border-slate-200/50 dark:border-white/10 flex items-center justify-center mb-10 shadow-2xl shadow-indigo-500/10 mx-auto transform -rotate-6 group-hover:rotate-0 transition-transform duration-700">
                  <div className="p-8 bg-indigo-600 rounded-[40px] shadow-lg shadow-indigo-600/20 text-white">
                    <Send size={64} strokeWidth={2} className="animate-pulse" />
                  </div>
                </div>
                <h3 className="text-4xl font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-4 font-outfit">
                  Inbox de <span className="text-indigo-600">Trabalho</span>
                </h3>
                <p className="max-w-md text-slate-500 font-bold uppercase tracking-widest text-[10px] leading-relaxed mx-auto italic">
                  Aguardando sua próxima grande missão. Selecione uma solicitação ao lado para começar a agir.
                </p>
                <div className="mt-12 flex items-center justify-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" /> Sistema Operacional
                  </div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" /> Monitoramento em Tempo Real
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Resposta */}
      {showModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Responder Solicitação</h2>
              <p className="text-gray-500">{selectedRequest.request_number}</p>
            </div>

            <div className="p-6 space-y-4">
              {/* Info do Cliente */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-800">{selectedRequest.client_name}</p>
                {selectedRequest.requester_name && (
                  <p className="text-sm text-indigo-600">Solicitado por: {selectedRequest.requester_name}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">{selectedRequest.title}</p>
              </div>

              {/* Data Sugerida */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-700 font-medium mb-1">Data sugerida pelo cliente:</p>
                <p className="text-lg font-bold text-amber-800">
                  {new Date(selectedRequest.suggested_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                </p>
                <p className="text-sm text-amber-600">{getTimePeriodLabel(selectedRequest.suggested_time_period)}</p>
              </div>

              {/* Ação */}
              <div>
                <label className="label">Ação</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setResponseForm(prev => ({
                        ...prev,
                        action: 'confirmar',
                        confirmed_date: selectedRequest.suggested_date
                      }));
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${responseForm.action === 'confirmar'
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <Check className={`w-6 h-6 mx-auto mb-2 ${responseForm.action === 'confirmar' ? 'text-emerald-600' : 'text-gray-400'
                      }`} />
                    <p className="font-semibold text-gray-800">Confirmar</p>
                    <p className="text-xs text-gray-500">Aceitar a data sugerida</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setResponseForm(prev => ({ ...prev, action: 'reagendar' }))}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${responseForm.action === 'reagendar'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <Calendar className={`w-6 h-6 mx-auto mb-2 ${responseForm.action === 'reagendar' ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                    <p className="font-semibold text-gray-800">Reagendar</p>
                    <p className="text-xs text-gray-500">Sugerir outra data</p>
                  </button>
                </div>
              </div>

              {/* Data */}
              <div>
                <label className="label">
                  {responseForm.action === 'confirmar' ? 'Data Confirmada' : 'Nova Data Sugerida'} *
                </label>
                <input
                  type="date"
                  value={responseForm.confirmed_date}
                  onChange={(e) => setResponseForm(prev => ({ ...prev, confirmed_date: e.target.value }))}
                  className="input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Observação */}
              <div>
                <label className="label">Observação (opcional)</label>
                <textarea
                  value={responseForm.admin_notes}
                  onChange={(e) => setResponseForm(prev => ({ ...prev, admin_notes: e.target.value }))}
                  className="input min-h-[80px]"
                  placeholder="Ex: Técnico disponível apenas pela manhã..."
                />
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button onClick={() => setShowModal(false)} className="btn btn-secondary flex-1">
                Cancelar
              </button>
              <button onClick={handleRespond} disabled={saving} className="btn btn-primary flex-1">
                {saving ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <Send size={16} />
                    {responseForm.action === 'confirmar' ? 'Confirmar Data' : 'Enviar Nova Data'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {showEditModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Editar Solicitação</h2>
              <p className="text-gray-500">{selectedRequest.request_number}</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="label">Título *</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Descrição</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="input min-h-[80px]"
                  placeholder="Descrição da solicitação..."
                />
              </div>

              <div>
                <label className="label">Data</label>
                <input
                  type="date"
                  value={editForm.suggested_date}
                  onChange={(e) => setEditForm(prev => ({ ...prev, suggested_date: e.target.value }))}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Período</label>
                <select
                  value={editForm.suggested_time_period}
                  onChange={(e) => setEditForm(prev => ({ ...prev, suggested_time_period: e.target.value }))}
                  className="input"
                >
                  <option value="manha">Manhã</option>
                  <option value="tarde">Tarde</option>
                  <option value="qualquer">Qualquer horário</option>
                </select>
              </div>

              <div>
                <label className="label">Observação do Admin</label>
                <textarea
                  value={editForm.admin_notes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, admin_notes: e.target.value }))}
                  className="input min-h-[60px]"
                  placeholder="Observações internas..."
                />
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button onClick={() => setShowEditModal(false)} className="btn btn-secondary flex-1">
                Cancelar
              </button>
              <button onClick={handleEditRequest} disabled={saving} className="btn btn-primary flex-1">
                {saving ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <Check size={16} />
                    Salvar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
