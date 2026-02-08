'use client';
// Fix: alert_days_before array conversion v2

import { useState, useEffect, useRef } from 'react';
// Removendo supabase import para garantir 100% Mock Data
// import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { Plus, Search, Edit, Trash2, Loader2, Calendar, AlertTriangle, Clock, Mail, MessageCircle, CheckCircle, Bell, Eye, X, List, LayoutGrid, ChevronLeft, ChevronRight, Navigation, MapPin, User, Building2, Activity, ExternalLink, Quote } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePermissions } from '@/hooks/usePermissions';

interface Contract {
  id: string;
  client_id: string;
  title: string;
  description?: string;
  frequency: string;
  next_maintenance_date: string;
  last_maintenance_date?: string;
  maintenance_value?: number;
  status: string;
  send_email_alert: boolean;
  send_whatsapp_alert: boolean;
  alert_days_before: number[];
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  maintenance_type_name?: string;
  maintenance_color?: string;
  urgency_status?: string;
  days_until_maintenance?: number;
  planned_next_date?: string; // NOVO: Data personalizada para o ciclo seguinte
}



export default function MaintenancePage() {
  const { can } = usePermissions();
  const { profile } = useAuthStore();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [maintenanceTypes, setMaintenanceTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'contracts' | 'requests'>('contracts');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isDemoMode } = useAuthStore();

  // Enterprise Filters
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i).toString());
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    client_id: '',
    maintenance_type_id: '',
    title: '',
    description: '',
    frequency: 'anual',
    next_maintenance_date: '',
    last_maintenance_date: '',
    maintenance_value: 0,
    send_email_alert: true,
    send_whatsapp_alert: true,
    alert_days_before: [30, 15, 7],
    status: 'ativo',
    planned_next_date: '', // NOVO
  });

  // Modal Conclusão
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionData, setCompletionData] = useState({
    contractId: '',
    contractTitle: '',
    completedDate: '',
    nextDate: '',
    frequency: 'anual'
  });

  const nextDateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMockData();
  }, []);

  function loadMockData() {
    console.log('Utilizando dados fictícios para demonstração');
    const today = new Date();

    const mockClients = [
      { id: 'c1', name: 'Condomínio Solar das Palmeiras', email: 'contato@solar.com', phone: '11999998888' },
      { id: 'c2', name: 'Shopping Alpha Mall', email: 'adm@alpha.com', phone: '11988887777' },
      { id: 'c3', name: 'Indústria MetalFlex', email: 'manutencao@metalflex.com', phone: '11977776666' },
      { id: 'c4', name: 'Hospital Santa Maria', email: 'infra@hsm.com', phone: '11966665555' }
    ];

    const mockTypes = [
      { id: 't1', name: 'Ar Condicionado Central', color: '#3b82f6' },
      { id: 't2', name: 'Geradores de Energia', color: '#f59e0b' },
      { id: 't3', name: 'Elevadores Sociais', color: '#10b981' },
      { id: 't4', name: 'Sistemas de Incêndio', color: '#ef4444' }
    ];

    const generateMockDate = (daysOffset: number) => {
      const d = new Date();
      // Noon Fix to avoid offset issues
      d.setHours(12, 0, 0, 0);
      d.setDate(d.getDate() + daysOffset);
      return d.toISOString().split('T')[0];
    };

    const mockContracts: Contract[] = [
      {
        id: 'm1',
        client_id: 'c1',
        client_name: 'Condomínio Solar das Palmeiras',
        title: 'Manutenção Mensal Ar Digital',
        maintenance_type_name: 'Ar Condicionado Central',
        maintenance_color: '#3b82f6',
        frequency: 'mensal',
        last_maintenance_date: generateMockDate(-35),
        next_maintenance_date: generateMockDate(-2), // Vencida
        maintenance_value: 1250,
        status: 'ativo',
        send_email_alert: true,
        send_whatsapp_alert: true,
        alert_days_before: [30, 15, 7],
        urgency_status: 'vencido',
        days_until_maintenance: -2,
        client_phone: '11999998888',
        client_email: 'contato@solar.com'
      },
      {
        id: 'm2',
        client_id: 'c2',
        client_name: 'Shopping Alpha Mall',
        title: 'Revisão Técnica Gerador 500kVA',
        maintenance_type_name: 'Geradores de Energia',
        maintenance_color: '#f59e0b',
        frequency: 'trimestral',
        last_maintenance_date: generateMockDate(-85),
        next_maintenance_date: generateMockDate(1), // Urgente (Amanhã)
        maintenance_value: 3400,
        status: 'ativo',
        send_email_alert: true,
        send_whatsapp_alert: true,
        alert_days_before: [30, 15, 7],
        urgency_status: 'urgente',
        days_until_maintenance: 1,
        client_phone: '11988887777',
        client_email: 'adm@alpha.com'
      },
      {
        id: 'm3',
        client_id: 'c3',
        client_name: 'Indústria MetalFlex',
        title: 'Inspeção de Elevadores Sociais',
        maintenance_type_name: 'Elevadores Sociais',
        maintenance_color: '#10b981',
        frequency: 'mensal',
        last_maintenance_date: generateMockDate(-25),
        next_maintenance_date: generateMockDate(5),
        maintenance_value: 5800,
        status: 'ativo',
        send_email_alert: true,
        send_whatsapp_alert: true,
        alert_days_before: [30, 15, 7],
        urgency_status: 'urgente',
        days_until_maintenance: 5,
        client_phone: '11977776666'
      },
      {
        id: 'm4',
        client_id: 'c4',
        client_name: 'Hospital Santa Maria',
        title: 'Recarga de Extintores e Sensores',
        maintenance_type_name: 'Sistemas de Incêndio',
        maintenance_color: '#ef4444',
        frequency: 'semestral',
        last_maintenance_date: generateMockDate(-170),
        next_maintenance_date: generateMockDate(12),
        maintenance_value: 2100,
        status: 'ativo',
        urgency_status: 'proximo',
        days_until_maintenance: 12,
        client_phone: '11966665555',
        send_email_alert: true,
        send_whatsapp_alert: true,
        alert_days_before: [30, 15, 7]
      },
      {
        id: 'm5',
        client_id: 'c1',
        client_name: 'Condomínio Solar das Palmeiras',
        title: 'Limpeza de Caixas d\'Água',
        maintenance_type_name: 'Saneamento e Hidráulica',
        maintenance_color: '#06b6d4',
        frequency: 'semestral',
        last_maintenance_date: generateMockDate(-150),
        next_maintenance_date: generateMockDate(0), // Hoje
        maintenance_value: 950,
        status: 'ativo',
        urgency_status: 'urgente',
        days_until_maintenance: 0,
        client_phone: '11999998888',
        send_email_alert: true,
        send_whatsapp_alert: true,
        alert_days_before: [30, 15, 7]
      },
      {
        id: 'm6',
        client_id: 'c2',
        client_name: 'Shopping Alpha Mall',
        title: 'Manutenção Preventiva Escada Rolante',
        maintenance_type_name: 'Transporte Vertical',
        maintenance_color: '#8b5cf6',
        frequency: 'mensal',
        last_maintenance_date: generateMockDate(-20),
        next_maintenance_date: generateMockDate(20),
        maintenance_value: 4200,
        status: 'ativo',
        urgency_status: 'proximo',
        days_until_maintenance: 20,
        client_phone: '11988887777',
        send_email_alert: true,
        send_whatsapp_alert: true,
        alert_days_before: [30, 15, 7]
      },
      {
        id: 'm7',
        client_id: 'c3',
        client_name: 'Indústria MetalFlex',
        title: 'Calibração de Máquinas CNC',
        maintenance_type_name: 'Maquinário Industrial',
        maintenance_color: '#64748b',
        frequency: 'bimestral',
        last_maintenance_date: generateMockDate(-45),
        next_maintenance_date: generateMockDate(-10), // Vencida
        maintenance_value: 7800,
        status: 'ativo',
        urgency_status: 'vencido',
        days_until_maintenance: -10,
        client_phone: '11977776666',
        send_email_alert: true,
        send_whatsapp_alert: true,
        alert_days_before: [30, 15, 7]
      },
      {
        id: 'm8',
        client_id: 'c4',
        client_name: 'Hospital Santa Maria',
        title: 'Troca de Filtros HEPA - Centro Cirúrgico',
        maintenance_type_name: 'Qualidade do Ar',
        maintenance_color: '#f43f5e',
        frequency: 'trimestral',
        last_maintenance_date: generateMockDate(-70),
        next_maintenance_date: generateMockDate(25),
        maintenance_value: 12400,
        status: 'ativo',
        urgency_status: 'proximo',
        days_until_maintenance: 25,
        client_phone: '11966665555',
        send_email_alert: true,
        send_whatsapp_alert: true,
        alert_days_before: [30, 15, 7]
      }
    ];

    setContracts(mockContracts);
    setClients(mockClients);
    setMaintenanceTypes(mockTypes);
    setLoading(false);
  }

  async function loadData() {
    setLoading(true);
    // Desvinculado do banco de dados - Usando apenas Mock Data
    loadMockData();
  }

  // Calcular próxima data baseado na frequência (Timezone Safe - Noon Fix)
  function calculateNextDate(baseDate: string, frequency: string): string {
    if (!baseDate) return '';
    // Append T12:00:00 to ensure we are calculating from Noon (safe from DST/Timezone shifts)
    const date = new Date(`${baseDate}T12:00:00`);

    switch (frequency) {
      case 'mensal': date.setMonth(date.getMonth() + 1); break;
      case 'bimestral': date.setMonth(date.getMonth() + 2); break;
      case 'trimestral': date.setMonth(date.getMonth() + 3); break;
      case 'semestral': date.setMonth(date.getMonth() + 6); break;
      case 'anual': date.setFullYear(date.getFullYear() + 1); break;
    }
    return date.toISOString().split('T')[0];
  }

  // Quando muda a frequência, recalcula a próxima data
  function handleFrequencyChange(newFrequency: string) {
    const baseDate = formData.last_maintenance_date || new Date().toISOString().split('T')[0];
    const nextDate = calculateNextDate(baseDate, newFrequency);
    setFormData(prev => ({ ...prev, frequency: newFrequency, next_maintenance_date: nextDate }));
  }

  // Quando muda a última manutenção, recalcula a próxima
  function handleLastDateChange(newDate: string) {
    const nextDate = calculateNextDate(newDate, formData.frequency);
    setFormData(prev => ({ ...prev, last_maintenance_date: newDate, next_maintenance_date: nextDate }));
  }

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(search.toLowerCase()) ||
      contract.client_name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.urgency_status === statusFilter;

    // Data Filter (Proxima Manutenção)
    let matchesDate = true;
    if (contract.next_maintenance_date) {
      const date = new Date(contract.next_maintenance_date + 'T12:00:00');
      const matchesMonth = selectedMonth === 'all' || date.getMonth().toString() === selectedMonth;
      const matchesYear = selectedYear === 'all' || date.getFullYear().toString() === selectedYear;
      matchesDate = matchesMonth && matchesYear;
    } else if (selectedMonth !== 'all' || selectedYear !== 'all') {
      matchesDate = false;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });


  // Estatísticas
  const vencidos = contracts.filter(c => c.urgency_status === 'vencido').length;
  const urgentes = contracts.filter(c => c.urgency_status === 'urgente').length;
  const proximos = contracts.filter(c => c.urgency_status === 'proximo').length;
  const futuros = contracts.filter(c => c.urgency_status === 'futuro').length;

  function openModal(contract?: Contract) {
    if (contract) {
      setEditingContract(contract);
      // Garantir que alert_days_before seja um array de números
      let alertDays = [30, 15, 7];
      if (contract.alert_days_before) {
        if (Array.isArray(contract.alert_days_before)) {
          alertDays = contract.alert_days_before.map(Number).filter(n => !isNaN(n));
        } else if (typeof contract.alert_days_before === 'string') {
          try {
            const parsed = JSON.parse(contract.alert_days_before);
            alertDays = Array.isArray(parsed) ? parsed.map(Number).filter(n => !isNaN(n)) : [30, 15, 7];
          } catch { alertDays = [30, 15, 7]; }
        }
      }
      setFormData({
        client_id: contract.client_id,
        maintenance_type_id: '',
        title: contract.title,
        description: contract.description || '',
        frequency: contract.frequency,
        next_maintenance_date: contract.next_maintenance_date,
        last_maintenance_date: contract.last_maintenance_date || '',
        maintenance_value: contract.maintenance_value || 0,
        send_email_alert: contract.send_email_alert ?? true,
        send_whatsapp_alert: contract.send_whatsapp_alert ?? true,
        alert_days_before: alertDays,
        status: contract.status,
        planned_next_date: contract.planned_next_date ? String(contract.planned_next_date).substring(0, 10) : '', // CORREÇÃO: Robust extract first 10 chars
      });
    } else {
      setEditingContract(null);
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        client_id: '',
        maintenance_type_id: '',
        title: '',
        description: '',
        frequency: 'anual',
        next_maintenance_date: calculateNextDate(today, 'anual'),
        last_maintenance_date: '',
        maintenance_value: 0,
        send_email_alert: true,
        send_whatsapp_alert: true,
        alert_days_before: [30, 15, 7],
        status: 'ativo',
        planned_next_date: '', // NOVO
      });
    }
    setShowModal(true);
  }

  function openDetails(contract: Contract) {
    setSelectedContract(contract);
    setDrawerOpen(true);
  }

  async function handleSave() {
    if (!formData.client_id || !formData.title || !formData.next_maintenance_date) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    setSaving(true);
    try {
      const contractData = {
        client_id: formData.client_id,
        title: formData.title,
        description: formData.description || undefined,
        frequency: formData.frequency,
        next_maintenance_date: formData.next_maintenance_date,
        last_maintenance_date: formData.last_maintenance_date || undefined,
        maintenance_value: formData.maintenance_value || undefined,
        send_email_alert: formData.send_email_alert,
        send_whatsapp_alert: formData.send_whatsapp_alert,
        status: formData.status,
        planned_next_date: formData.planned_next_date || undefined,
      };

      // Ensure next_maintenance_date is set to noon to avoid timezone issues
      if (formData.next_maintenance_date) {
        contractData.next_maintenance_date = `${formData.next_maintenance_date}T12:00:00`;
      }

      // Simulação de salvamento local (Mock Mode)
      if (editingContract) {
        setContracts(contracts.map(c => c.id === editingContract.id ? { ...c, ...contractData } : c));
        toast.success('Manutenção atualizada (Mock)!');
      } else {
        const newContract: Contract = {
          ...contractData,
          id: `m${Date.now()}`,
          maintenance_color: '#6366f1',
          urgency_status: 'futuro',
          days_until_maintenance: 30,
          alert_days_before: formData.alert_days_before
        };
        setContracts([newContract, ...contracts]);
        toast.success('Manutenção criada (Mock)!');
      }
      setShowModal(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(contract: Contract) {
    if (!confirm(`Excluir manutenção "${contract.title}"?`)) return;

    setContracts(contracts.filter(c => c.id !== contract.id));
    toast.success('Manutenção excluída (Mock)!');
    setDrawerOpen(false);
  }

  // Verificar se pode concluir (só na data agendada ou depois)
  function canComplete(contract: Contract): boolean {
    const today = new Date().toISOString().split('T')[0];
    const scheduledDate = contract.next_maintenance_date;
    return today >= scheduledDate;
  }

  function getNextAfterCurrent(contract: Contract): string {
    return calculateNextDate(contract.next_maintenance_date, contract.frequency);
  }

  // Abrir Modal de Conclusão (Substitui o confirm direto)
  function handleMarkCompleted(contract: Contract) {
    const today = new Date().toISOString().split('T')[0];
    // Se existir planned_next_date, usa ela. Senão calcula.
    const nextDate = contract.planned_next_date || calculateNextDate(today, contract.frequency);

    // Verificar se pode concluir
    if (today < contract.next_maintenance_date) {
      toast.error(`⚠️ Só é possível concluir esta manutenção a partir de ${new Date(contract.next_maintenance_date + 'T12:00:00').toLocaleDateString('pt-BR')}`);
      return;
    }

    setCompletionData({
      contractId: contract.id,
      contractTitle: contract.title,
      completedDate: today,
      nextDate: nextDate,
      frequency: contract.frequency
    });
    setShowCompletionModal(true);
  }

  // Efetivar Conclusão
  async function confirmCompletion() {
    if (!completionData.contractId) return;
    setSaving(true);

    try {
      // Simulação de conclusão local
      setContracts(contracts.map(c =>
        c.id === completionData.contractId
          ? {
            ...c,
            last_maintenance_date: completionData.completedDate,
            next_maintenance_date: completionData.nextDate
          }
          : c
      ));

      toast.success(`Manutenção concluída! Próxima: ${new Date(completionData.nextDate + 'T12:00:00').toLocaleDateString('pt-BR')}`);
      setShowCompletionModal(false);
      setDrawerOpen(false);
      setShowDetailsModal(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function sendReminder(contract: Contract, type: 'email' | 'whatsapp') {
    const nextDate = new Date(contract.next_maintenance_date + 'T12:00:00').toLocaleDateString('pt-BR');
    const message = `Olá ${contract.client_name}!\n\nSua manutenção preventiva de ${contract.maintenance_type_name || contract.title} está programada para ${nextDate}.\n\nPor favor, entre em contato conosco para confirmar o agendamento.\n\nAtenciosamente,\nEquipe de Manutenção`;

    if (type === 'whatsapp') {
      if (!contract.client_phone) {
        toast.error('Cliente não possui telefone cadastrado');
        return;
      }
      const phone = contract.client_phone.replace(/\D/g, '');
      const num = phone.length <= 11 ? '55' + phone : phone;
      window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      if (!contract.client_email) {
        toast.error('Cliente não possui email cadastrado');
        return;
      }
      const subject = encodeURIComponent('Lembrete: Manutenção Preventiva Programada');
      window.open(`mailto:${contract.client_email}?subject=${subject}&body=${encodeURIComponent(message)}`, '_blank');
    }

    // Simulação de registro de alerta (ignorado no Mock Mode)
    toast.success(`${type === 'email' ? 'Email' : 'WhatsApp'} aberto! (Simulação)`);
  }

  const getUrgencyColor = (status: string) => {
    switch (status) {
      case 'vencido': return 'bg-red-500';
      case 'urgente': return 'bg-amber-500';
      case 'proximo': return 'bg-blue-500';
      default: return 'bg-emerald-500';
    }
  };

  const getUrgencyLabel = (status: string, days: number) => {
    if (status === 'vencido') return `Vencido (${Math.abs(days)} dias)`;
    if (status === 'urgente') return `Urgente (${days} dias)`;
    if (status === 'proximo') return `${days} dias`;
    return `${days} dias`;
  };

  const getFrequencyLabel = (freq: string) => {
    const labels: Record<string, string> = { mensal: 'Mensal', bimestral: 'Bimestral', trimestral: 'Trimestral', semestral: 'Semestral', anual: 'Anual' };
    return labels[freq] || freq;
  };

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
        @keyframes subtle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .calendar-grid-cell {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .calendar-grid-cell:hover {
          z-index: 10;
          transform: scale(1.02);
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }
        .task-chip {
          transition: all 0.2s ease;
        }
        .task-chip:hover {
          transform: translateX(4px);
          filter: brightness(1.1);
        }
        @keyframes slide-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-right 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 transition-all">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
              <Calendar size={28} strokeWidth={2.5} />
            </div>
            Manutenções <span className="text-indigo-600">Periódicas</span>
          </h1>
          <div className="mt-2">
            <p className="text-slate-500 font-semibold">{contracts.length} contratos ativos</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* View Toggle */}
          <div className="flex items-center p-1 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-white/10 w-full sm:w-auto shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${viewMode === 'grid'
                ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-white/5'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
            >
              <LayoutGrid size={14} strokeWidth={3} />
              GRADE
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${viewMode === 'list'
                ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-white/5'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
            >
              <List size={14} strokeWidth={3} />
              LISTA
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${viewMode === 'calendar'
                ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-100 dark:border-white/5'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
            >
              <Calendar size={14} strokeWidth={3} />
              AGENDA
            </button>
          </div>

          {can('can_create_orders') && (
            <button onClick={() => openModal()} className="w-full sm:w-auto px-6 py-3 rounded-2xl flex items-center justify-center gap-2 font-black shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:scale-95 transition-all bg-indigo-600 text-white text-[11px] uppercase tracking-widest">
              <Plus size={18} strokeWidth={3} />
              Nova Manutenção
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Vencidos */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'vencido' ? 'all' : 'vencido')}
          className={`relative group overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 rounded-[32px] transition-all cursor-pointer hover:shadow-2xl hover:-translate-y-1 ${statusFilter === 'vencido' ? 'ring-4 ring-red-500/20 bg-red-50/50 dark:bg-red-500/10 border-red-200' : ''}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-4 bg-red-100 dark:bg-red-500/20 rounded-2xl text-red-600 h-14 w-14 flex items-center justify-center">
              <AlertTriangle size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">URGÊNCIA MÁXIMA</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status Ativo</span>
            </div>
          </div>
          <p className="text-5xl font-black text-slate-800 dark:text-white leading-none tabular-nums tracking-tighter">{vencidos}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 px-1">Manutenções Vencidas</p>
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors" />
          <div className={`absolute bottom-0 left-0 h-1 bg-red-500 transition-all duration-500 ${statusFilter === 'vencido' ? 'w-full' : 'w-0 group-hover:w-1/3'}`} />
        </div>

        {/* Urgentes */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'urgente' ? 'all' : 'urgente')}
          className={`relative group overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 rounded-[32px] transition-all cursor-pointer hover:shadow-2xl hover:-translate-y-1 ${statusFilter === 'urgente' ? 'ring-4 ring-amber-500/20 bg-amber-50/50 dark:bg-amber-500/10 border-amber-200' : ''}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-4 bg-amber-100 dark:bg-amber-500/20 rounded-2xl text-amber-600 h-14 w-14 flex items-center justify-center">
              <Clock size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">PRÓXIMA SEMANA</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status Ativo</span>
            </div>
          </div>
          <p className="text-5xl font-black text-slate-800 dark:text-white leading-none tabular-nums tracking-tighter">{urgentes}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 px-1">Críticas / Urgentes</p>
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors" />
          <div className={`absolute bottom-0 left-0 h-1 bg-amber-500 transition-all duration-500 ${statusFilter === 'urgente' ? 'w-full' : 'w-0 group-hover:w-1/3'}`} />
        </div>

        {/* Proximos */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'proximo' ? 'all' : 'proximo')}
          className={`relative group overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 rounded-[32px] transition-all cursor-pointer hover:shadow-2xl hover:-translate-y-1 ${statusFilter === 'proximo' ? 'ring-4 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-200' : ''}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-4 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl text-indigo-600 h-14 w-14 flex items-center justify-center">
              <Calendar size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">30 DIAS</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status Ativo</span>
            </div>
          </div>
          <p className="text-5xl font-black text-slate-800 dark:text-white leading-none tabular-nums tracking-tighter">{proximos}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 px-1">Agendadas Breve</p>
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />
          <div className={`absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-500 ${statusFilter === 'proximo' ? 'w-full' : 'w-0 group-hover:w-1/3'}`} />
        </div>

        {/* Futuros */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'futuro' ? 'all' : 'futuro')}
          className={`relative group overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 rounded-[32px] transition-all cursor-pointer hover:shadow-2xl hover:-translate-y-1 ${statusFilter === 'futuro' ? 'ring-4 ring-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/10 border-emerald-200' : ''}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-4 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl text-emerald-600 h-14 w-14 flex items-center justify-center">
              <CheckCircle size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">LONGO PRAZO</span>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status Ativo</span>
            </div>
          </div>
          <p className="text-5xl font-black text-slate-800 dark:text-white leading-none tabular-nums tracking-tighter">{futuros}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 px-1">Manutenções em Dia</p>
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
          <div className={`absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-500 ${statusFilter === 'futuro' ? 'w-full' : 'w-0 group-hover:w-1/3'}`} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          <input
            type="text"
            placeholder="Buscar por título ou cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl h-12 pl-12 pr-4 text-sm font-semibold text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl h-12 px-4 text-sm font-semibold text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-full sm:w-40 appearance-none cursor-pointer"
          >
            <option value="all">Todos os Meses</option>
            {months.map((m, i) => (
              <option key={i} value={i.toString()}>{m}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl h-12 px-4 text-sm font-semibold text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-full sm:w-28 appearance-none cursor-pointer"
          >
            <option value="all">Todos os Anos</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl h-12 px-4 text-sm font-semibold text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-full sm:w-48 appearance-none cursor-pointer"
          >
            <option value="all">Todas as Urgências</option>
            <option value="vencido">⚠️ Vencidas</option>
            <option value="urgente">🔔 Urgentes (7 dias)</option>
            <option value="proximo">📅 Próximas (30 dias)</option>
            <option value="futuro">✅ Futuras</option>
          </select>
          {statusFilter !== 'all' && (
            <button
              onClick={() => setStatusFilter('all')}
              className="btn btn-secondary px-3"
              title="Limpar Filtros"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Content View Content */}
      {
        viewMode === 'grid' ? (
          /* Premium Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {filteredContracts.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white/50 dark:bg-white/5 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-white/10">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300 animate-pulse" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Nenhum contrato encontrado</p>
              </div>
            ) : (
              filteredContracts.map((contract) => (
                <div
                  key={contract.id}
                  onClick={() => openDetails(contract)}
                  className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[32px] p-6 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 cursor-pointer overflow-hidden"
                >
                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
                          style={{ backgroundColor: contract.maintenance_color || '#6366f1', boxShadow: `0 8px 16px -4px ${(contract.maintenance_color || '#6366f1')}40` }}
                        >
                          <Calendar size={28} className="text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 dark:text-white leading-tight line-clamp-1 text-lg">{contract.title}</h3>
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">
                            {contract.maintenance_type_name || 'Geral'}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-white whitespace-nowrap shadow-sm ${getUrgencyColor(contract.urgency_status || 'futuro')}`}>
                        {getUrgencyLabel(contract.urgency_status || 'futuro', contract.days_until_maintenance || 0)}
                      </span>
                    </div>

                    {/* Cliente Info */}
                    <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 mb-6 border border-slate-100 dark:border-white/5 group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-500/5 transition-colors">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Cliente / Unidade</p>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 line-clamp-1">{contract.client_name}</p>
                    </div>

                    {/* Timeline Row */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="text-center">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Última</div>
                        <div className="text-xs font-bold text-slate-600 dark:text-slate-400 tabular-nums">
                          {contract.last_maintenance_date
                            ? new Date(contract.last_maintenance_date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
                            : '--/--'}
                        </div>
                      </div>
                      <div className={`text-center py-1.5 rounded-xl border-2 ${contract.urgency_status === 'vencido' ? 'bg-red-50 border-red-200 text-red-700' :
                        contract.urgency_status === 'urgente' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        }`}>
                        <div className="text-[9px] font-black uppercase tracking-widest mb-1">Agendada</div>
                        <div className="text-xs font-black tabular-nums">
                          {new Date(contract.next_maintenance_date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Próxima</div>
                        <div className="text-xs font-bold text-emerald-600 tabular-nums">
                          {(() => {
                            if (contract.planned_next_date) {
                              const date = new Date(String(contract.planned_next_date).substring(0, 10) + 'T12:00:00');
                              return isNaN(date.getTime()) ? '--/--' : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                            }
                            return new Date(getNextAfterCurrent(contract) + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Frequency & Alerts */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-xl">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{getFrequencyLabel(contract.frequency)}</span>
                      </div>

                      {(contract.urgency_status === 'vencido' || contract.urgency_status === 'urgente') && (
                        <div className="flex items-center gap-1.5 animate-pulse">
                          <Bell className={`w-4 h-4 ${contract.urgency_status === 'vencido' ? 'text-red-500' : 'text-amber-500'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${contract.urgency_status === 'vencido' ? 'text-red-600' : 'text-amber-600'}`}>
                            Atenção
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-100 dark:border-white/10" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => sendReminder(contract, 'whatsapp')}
                        disabled={!contract.client_phone}
                        className="flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                      >
                        <MessageCircle size={16} strokeWidth={2.5} />
                        WhatsApp
                      </button>
                      <button
                        onClick={() => openModal(contract)}
                        className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 text-slate-700 dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 dark:hover:bg-white/10 active:scale-95 transition-all"
                      >
                        <Edit size={16} strokeWidth={2.5} />
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : viewMode === 'list' ? (
          /* Premium List View */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[32px] overflow-hidden shadow-sm animate-fadeIn">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Identificação</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Cliente</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Última / Próxima</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Recorrência</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {filteredContracts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center text-slate-400 italic">
                        Nenhuma manutenção encontrada
                      </td>
                    </tr>
                  ) : (
                    filteredContracts.map((contract) => (
                      <tr
                        key={contract.id}
                        className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={() => openDetails(contract)}
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div
                              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-110"
                              style={{ backgroundColor: contract.maintenance_color || '#6366f1' }}
                            >
                              <Calendar className="w-6 h-6 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 dark:text-white leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{contract.title}</div>
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{contract.maintenance_type_name || 'Geral'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tight">{contract.client_name}</span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="text-[10px] font-black text-slate-400 tabular-nums">
                              {contract.last_maintenance_date ? new Date(contract.last_maintenance_date + 'T12:00:00').toLocaleDateString('pt-BR') : '--/--/----'}
                            </span>
                            <div className={`px-3 py-1 rounded-xl text-xs font-black tabular-nums ${contract.urgency_status === 'vencido' ? 'bg-red-100 text-red-600' :
                              contract.urgency_status === 'urgente' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                              }`}>
                              {new Date(contract.next_maintenance_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/5 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <Clock size={12} />
                            {getFrequencyLabel(contract.frequency)}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`badge text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-sm ${getUrgencyColor(contract.urgency_status || 'futuro')}`}>
                            {getUrgencyLabel(contract.urgency_status || 'futuro', contract.days_until_maintenance || 0)}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => sendReminder(contract, 'whatsapp')} className="w-10 h-10 flex items-center justify-center hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-2xl text-slate-400 hover:text-emerald-500 transition-all active:scale-90" title="WhatsApp">
                              <MessageCircle size={18} strokeWidth={2.5} />
                            </button>
                            <button onClick={() => openModal(contract)} className="w-10 h-10 flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all active:scale-90">
                              <Edit size={18} strokeWidth={2.5} />
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/10 rounded-2xl text-slate-400 transition-all group-hover:translate-x-1">
                              <ChevronRight size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : viewMode === 'calendar' ? (
          /* Premium Calendar View */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[40px] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden animate-fadeIn relative mb-10">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-100 dark:border-white/5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none flex items-center gap-3">
                  <Calendar className="text-indigo-600" size={24} />
                  {new Date(parseInt(selectedYear), parseInt(selectedMonth)).toLocaleDateString('pt-BR', { month: 'long' })}
                </h3>
                <p className="text-indigo-600 font-black text-xs uppercase tracking-[0.3em] mt-2 opacity-60 ml-9">{selectedYear}</p>
              </div>

              <div className="flex items-center gap-3 bg-white dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                <button
                  onClick={() => {
                    const m = parseInt(selectedMonth);
                    if (m === 0) {
                      setSelectedMonth('11');
                      setSelectedYear((parseInt(selectedYear) - 1).toString());
                    } else {
                      setSelectedMonth((m - 1).toString());
                    }
                  }}
                  className="p-3 hover:bg-slate-50 dark:hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-indigo-600 group active:scale-95"
                >
                  <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    setSelectedMonth(new Date().getMonth().toString());
                    setSelectedYear(new Date().getFullYear().toString());
                  }}
                  className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all"
                >
                  HOJE
                </button>
                <button
                  onClick={() => {
                    const m = parseInt(selectedMonth);
                    if (m === 11) {
                      setSelectedMonth('0');
                      setSelectedYear((parseInt(selectedYear) + 1).toString());
                    } else {
                      setSelectedMonth((m + 1).toString());
                    }
                  }}
                  className="p-3 hover:bg-slate-50 dark:hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-indigo-600 group active:scale-95"
                >
                  <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
              {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map(day => (
                <div key={day} className="py-6 text-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] border-r last:border-r-0 border-slate-100/50 dark:border-white/5">
                  {day.substring(0, 3)}
                </div>
              ))}
            </div>

            {/* Grid Body */}
            <div className="grid grid-cols-7 gap-px bg-slate-100 dark:bg-white/5">

              {(() => {
                const days = [];
                const firstDayOfMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth), 1).getDay();
                const daysInMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth) + 1, 0).getDate();
                const prevMonthLastDay = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();

                // Padding for previous month
                for (let i = 0; i < firstDayOfMonth; i++) {
                  days.push(
                    <div key={`prev-${i}`} className="bg-slate-50/30 dark:bg-slate-950/20 min-h-[150px] p-4 text-slate-400 dark:text-slate-700 font-bold text-xs border-r border-b border-slate-100/50 dark:border-white/5 flex items-start opacity-70">
                      {prevMonthLastDay - firstDayOfMonth + i + 1}
                    </div>
                  );
                }

                // Actual days
                for (let d = 1; d <= daysInMonth; d++) {
                  const dateStr = `${selectedYear}-${(parseInt(selectedMonth) + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
                  const dayTasks = filteredContracts.filter(c => c.next_maintenance_date === dateStr);
                  const isToday = new Date().toISOString().split('T')[0] === dateStr;

                  days.push(
                    <div
                      key={d}
                      className={`calendar-cell bg-white dark:bg-slate-900/50 min-h-[150px] p-4 transition-all hover:bg-slate-50/50 dark:hover:bg-indigo-500/5 group/day relative border-r border-b border-slate-100/50 dark:border-white/5
                        ${isToday ? 'bg-indigo-50/30' : ''}`}
                    >
                      {/* Day Number Header */}
                      <div className="flex justify-between items-center mb-4">
                        <span className={`text-sm font-black w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300
                          ${isToday
                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 ring-4 ring-indigo-600/10 scale-110 z-10'
                            : 'text-slate-600 dark:text-slate-300 group-hover/day:text-indigo-600 group-hover/day:bg-indigo-50 dark:group-hover/day:bg-indigo-500/10 group-hover/day:scale-110'}`}>
                          {d}
                        </span>

                        {isToday && (
                          <div className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-500/20 rounded-full">
                            <span className="text-[8px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Hoje</span>
                          </div>
                        )}
                      </div>

                      {/* Tasks Container */}
                      <div className="space-y-1.5 overflow-y-auto max-h-[100px] custom-scrollbar pr-1">
                        {dayTasks.map(task => (
                          <div
                            key={task.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetails(task);
                            }}
                            className={`group/task relative px-3 py-2 rounded-xl text-[9px] font-black text-white truncate cursor-pointer shadow-sm flex items-center gap-2 transition-all hover:translate-x-1 active:scale-95 ${getUrgencyColor(task.urgency_status || 'futuro')}`}
                            title={`${task.client_name}: ${task.title}`}
                          >
                            <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-white/50 group-hover/task:bg-white animate-pulse" />
                            <span className="truncate leading-none">{task.title}</span>
                          </div>
                        ))}
                      </div>

                      {/* Cell Background Highlight for Empty days with tasks later */}
                      {dayTasks.length > 0 && !isToday && (
                        <div className="absolute top-0 right-0 w-1 h-full bg-indigo-500/10 opacity-0 group-hover/day:opacity-100 transition-opacity" />
                      )}
                    </div>
                  );
                }

                // Fill remaining slots
                const totalSlots = 42;
                const remainingSlots = totalSlots - days.length;
                for (let i = 1; i <= remainingSlots; i++) {
                  days.push(
                    <div key={`next-${i}`} className="bg-slate-50/30 dark:bg-slate-950/20 min-h-[150px] p-4 text-slate-400 dark:text-slate-700 font-bold text-xs border-r border-b border-slate-100/50 dark:border-white/5 flex items-start opacity-70">
                      {i}
                    </div>
                  );
                }

                return days;
              })()}
            </div>
          </div>
        ) : (
          /* Empty State fallback if needed */
          null
        )
      }

      {/* Modal Criar/Editar */}
      {
        showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingContract ? 'Editar Manutenção' : 'Nova Manutenção Periódica'}
                </h2>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="label">Cliente *</label>
                  <select
                    value={formData.client_id}
                    onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                    className="input"
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Título *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input"
                    placeholder="Ex: Manutenção Cabine Primária"
                  />
                </div>
                <div>
                  <label className="label">Frequência *</label>
                  <div className="grid grid-cols-5 gap-2">
                    {['mensal', 'bimestral', 'trimestral', 'semestral', 'anual'].map(freq => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => handleFrequencyChange(freq)}
                        className={`btn btn-sm ${formData.frequency === freq ? 'btn-primary' : 'btn-secondary'}`}
                      >
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                {/* VISUALIZAÇÃO DAS 3 DATAS */}
                <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    Linha do Tempo das Manutenções
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Última */}
                    <div className="bg-white rounded-lg p-3 text-center border border-gray-200 shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">📋 Última</p>
                      <p className="text-sm font-bold text-gray-700">
                        {formData.last_maintenance_date
                          ? new Date(formData.last_maintenance_date + 'T12:00:00').toLocaleDateString('pt-BR')
                          : '--/--/----'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Realizada</p>
                    </div>
                    {/* Agendada (Atual) */}
                    <div className="bg-indigo-100 rounded-lg p-3 text-center border-2 border-indigo-400 shadow-sm relative">
                      <p className="text-xs text-indigo-600 font-medium mb-1">📅 Agendada</p>
                      <p className="text-sm font-bold text-indigo-700">
                        {formData.next_maintenance_date
                          ? new Date(formData.next_maintenance_date + 'T12:00:00').toLocaleDateString('pt-BR')
                          : '--/--/----'}
                      </p>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                        Editável abaixo
                      </div>
                    </div>
                    {/* Próxima (Editável) */}
                    <div
                      onClick={() => {
                        try {
                          nextDateInputRef.current?.showPicker();
                        } catch (err) {
                          // Fallback para navegadores que não suportam showPicker
                          nextDateInputRef.current?.focus();
                        }
                      }}
                      className={`rounded-lg p-3 text-center border shadow-sm relative group cursor-pointer ${formData.planned_next_date ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-200'}`}
                    >
                      {/* Input Oculto mas "Visível" para o DOM para permitir showPicker */}
                      <input
                        ref={nextDateInputRef}
                        type="date"
                        value={formData.planned_next_date || calculateNextDate(formData.next_maintenance_date, formData.frequency)}
                        onChange={(e) => setFormData({ ...formData, planned_next_date: e.target.value })}
                        className="absolute opacity-0 w-0 h-0 pointer-events-none"
                        style={{ visibility: 'visible' }} // Garante que showPicker funcione
                      />

                      <p className={`text-xs mb-1 font-medium ${formData.planned_next_date ? 'text-amber-700' : 'text-emerald-600'} relative z-10 flex items-center justify-center gap-1`}>
                        {formData.planned_next_date ? '🔮 Ciclo Personalizado' : '🔮 Ciclo Seguinte'} <Edit size={12} className="opacity-70" />
                      </p>
                      <div className="relative z-10">
                        <p className={`text-sm font-bold ${formData.planned_next_date ? 'text-amber-800' : 'text-emerald-700'} group-hover:scale-105 transition-transform`}>
                          {(() => {
                            // Helper Local para garantir data válida
                            const formatDateSafe = (dateStr: string) => {
                              if (!dateStr || dateStr.length < 10) return null;
                              const clean = dateStr.substring(0, 10); // YYYY-MM-DD
                              const date = new Date(`${clean}T12:00:00`);
                              if (isNaN(date.getTime())) return null;
                              return date.toLocaleDateString('pt-BR');
                            };

                            if (formData.planned_next_date) {
                              const formatted = formatDateSafe(formData.planned_next_date);
                              if (formatted) return formatted;
                            }

                            // Fallback para calculada
                            if (formData.next_maintenance_date) {
                              const next = calculateNextDate(formData.next_maintenance_date, formData.frequency);
                              const formatted = formatDateSafe(next);
                              return formatted || '--/--/----';
                            }

                            return '--/--/----';
                          })()}
                        </p>
                      </div>
                      <p className={`text-xs mt-1 ${formData.planned_next_date ? 'text-amber-600' : 'text-emerald-500'} relative z-10`}>
                        {formData.planned_next_date ? 'Data Manual' : 'Previsão Automática'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    ↑ Linha do tempo interativa. Clique no Ciclo Seguinte para definir uma data manual.
                  </p>
                </div>

                {/* CAMPOS DE EDIÇÃO DAS DATAS */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">📋 Última Manutenção (Data de Início)</label>
                    <input
                      type="date"
                      value={formData.last_maintenance_date}
                      onChange={(e) => handleLastDateChange(e.target.value)}
                      className="input"
                    />
                    <p className="text-xs text-gray-500 mt-1">Quando foi a última manutenção realizada</p>
                  </div>
                  <div>
                    <label className="label text-indigo-700 font-bold">📅 Manutenção Agendada (Editável) *</label>
                    <input
                      type="date"
                      value={formData.next_maintenance_date}
                      onChange={(e) => setFormData({ ...formData, next_maintenance_date: e.target.value })}
                      className="input border-2 border-indigo-100 focus:border-indigo-500 bg-indigo-50/30"
                    />
                    <p className="text-xs text-gray-500 mt-1">Defina manualmente a data desta manutenção</p>
                  </div>
                </div>
                <div>
                  <label className="label">Valor (R$)</label>
                  <input
                    type="number"
                    value={formData.maintenance_value}
                    onChange={(e) => setFormData({ ...formData, maintenance_value: Number(e.target.value) })}
                    className="input"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label className="label">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input min-h-[80px]"
                    placeholder="Detalhes da manutenção..."
                  />
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Bell className="w-5 h-5 text-amber-600" />
                    <span className="font-medium text-amber-800">Alertas Automáticos</span>
                  </div>
                  <p className="text-sm text-amber-700 mb-3">Alertas serão enviados 30, 15 e 7 dias antes</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.send_email_alert}
                        onChange={(e) => setFormData({ ...formData, send_email_alert: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <Mail size={16} className="text-gray-500" />
                      <span className="text-sm">Enviar alertas por Email</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.send_whatsapp_alert}
                        onChange={(e) => setFormData({ ...formData, send_whatsapp_alert: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <MessageCircle size={16} className="text-gray-500" />
                      <span className="text-sm">Enviar alertas por WhatsApp</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancelar</button>
                <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                  {saving ? <Loader2 className="animate-spin" size={20} /> : null}
                  {editingContract ? 'Salvar' : 'Criar Manutenção'}
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Client Details Drawer (Slide-over) */}
      {
        drawerOpen && selectedContract && (
          <div className="fixed inset-0 z-[100] overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-fadeIn" onClick={() => setDrawerOpen(false)} />
            <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
              <div className="w-screen max-w-md transform transition-all duration-500 ease-in-out animate-slideInRight">
                <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-slate-900 shadow-2xl rounded-l-[40px]">
                  {/* Drawer Header */}
                  <div className="relative h-64 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                    {/* Premium Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-700" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 shrink-0" />

                    <button
                      onClick={() => setDrawerOpen(false)}
                      className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all z-20 active:scale-95"
                    >
                      <X size={20} strokeWidth={3} />
                    </button>

                    <div className="relative z-10">
                      <div
                        className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-black backdrop-blur-md border border-white/20 ring-4 ring-white/10 shadow-2xl mx-auto mb-6 transform hover:rotate-6 transition-transform duration-500"
                        style={{ backgroundColor: selectedContract.maintenance_color || 'rgba(255,255,255,0.1)' }}
                      >
                        <Calendar size={48} className="text-white" strokeWidth={2.5} />
                      </div>

                      <h2 className="text-2xl font-black text-white mb-2 leading-tight px-4 tracking-tight">{selectedContract.title}</h2>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">{selectedContract.maintenance_type_name || 'Manutenção'}</span>
                        <div className="w-1 h-1 bg-white/30 rounded-full" />
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black text-white uppercase shadow-lg ${getUrgencyColor(selectedContract.urgency_status || 'futuro')}`}>
                          {selectedContract.urgency_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Drawer Content */}
                  <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10 custom-scrollbar">
                    {/* Maintenance DNA - Health Metrics */}
                    <div>
                      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <div className="w-6 h-1 bg-indigo-600 rounded-full" /> Maintenance DNA
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-[32px] border border-slate-100 dark:border-white/10 group hover:border-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/5">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Activity size={12} className="text-indigo-500" /> Status Geral
                          </p>
                          <span className={`text-xs font-black uppercase tracking-tight ${selectedContract.status === 'ativo' ? 'text-emerald-500' : 'text-slate-400'}`}>
                            {selectedContract.status === 'ativo' ? 'Monitorado' : 'Suspenso'}
                          </span>
                        </div>
                        <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-[32px] border border-slate-100 dark:border-white/10 group hover:border-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/5">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Clock size={12} className="text-amber-500" /> Frequência
                          </p>
                          <span className="text-xs font-black text-slate-700 dark:text-white uppercase">
                            {getFrequencyLabel(selectedContract.frequency)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline & Next Steps */}
                    <div>
                      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <div className="w-6 h-1 bg-emerald-500 rounded-full" /> Próximos Passos
                      </h3>
                      <div className="relative pl-6 space-y-8 border-l-2 border-slate-100 dark:border-white/5 ml-2">
                        <div className="relative">
                          <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-slate-900 shadow-lg shadow-indigo-500/30" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Agendada</p>
                          <p className="text-sm font-bold text-slate-700 dark:text-white mt-1 tabular-nums">
                            {new Date(selectedContract.next_maintenance_date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-200 dark:bg-white/10 ring-4 ring-white dark:ring-slate-900" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Próxima (Ciclo)</p>
                          <p className="text-sm font-bold text-slate-400 mt-1 tabular-nums">
                            {new Date(getNextAfterCurrent(selectedContract) + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Client & Connection */}
                    <div>
                      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <div className="w-6 h-1 bg-blue-500 rounded-full" /> Conexão Cliente
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-white/5 rounded-[24px] border border-slate-100 dark:border-white/10 group hover:shadow-md transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white dark:bg-white/5 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 dark:border-white/10">
                              <Building2 size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Unidade Atendida</p>
                              <p className="text-xs font-bold text-slate-700 dark:text-white mt-1 truncate max-w-[180px]">{selectedContract.client_name}</p>
                            </div>
                          </div>
                          <button className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-lg text-slate-400 transition-colors">
                            <ExternalLink size={14} />
                          </button>
                        </div>

                        {selectedContract.client_phone && (
                          <div
                            className="flex items-center justify-between p-5 bg-emerald-50 dark:bg-emerald-500/5 rounded-[24px] border border-emerald-100 dark:border-emerald-500/20 group hover:bg-emerald-100 dark:hover:bg-emerald-500/10 transition-all cursor-pointer"
                            onClick={() => sendReminder(selectedContract, 'whatsapp')}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white dark:bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                                <MessageCircle size={20} strokeWidth={2.5} />
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none italic">Contatar via WhatsApp</p>
                                <p className="text-xs font-bold text-slate-700 dark:text-white mt-1 tabular-nums">{selectedContract.client_phone}</p>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Observations Card */}
                    {selectedContract.description && (
                      <div className="bg-slate-900 dark:bg-white/5 rounded-[32px] p-8 text-white relative overflow-hidden group">
                        <Quote size={48} className="absolute top-4 right-4 text-white/5 -rotate-12 transform group-hover:scale-110 transition-transform duration-700" />
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Notas do Agendamento</h3>
                        <p className="text-sm font-medium leading-relaxed italic relative z-10 text-white/90">
                          "{selectedContract.description}"
                        </p>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-emerald-500" />
                      </div>
                    )}
                  </div>

                  {/* Drawer Footer Actions - Premium Action Bar */}
                  <div className="p-8 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/10">
                    <div className="flex flex-col gap-3">
                      {/* Primary Action */}
                      <button
                        onClick={() => handleMarkCompleted(selectedContract)}
                        disabled={!canComplete(selectedContract)}
                        className={`group relative w-full flex items-center justify-center gap-3 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] transition-all overflow-hidden ${canComplete(selectedContract)
                          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-95'
                          : 'bg-slate-200 dark:bg-white/5 text-slate-400 cursor-not-allowed shadow-none'
                          }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        <CheckCircle size={20} strokeWidth={3} className={canComplete(selectedContract) ? 'animate-bounce' : ''} />
                        Mudar para Concluído
                      </button>

                      {/* Secondary Actions Row */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            setDrawerOpen(false);
                            openModal(selectedContract);
                          }}
                          className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-[24px] text-[10px] font-black text-slate-600 dark:text-white hover:bg-slate-50 hover:shadow-md transition-all active:scale-95"
                        >
                          <Edit size={16} strokeWidth={2.5} className="text-indigo-500" /> REAGENDAR
                        </button>
                        <button
                          onClick={() => {
                            setDrawerOpen(false);
                            handleDelete(selectedContract);
                          }}
                          className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-[24px] text-[10px] font-black text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all active:scale-95"
                        >
                          <Trash2 size={16} strokeWidth={2.5} /> EXCLUIR
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Modal Confirmar Conclusão */}
      {
        showCompletionModal && (
          <div className="modal-overlay" onClick={() => setShowCompletionModal(false)}>
            <div className="modal-content max-w-md overflow-hidden rounded-[40px] border-none shadow-2xl animate-fadeIn" onClick={e => e.stopPropagation()}>
              <div className="p-8 border-b bg-gradient-to-br from-indigo-600 to-blue-700 text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/30">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black mb-1">Concluir Ciclo</h2>
                <p className="text-white/70 text-sm font-medium">{completionData.contractTitle}</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block group-focus-within:text-indigo-600 transition-colors">Data de Execução</label>
                    <input
                      type="date"
                      value={completionData.completedDate}
                      onChange={(e) => setCompletionData({ ...completionData, completedDate: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-3xl px-6 py-4 text-sm font-bold focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 transition-all outline-none"
                    />
                  </div>

                  <div className="p-6 bg-indigo-50 dark:bg-indigo-500/5 rounded-[32px] border-2 border-indigo-100 dark:border-indigo-500/20 relative">
                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-12 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/40" />
                    <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3 block">Próximo Agendamento</label>
                    <input
                      type="date"
                      value={completionData.nextDate}
                      onChange={(e) => setCompletionData({ ...completionData, nextDate: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-500/30 rounded-2xl px-6 py-4 text-sm font-bold focus:border-indigo-600 transition-all outline-none"
                    />
                    <p className="text-[10px] text-indigo-400 mt-3 font-black uppercase italic text-center tracking-widest">
                      RECORRÊNCIA: {completionData.frequency}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 pt-0 flex gap-4">
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmCompletion}
                  disabled={saving}
                  className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : 'Confirmar Execução'}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}
