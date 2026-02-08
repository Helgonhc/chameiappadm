'use client';

import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { ChevronLeft, ChevronRight, Plus, Loader2, Calendar, Clock, Wrench, AlertTriangle, Filter, X, Trash2, Edit, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

interface Appointment {
  id: string;
  client_id?: string;
  service_type?: string;
  title: string;
  description?: string;
  requested_date: string;
  requested_time_start?: string;
  status: string;
  clients?: { name: string };
}

interface MaintenanceContract {
  id: string;
  title: string;
  next_maintenance_date: string;
  last_maintenance_date?: string | null;
  frequency?: string;
  urgency_status?: string;
  maintenance_type_name?: string | null;
  maintenance_color?: string | null;
  client_name?: string;
  days_until_maintenance?: number;
  status?: string;
}

interface Installation {
  id: string;
  title: string;
  client_id?: string;
  start_date: string;
  status: string;
  clients?: { name: string };
}

interface Ticket {
  id: string;
  title: string;
  client_id?: string;
  created_at: string;
  status: string;
  priority: string;
  clients?: { name: string };
}

interface Quote {
  id: string;
  title: string;
  client_id?: string;
  valid_until?: string;
  created_at?: string;
  status: string;
  total?: number;
  clients?: { name: string };
}

export default function AgendaPage() {
  const { profile } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [maintenances, setMaintenances] = useState<MaintenanceContract[]>([]);
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all', // 'all', 'orders', 'maintenance', 'appointments', 'installations', 'tickets', 'quotes'
    search: '',
  });
  const [formData, setFormData] = useState({
    client_id: '',
    title: '',
    description: '',
    scheduled_date: '',
    scheduled_time: '09:00',
  });
  const [saving, setSaving] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  // Team Filter State
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [currentMonth, selectedTechnician]); // Reload when filter changes

  async function loadData() {
    setLoading(true);
    // SIMULAÇÃO DE DADOS (MOCK)
    console.log('Carregando dados mockados da agenda...');

    // 1. Mock Team Members
    const mockTeam = [
      { id: 'u1', full_name: 'Carlos Técnico', email: 'carlos@chamei.com', role: 'technician' },
      { id: 'u2', full_name: 'Ana Gerente', email: 'ana@chamei.com', role: 'admin' },
      { id: 'u3', full_name: 'Roberto Super', email: 'roberto@chamei.com', role: 'super_admin' },
    ];
    setTeamMembers(mockTeam);

    // 2. Mock Clients
    const mockClientsData = [
      { id: 'c1', name: 'Condomínio Solar das Palmeiras' },
      { id: 'c2', name: 'Shopping Alpha Mall' },
      { id: 'c3', name: 'Indústria MetalFlex' },
      { id: 'c4', name: 'Hospital Santa Maria' }
    ];
    setClients(mockClientsData);

    // 3. Mock Events Generation
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    // Helper to pick random element
    const pick = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
    const pickTech = () => pick(mockTeam);

    // Generate Mock Appointments
    const newAppointments: any[] = [];
    const newOrders: any[] = [];
    const newMaintenances: any[] = [];
    const newInstallations: any[] = [];
    const newTickets: any[] = [];
    const newQuotes: any[] = [];

    // Populate random days with events
    days.forEach((day, idx) => {
      const dateStr = format(day, 'yyyy-MM-dd');

      // Add random events sparsely
      if (Math.random() > 0.7) {
        const tech = pickTech();
        newAppointments.push({
          id: `apt-${idx}`,
          title: 'Visita Técnica Inicial',
          description: 'Avaliação de infraestrutura',
          requested_date: dateStr,
          requested_time_start: '09:00',
          status: pick(['pending', 'confirmed']),
          clients: { name: pick(mockClientsData).name },
          client_id: 'c1', // Mock ID
          technician_id: tech.id,
          technician_name: tech.full_name
        });
      }

      if (Math.random() > 0.8) {
        const tech = pickTech();
        newOrders.push({
          id: `ord-${idx}`,
          event_id: `ord-${idx}`,
          title: 'Manutenção Corretiva AC',
          description: 'Troca de compressor',
          scheduled_at: `${dateStr}T14:00:00`,
          status: 'in_progress',
          clients: { name: pick(mockClientsData).name },
          client_id: 'c2',
          technician_id: tech.id,
          technician_name: tech.full_name
        });
      }

      if (Math.random() > 0.85) {
        const tech = pickTech();
        newMaintenances.push({
          id: `mnt-${idx}`,
          title: 'Preventiva Elevadores',
          next_maintenance_date: dateStr,
          client_name: pick(mockClientsData).name,
          urgency_status: pick(['urgente', 'proximo', 'vencido']),
          status: 'active',
          maintenance_type_name: 'Transporte Vertical',
          technician_id: tech.id,
          technician_name: tech.full_name
        });
      }

      if (Math.random() > 0.9) {
        const tech = pickTech();
        newInstallations.push({
          id: `inst-${idx}`,
          title: 'Instalação Câmeras IP',
          start_date: `${dateStr}T08:00:00`,
          status: 'scheduled',
          clients: { name: pick(mockClientsData).name },
          client_id: 'c3',
          technician_id: tech.id,
          technician_name: tech.full_name
        });
      }

      if (Math.random() > 0.8) {
        const tech = pickTech();
        newTickets.push({
          id: `tkt-${idx}`,
          title: 'Falha no portão',
          created_at: `${dateStr}T10:30:00`,
          status: 'open',
          priority: 'high',
          clients: { name: pick(mockClientsData).name },
          client_id: 'c4',
          technician_id: tech.id,
          technician_name: tech.full_name
        });
      }

      if (Math.random() > 0.9) {
        const tech = pickTech();
        newQuotes.push({
          id: `qt-${idx}`,
          title: 'Orçamento Retrofit',
          valid_until: dateStr,
          status: 'sent',
          clients: { name: pick(mockClientsData).name },
          client_id: 'c1',
          technician_id: tech.id,
          technician_name: tech.full_name
        });
      }
    });

    // Filter by Technician if selected
    const filterByTech = (events: any[]) => {
      if (!selectedTechnician || selectedTechnician === 'all') return events;
      return events.filter(e => e.technician_id === selectedTechnician);
    };

    setAppointments(filterByTech(newAppointments));
    setOrders(filterByTech(newOrders));
    setMaintenances(filterByTech(newMaintenances));
    setInstallations(filterByTech(newInstallations));
    setTickets(filterByTech(newTickets));
    setQuotes(filterByTech(newQuotes));

    setLoading(false);
  }

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getEventsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayAppointments = filters.type === 'all' || filters.type === 'appointments'
      ? appointments.filter(a => a.requested_date === dateStr)
      : [];
    const dayOrders = filters.type === 'all' || filters.type === 'orders'
      ? orders.filter(o => o.scheduled_at?.split('T')[0] === dateStr)
      : [];
    const dayMaintenances = filters.type === 'all' || filters.type === 'maintenance'
      ? maintenances.filter(m => m.next_maintenance_date === dateStr)
      : [];
    const dayInstallations = filters.type === 'all' || filters.type === 'installations'
      ? installations.filter(i => (i.start_date || '').split('T')[0] === dateStr)
      : [];
    const dayTickets = filters.type === 'all' || filters.type === 'tickets'
      ? tickets.filter(t => (t.created_at || '').split('T')[0] === dateStr)
      : [];
    const dayQuotes = filters.type === 'all' || filters.type === 'quotes'
      ? quotes.filter(q => (q.valid_until || q.created_at || '').split('T')[0] === dateStr)
      : [];

    return [
      ...dayAppointments.map(a => ({ ...a, type: 'appointment' })),
      ...dayOrders.map(o => ({ ...o, type: 'order' })),
      ...dayMaintenances.map(m => ({ ...m, type: 'maintenance' })),
      ...dayInstallations.map(i => ({ ...i, type: 'installation' })),
      ...dayTickets.map(t => ({ ...t, type: 'ticket' })),
      ...dayQuotes.map(q => ({ ...q, type: 'quote' }))
    ];
  };

  const selectedDateEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  // Estatísticas do mês
  const monthMaintenances = maintenances.length;
  const urgentMaintenances = maintenances.filter(m => m.urgency_status === 'vencido' || m.urgency_status === 'urgente').length;

  function openModal(date?: Date, eventToEdit?: any) {
    if (eventToEdit) {
      setFormData({
        client_id: eventToEdit.client_id || '',
        title: eventToEdit.title || eventToEdit.service_type || '',
        description: eventToEdit.description || '',
        scheduled_date: eventToEdit.requested_date || eventToEdit.scheduled_at?.split('T')[0] || eventToEdit.next_maintenance_date || eventToEdit.start_date?.split('T')[0] || eventToEdit.created_at?.split('T')[0] || eventToEdit.valid_until?.split('T')[0] || format(new Date(), 'yyyy-MM-dd'),
        scheduled_time: eventToEdit.requested_time_start || eventToEdit.scheduled_time || '09:00',
      });
    } else {
      setFormData({
        client_id: '',
        title: '',
        description: '',
        scheduled_date: date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        scheduled_time: '09:00',
      });
    }
    setShowModal(true);
  }

  async function handleDelete(event: any) {
    if (!window.confirm(`Tem certeza que deseja excluir este ${event.type === 'order' ? 'pedido' : 'item'}?`)) return;

    try {
      // Mock Delete
      switch (event.type) {
        case 'order':
          setOrders(prev => prev.filter(i => i.id !== event.id));
          break;
        case 'appointment':
          setAppointments(prev => prev.filter(i => i.id !== event.id));
          break;
        case 'maintenance':
          setMaintenances(prev => prev.filter(i => i.id !== event.id));
          break;
        case 'installation':
          setInstallations(prev => prev.filter(i => i.id !== event.id));
          break;
        case 'ticket':
          setTickets(prev => prev.filter(i => i.id !== event.id));
          break;
        case 'quote':
          setQuotes(prev => prev.filter(i => i.id !== event.id));
          break;
      }

      toast.success('Excluído com sucesso (Mock)');
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Erro ao excluir item');
    }
  }

  async function handleCreate() {
    if (!formData.client_id || !formData.title || !formData.scheduled_date) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    setSaving(true);
    // Mock Create/Update
    setTimeout(() => {
      if (selectedEvent && selectedEvent.type === 'appointment') {
        setAppointments(prev => prev.map(a => a.id === selectedEvent.id ? {
          ...a,
          client_id: formData.client_id,
          title: formData.title,
          description: formData.description,
          requested_date: formData.scheduled_date,
          requested_time_start: formData.scheduled_time,
          clients: { name: clients.find(c => c.id === formData.client_id)?.name || 'Cliente' }
        } : a));
        toast.success('Agendamento atualizado (Mock)!');
      } else {
        const newAppt: Appointment = {
          id: `apt-${Date.now()}`,
          client_id: formData.client_id,
          title: formData.title,
          description: formData.description,
          requested_date: formData.scheduled_date,
          requested_time_start: formData.scheduled_time,
          status: 'pending',
          clients: { name: clients.find(c => c.id === formData.client_id)?.name || 'Cliente' }
        };
        setAppointments(prev => [...prev, newAppt]);
        toast.success('Agendamento criado (Mock)!');
      }

      setShowModal(false);
      setSelectedEvent(null);
      setSaving(false);
    }, 500);
  }

  // Share Modal Logic
  const [showShareModal, setShowShareModal] = useState(false);
  const [usersList, setUsersList] = useState<any[]>([]);
  // Store full permission objects keyed by grantee_id
  const [userPermissions, setUserPermissions] = useState<Record<string, any>>({});
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  useEffect(() => {
    if (showShareModal) {
      loadShareData();
    }
  }, [showShareModal]);

  async function loadShareData() {
    setLoadingPermissions(true);
    // Mock Permission Data
    setTimeout(() => {
      // Mock Users
      const mockUsers = [
        { id: 'u4', full_name: 'Marcos Técnico', email: 'marcos@chamei.com', role: 'technician', initials: 'MT' },
        { id: 'u5', full_name: 'Julia Admin', email: 'julia@chamei.com', role: 'admin', initials: 'JA' }
      ];
      setUsersList(mockUsers);

      // Mock Permissions
      const mockPerms = {
        'u4': { id: 'p1', share_orders: true, share_maintenance: false },
        'u5': { id: 'p2', share_orders: true, share_maintenance: true, share_installations: true, share_appointments: true }
      };
      setUserPermissions(mockPerms);

      setLoadingPermissions(false);
    }, 500);
  }

  async function handleUpdatePermission(userId: string, type: string, value: boolean) {
    // Mock Permission Update
    setUserPermissions(prev => {
      const existingProxy = prev[userId] || {};
      return {
        ...prev,
        [userId]: {
          ...existingProxy,
          [type === 'orders' ? 'share_orders' : type === 'maintenance' ? 'share_maintenance' : type === 'installations' ? 'share_installations' : 'share_appointments']: value
        }
      };
    });
    toast.success('Permissão atualizada (Mock)');
  }

  async function updateAppointmentStatus(id: string, newStatus: string) {
    setSaving(true);
    // Mock Status Update
    setTimeout(() => {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      toast.success(`Status atualizado para ${newStatus} (Mock)`);
      setSelectedEvent((prev: any) => prev ? { ...prev, status: newStatus } : null);
      setSaving(false);
    }, 300);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Agenda</h1>
          <p className="text-gray-500">
            {format(currentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {/* Team Filter Dropdown */}
          <select
            className="select select-bordered select-sm w-40 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
            value={selectedTechnician}
            onChange={(e: any) => setSelectedTechnician(e.target.value)}
          >
            <option value="all" className="text-slate-800 dark:text-white">Toda a Equipe</option>
            {teamMembers.map(member => (
              <option key={member.id} value={member.id} className="text-slate-800 dark:text-white">
                {member.full_name || member.email}
              </option>
            ))}
          </select>

          <button onClick={() => setShowShareModal(true)} className="btn btn-secondary">
            <User size={18} />
            Compartilhar
          </button>

          <button onClick={() => setShowFilters(!showFilters)} className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}>
            <Filter size={18} />
            Filtros
          </button>
          <button onClick={() => openModal()} className="btn btn-primary">
            <Plus size={20} />
            Novo Agendamento
          </button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="card p-4 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Filtrar por Tipo</h3>
            {filters.type !== 'all' && (
              <button onClick={() => setFilters({ ...filters, type: 'all' })} className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                <X size={14} /> Limpar
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilters({ ...filters, type: 'all' })} className={`btn btn-sm ${filters.type === 'all' ? 'btn-primary' : 'btn-secondary'}`}>
              Todos
            </button>
            <button onClick={() => setFilters({ ...filters, type: 'orders' })} className={`btn btn-sm ${filters.type === 'orders' ? 'bg-amber-500 text-white' : 'btn-secondary'}`}>
              📋 Ordens de Serviço
            </button>
            <button onClick={() => setFilters({ ...filters, type: 'maintenance' })} className={`btn btn-sm ${filters.type === 'maintenance' ? 'bg-purple-500 text-white' : 'btn-secondary'}`}>
              🔧 Manutenções Periódicas
            </button>
            <button onClick={() => setFilters({ ...filters, type: 'appointments' })} className={`btn btn-sm ${filters.type === 'appointments' ? 'bg-blue-500 text-white' : 'btn-secondary'}`}>
              📅 Agendamentos
            </button>
            <button onClick={() => setFilters({ ...filters, type: 'installations' })} className={`btn btn-sm ${filters.type === 'installations' ? 'bg-sky-500 text-white' : 'btn-secondary'}`}>
              📡 Instalações
            </button>
            <button onClick={() => setFilters({ ...filters, type: 'tickets' })} className={`btn btn-sm ${filters.type === 'tickets' ? 'bg-red-500 text-white' : 'btn-secondary'}`}>
              🎫 Chamados
            </button>
            <button onClick={() => setFilters({ ...filters, type: 'quotes' })} className={`btn btn-sm ${filters.type === 'quotes' ? 'bg-emerald-500 text-white' : 'btn-secondary'}`}>
              📄 Orçamentos
            </button>
          </div>
        </div>
      )}

      {/* Stats de Manutenções */}
      {monthMaintenances > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4 border-l-4 border-l-purple-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{monthMaintenances}</p>
                <p className="text-sm text-gray-500">Manutenções no mês</p>
              </div>
            </div>
          </div>
          {urgentMaintenances > 0 && (
            <div className="card p-4 border-l-4 border-l-red-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{urgentMaintenances}</p>
                  <p className="text-sm text-gray-500">Urgentes/Vencidas</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 card">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
            </h2>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Legenda */}
          <div className="flex flex-wrap gap-3 mb-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-gray-600">Ordens</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-gray-600">Manutenções</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span className="text-gray-600">Agendamentos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span className="text-gray-600">Instalações</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-gray-600">Chamados</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-gray-600">Orçamentos</span>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {days.map((day) => {
              const events = getEventsForDay(day);
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const hasOrder = events.some(e => e.type === 'order');
              const hasMaintenance = events.some(e => e.type === 'maintenance');
              const hasAppointment = events.some(e => e.type === 'appointment');
              const hasInstallation = events.some(e => e.type === 'installation');
              const hasTicket = events.some(e => e.type === 'ticket');
              const hasQuote = events.some(e => e.type === 'quote');

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square p-1 rounded-lg text-sm transition-all relative ${isSelected
                    ? 'bg-indigo-600 text-white'
                    : isToday
                      ? 'bg-indigo-100 text-indigo-700 font-bold'
                      : 'hover:bg-gray-100 text-gray-700'
                    }`}
                >
                  <span className="block">{format(day, 'd')}</span>
                  {events.length > 0 && (
                    <div className="flex justify-center gap-0.5 mt-0.5">
                      {hasOrder && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-amber-500'}`} />}
                      {hasMaintenance && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-purple-300' : 'bg-purple-500'}`} />}
                      {hasAppointment && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-300' : 'bg-indigo-500'}`} />}
                      {hasInstallation && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-sky-300' : 'bg-sky-500'}`} />}
                      {hasTicket && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-red-300' : 'bg-red-500'}`} />}
                      {hasQuote && <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-300' : 'bg-emerald-500'}`} />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Events / Event Details */}
        <div className="card h-fit sticky top-6">
          {!selectedEvent ? (
            <>
              <h3 className="font-semibold text-gray-800 mb-4">
                {selectedDate
                  ? format(selectedDate, "d 'de' MMMM", { locale: ptBR })
                  : 'Próximos Agendamentos'}
              </h3>

              {selectedDate && (
                <button
                  onClick={() => openModal(selectedDate)}
                  className="w-full btn btn-secondary mb-4"
                >
                  <Plus size={18} />
                  Agendar neste dia
                </button>
              )}

              <div className="space-y-3">
                {(!selectedDate ? [
                  ...appointments.map(a => ({ ...a, type: 'appointment' })),
                  ...orders.map(o => ({ ...o, type: 'order' })),
                  ...maintenances.map(m => ({ ...m, type: 'maintenance' })),
                  ...installations.map(i => ({ ...i, type: 'installation' })),
                  ...tickets.map(t => ({ ...t, type: 'ticket' })),
                  ...quotes.map(q => ({ ...q, type: 'quote' }))
                ].filter(e => {
                  const date = e.requested_date || e.scheduled_at?.split('T')[0] || e.next_maintenance_date || e.start_date?.split('T')[0] || e.created_at?.split('T')[0] || e.valid_until?.split('T')[0];
                  return date && date >= format(new Date(), 'yyyy-MM-dd');
                }).sort((a, b) => {
                  const dateA = a.requested_date || a.scheduled_at?.split('T')[0] || a.next_maintenance_date || a.start_date?.split('T')[0] || a.created_at?.split('T')[0] || a.valid_until?.split('T')[0];
                  const dateB = b.requested_date || b.scheduled_at?.split('T')[0] || b.next_maintenance_date || b.start_date?.split('T')[0] || b.created_at?.split('T')[0] || b.valid_until?.split('T')[0];
                  return (dateA || '').localeCompare(dateB || '');
                }).slice(0, 10) : selectedDateEvents).length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    {selectedDate ? 'Nenhum evento neste dia' : 'Nenhum agendamento futuro'}
                  </p>
                ) : (
                  (!selectedDate ? [
                    ...appointments.map(a => ({ ...a, type: 'appointment' })),
                    ...orders.map(o => ({ ...o, type: 'order' })),
                    ...maintenances.map(m => ({ ...m, type: 'maintenance' })),
                    ...installations.map(i => ({ ...i, type: 'installation' })),
                    ...tickets.map(t => ({ ...t, type: 'ticket' })),
                    ...quotes.map(q => ({ ...q, type: 'quote' }))
                  ].filter(e => {
                    const date = e.requested_date || e.scheduled_at?.split('T')[0] || e.next_maintenance_date || e.start_date?.split('T')[0] || e.created_at?.split('T')[0] || e.valid_until?.split('T')[0];
                    return date && date >= format(new Date(), 'yyyy-MM-dd');
                  }).sort((a, b) => {
                    const dateA = a.requested_date || a.scheduled_at?.split('T')[0] || a.next_maintenance_date || a.start_date?.split('T')[0] || a.created_at?.split('T')[0] || a.valid_until?.split('T')[0];
                    const dateB = b.requested_date || b.scheduled_at?.split('T')[0] || b.next_maintenance_date || b.start_date?.split('T')[0] || b.created_at?.split('T')[0] || b.valid_until?.split('T')[0];
                    return (dateA || '').localeCompare(dateB || '');
                  }).slice(0, 10) : selectedDateEvents).map((event: any) => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={`block p-3 rounded-lg border-l-4 hover:shadow-md transition-shadow cursor-pointer ${event.type === 'order'
                        ? 'bg-amber-50 border-amber-500'
                        : event.type === 'maintenance'
                          ? 'bg-purple-50 border-purple-500'
                          : event.type === 'installation'
                            ? 'bg-sky-50 border-sky-500'
                            : event.type === 'ticket'
                              ? 'bg-red-50 border-red-500'
                              : event.type === 'quote'
                                ? 'bg-emerald-50 border-emerald-500'
                                : 'bg-indigo-50 border-indigo-500'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {event.type === 'appointment' && <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">📅 AGEND</span>}
                          {event.type === 'order' && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">📋 OS</span>}
                          {event.type === 'maintenance' && <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">🔧 MANUT</span>}
                          {event.type === 'installation' && <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">📡 TELEM</span>}
                          {event.type === 'ticket' && <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">🎫 TICKET</span>}
                          {event.type === 'quote' && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">📄 ORÇAM</span>}
                          {!selectedDate && (
                            <span className="text-[10px] text-gray-500 font-medium">
                              {event.requested_date || event.scheduled_at?.split('T')[0] || event.next_maintenance_date || event.start_date?.split('T')[0] || event.created_at?.split('T')[0] || event.valid_until?.split('T')[0]}
                            </span>
                          )}
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${event.status === 'confirmed' || event.status === 'confirmado' ? 'bg-green-100 text-green-700' :
                          event.status === 'pending' || event.status === 'pendente' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                          {event.status === 'pending' || event.status === 'pendente' ? 'Pendente' :
                            event.status === 'confirmed' || event.status === 'confirmado' ? 'Confirmado' : event.status}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-800 text-sm truncate">
                        {event.type === 'installation' ? event.title : event.type === 'maintenance' ? (event.maintenance_type_name || event.title) : (event.title || event.service_type)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 italic flex justify-between">
                        <span>{event.type === 'installation' ? event.client_name : event.type === 'maintenance' ? event.client_name : event.clients?.name}</span>
                        {event.technician_name && (
                          <span className="font-semibold text-indigo-500 max-w-[40%] truncate">{event.technician_name}</span>
                        )}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1"
                >
                  <ChevronLeft size={16} /> Voltar
                </button>
                <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${selectedEvent.status === 'confirmed' || selectedEvent.status === 'confirmado' ? 'bg-green-100 text-green-700' :
                  selectedEvent.status === 'pending' || selectedEvent.status === 'pendente' ? 'bg-amber-100 text-amber-700' :
                    selectedEvent.status === 'cancelled' || selectedEvent.status === 'cancelado' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                  }`}>
                  {selectedEvent.status === 'pending' || selectedEvent.status === 'pendente' ? 'Pendente' :
                    selectedEvent.status === 'confirmed' || selectedEvent.status === 'confirmado' ? 'Confirmado' :
                      selectedEvent.status === 'cancelled' || selectedEvent.status === 'cancelado' ? 'Cancelado' :
                        selectedEvent.status}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 leading-tight">
                    {selectedEvent.type === 'installation' ? selectedEvent.title : selectedEvent.type === 'maintenance' ? (selectedEvent.maintenance_type_name || selectedEvent.title) : (selectedEvent.title || selectedEvent.service_type)}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Calendar size={14} />
                    {selectedEvent.requested_date || selectedEvent.scheduled_at?.split('T')[0] || selectedEvent.next_maintenance_date || selectedEvent.start_date?.split('T')[0] || selectedEvent.created_at?.split('T')[0] || selectedEvent.valid_until?.split('T')[0]}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Cliente:</span>
                    <span className="font-medium text-gray-800">{selectedEvent.type === 'installation' ? selectedEvent.client_name : selectedEvent.type === 'maintenance' ? selectedEvent.client_name : selectedEvent.clients?.name}</span>
                  </div>
                  {(selectedEvent.requested_time_start || selectedEvent.scheduled_time) && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Horário:</span>
                      <span className="font-medium text-gray-800">{selectedEvent.requested_time_start || selectedEvent.scheduled_time}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tipo:</span>
                    <span className="font-medium text-gray-800">
                      {selectedEvent.type === 'appointment' ? 'Agendamento' :
                        selectedEvent.type === 'order' ? 'Ordem de Serviço' :
                          selectedEvent.type === 'maintenance' ? 'Manutenção' :
                            selectedEvent.type === 'installation' ? 'Instalação' :
                              selectedEvent.type === 'ticket' ? 'Chamado' :
                                selectedEvent.type === 'quote' ? 'Orçamento' :
                                  selectedEvent.type}
                    </span>
                  </div>
                </div>

                {selectedEvent.description && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Descrição</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (selectedEvent.type === 'appointment') {
                        openModal(undefined, selectedEvent);
                      } else {
                        toast.error('Edição facilitada disponível apenas para agendamentos. Para outros tipos, use os botões abaixo para ver os detalhes.');
                      }
                    }}
                    className="btn btn-secondary flex items-center justify-center gap-2"
                  >
                    <Edit size={16} /> Editar
                  </button>
                  <button
                    onClick={() => handleDelete(selectedEvent)}
                    className="btn btn-secondary text-red-600 hover:bg-red-50 border-red-200 flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} /> Excluir
                  </button>
                </div>

                <div className="pt-2 space-y-2">
                  {selectedEvent.type === 'appointment' && (
                    <>
                      {(selectedEvent.status === 'pending' || selectedEvent.status === 'pendente') && (
                        <button
                          onClick={() => updateAppointmentStatus(selectedEvent.id, 'confirmed')}
                          className="w-full btn btn-primary flex items-center justify-center gap-2"
                        >
                          Confirmar Agendamento
                        </button>
                      )}
                      {selectedEvent.status !== 'cancelled' && selectedEvent.status !== 'cancelado' && (
                        <button
                          onClick={() => updateAppointmentStatus(selectedEvent.id, 'cancelled')}
                          className="w-full btn btn-outline border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
                        >
                          Marcar como Cancelado
                        </button>
                      )}
                    </>
                  )}

                  {selectedEvent.type === 'order' && (
                    <Link
                      href={`/dashboard/orders/${selectedEvent.id}`}
                      className="w-full btn btn-primary flex items-center justify-center gap-2"
                    >
                      Ver Ordem de Serviço
                    </Link>
                  )}

                  {selectedEvent.type === 'maintenance' && (
                    <Link
                      href="/dashboard/maintenance"
                      className="w-full btn btn-primary flex items-center justify-center gap-2"
                    >
                      Ver Detalhes do Contrato
                    </Link>
                  )}

                  {selectedEvent.type === 'installation' && (
                    <Link
                      href={`/dashboard/installations/${selectedEvent.id}`}
                      className="w-full btn btn-primary flex items-center justify-center gap-2"
                    >
                      Ver Detalhes da Instalação
                    </Link>
                  )}

                  {selectedEvent.type === 'ticket' && (
                    <Link
                      href={`/dashboard/tickets/${selectedEvent.id}`}
                      className="w-full btn btn-primary flex items-center justify-center gap-2"
                    >
                      Ver Detalhes do Chamado
                    </Link>
                  )}

                  {selectedEvent.type === 'quote' && (
                    <Link
                      href={`/dashboard/quotes/${selectedEvent.id}`}
                      className="w-full btn btn-primary flex items-center justify-center gap-2"
                    >
                      Ver Detalhes do Orçamento
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-800">Compartilhar Minha Agenda</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              <p className="text-sm text-gray-500 mb-4">
                Selecione os usuários que podem visualizar seus agendamentos.
                <br />
                <span className="text-xs text-amber-600 font-medium">* Técnicos nunca podem ver agenda de Administradores, mesmo se marcado.</span>
              </p>

              {loadingPermissions ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-indigo-600" /></div>
              ) : (
                <div className="space-y-2">
                  {usersList.map(user => {
                    const perms = userPermissions[user.id] || {};
                    const isAnyShared = perms.share_orders || perms.share_maintenance || perms.share_installations || perms.share_appointments;

                    return (
                      <div key={user.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isAnyShared ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-500'}`}>
                              {user.initials}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{user.full_name}</p>
                              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs pl-11">
                          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                            <input type="checkbox" className="checkbox checkbox-xs checkbox-primary"
                              checked={perms.share_orders || false}
                              onChange={(e) => handleUpdatePermission(user.id, 'orders', e.target.checked)} />
                            <span>Ordens</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                            <input type="checkbox" className="checkbox checkbox-xs checkbox-secondary"
                              checked={perms.share_maintenance || false}
                              onChange={(e) => handleUpdatePermission(user.id, 'maintenance', e.target.checked)} />
                            <span>Manutenções</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                            <input type="checkbox" className="checkbox checkbox-xs checkbox-info"
                              checked={perms.share_installations || false}
                              onChange={(e) => handleUpdatePermission(user.id, 'installations', e.target.checked)} />
                            <span>Instalações</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                            <input type="checkbox" className="checkbox checkbox-xs checkbox-warning"
                              checked={perms.share_appointments || false}
                              onChange={(e) => handleUpdatePermission(user.id, 'appointments', e.target.checked)} />
                            <span>Agendamentos</span>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Novo Agendamento</h2>
            </div>
            <div className="p-6 space-y-4">
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
                  placeholder="Título do agendamento"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Data *</label>
                  <input
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Horário</label>
                  <input
                    type="time"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="label">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input min-h-[80px]"
                  placeholder="Detalhes do agendamento..."
                />
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button onClick={handleCreate} disabled={saving} className="btn btn-primary">
                {saving ? <Loader2 className="animate-spin" size={20} /> : null}
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
