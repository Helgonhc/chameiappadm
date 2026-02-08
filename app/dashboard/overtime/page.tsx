'use client';

import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase'; // Decoupled
import { useAuthStore } from '@/store/authStore';
import { Plus, Search, Filter, Eye, Loader2, Clock, FileText, Check, X, Calendar, User, ArrowUpRight, ArrowDownLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Interfaces Definition for consistency
export interface OvertimeEntry {
  id: string;
  user_id: string;
  entry_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string;   // HH:MM
  total_hours: number;
  entry_type: 'overtime' | 'compensation' | 'absence';
  reason?: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at?: string;
  profiles?: {
    full_name: string;
    avatar_url?: string;
  };
}

export default function OvertimePage() {
  const { profile } = useAuthStore();
  const [entries, setEntries] = useState<OvertimeEntry[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Modern Filter States
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const [formData, setFormData] = useState({
    user_id: '',
    entry_date: new Date().toISOString().split('T')[0],
    start_time: '08:00',
    end_time: '18:00',
    entry_type: 'overtime',
    reason: '',
  });

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - 2 + i).toString());

  // Mock Admin Check (Assume Admin for Demo or check profile role if available in mock)
  const isAdmin = true; // Forcing true for demo purposes to show all actions

  useEffect(() => {
    loadMockData();
  }, []);

  async function loadMockData() {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // 1. Mock Employees
    const mockEmployees = [
      { id: 'u1', full_name: 'Carlos Silva', role: 'technician', avatar: 'https://i.pravatar.cc/150?u=u1' },
      { id: 'u2', full_name: 'Ana Souza', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=u2' },
      { id: 'u3', full_name: 'Roberto Santos', role: 'super_admin', avatar: 'https://i.pravatar.cc/150?u=u3' },
      { id: 'u4', full_name: 'Marcos Oliveira', role: 'technician', avatar: 'https://i.pravatar.cc/150?u=u4' },
      { id: 'u5', full_name: 'Julia Pereira', role: 'admin', avatar: 'https://i.pravatar.cc/150?u=u5' },
    ];
    setEmployees(mockEmployees);

    // 2. Mock Entries
    const generateMockEntries = () => {
      const types = ['overtime', 'compensation', 'absence'] as const;
      const statuses = ['aprovado', 'pendente', 'rejeitado'] as const;
      const reasons = ['Manutenção emergencial', 'Compensação de feriado', 'Consulta médica', 'Instalação fora de hora', 'Banco de horas acumulado'];

      return Array.from({ length: 15 }).map((_, i) => {
        const emp = mockEmployees[Math.floor(Math.random() * mockEmployees.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));

        const startH = 18 + Math.floor(Math.random() * 2);
        const endH = startH + 1 + Math.floor(Math.random() * 3);

        return {
          id: `entry-${i}`,
          user_id: emp.id,
          entry_date: date.toISOString().split('T')[0],
          start_time: `${startH}:00`,
          end_time: `${endH}:00`,
          total_hours: endH - startH,
          entry_type: type,
          reason: reasons[Math.floor(Math.random() * reasons.length)],
          status: status,
          profiles: { full_name: emp.full_name, avatar_url: emp.avatar }
        };
      });
    };

    setEntries(generateMockEntries());
    setLoading(false);
  }

  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.entry_date + 'T00:00:00');
    const matchesMonth = selectedMonth === 'all' || entryDate.getMonth().toString() === selectedMonth;
    const matchesYear = selectedYear === 'all' || entryDate.getFullYear().toString() === selectedYear;

    const matchesSearch = entry.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      entry.reason?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;

    return matchesSearch && matchesStatus && matchesMonth && matchesYear;
  });

  function calculateHours(start: string, end: string): number {
    if (!start || !end) return 0;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    return Math.max(0, (endMinutes - startMinutes) / 60);
  }

  async function handleCreate() {
    const userId = formData.user_id || profile?.id || 'u1'; // Default to mock user if not selected
    if (!userId || !formData.entry_date) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    const totalHours = calculateHours(formData.start_time, formData.end_time);
    if (totalHours <= 0) {
      toast.error('Horário inválido');
      return;
    }

    setSaving(true);
    // Mock Create
    setTimeout(() => {
      const emp = employees.find(e => e.id === userId) || employees[0];
      const newEntry: OvertimeEntry = {
        id: `entry-${Date.now()}`,
        user_id: userId,
        entry_date: formData.entry_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        total_hours: totalHours,
        entry_type: formData.entry_type as any,
        reason: formData.reason,
        status: isAdmin ? 'aprovado' : 'pendente',
        profiles: { full_name: emp.full_name, avatar_url: emp.avatar }
      };

      setEntries([newEntry, ...entries]);
      toast.success('Lançamento criado (Mock)!');
      setShowModal(false);
      setFormData({
        user_id: '',
        entry_date: new Date().toISOString().split('T')[0],
        start_time: '08:00',
        end_time: '18:00',
        entry_type: 'overtime',
        reason: '',
      });
      setSaving(false);
    }, 600);
  }

  async function handleApprove(entry: OvertimeEntry) {
    // Mock Approve
    setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, status: 'aprovado' } : e));
    toast.success('Aprovado com sucesso! (Mock)');
  }

  async function handleReject(entry: OvertimeEntry) {
    const reason = prompt('Motivo da rejeição:');
    if (!reason) return;

    // Mock Reject
    setEntries(prev => prev.map(e => e.id === entry.id ? { ...e, status: 'rejeitado', rejection_reason: reason } : e));
    toast.success('Rejeitado com sucesso! (Mock)');
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aprovado': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejeitado': return 'bg-red-100 text-red-700 border-red-200';
      case 'pendente': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'overtime': return <ArrowUpRight className="text-emerald-500" size={16} />;
      case 'compensation': return <ArrowDownLeft className="text-amber-500" size={16} />;
      case 'absence': return <AlertCircle className="text-red-500" size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'overtime': return 'Hora Extra';
      case 'compensation': return 'Compensação';
      case 'absence': return 'Ausência';
      default: return type;
    }
  };

  // Calculate totals
  const totals = entries.reduce((acc, entry) => {
    if (entry.status === 'aprovado') {
      if (entry.entry_type === 'overtime') acc.overtime += entry.total_hours;
      if (entry.entry_type === 'compensation') acc.compensation += entry.total_hours;
      if (entry.entry_type === 'absence') acc.absence += entry.total_hours;
    }
    if (entry.status === 'pendente') acc.pending++;
    return acc;
  }, { overtime: 0, compensation: 0, absence: 0, pending: 0 });

  const saldo = totals.overtime - totals.compensation - totals.absence;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8 animate-fadeIn text-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Banco de Horas
          </h1>
          <p className="text-slate-500 mt-1">
            Gerencie horas extras, compensações e saldo da equipe.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="btn bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-all hover:shadow-md">
            <FileText size={18} className="mr-2" />
            Exportar Relatório
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="btn bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all hover:scale-105"
          >
            <Plus size={18} className="mr-2" />
            Novo Lançamento
          </button>
        </div>
      </div>

      {/* Stats Cards - Glassmorphism */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative group overflow-hidden bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-xl transition-all duration-300">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-100 rounded-bl-[100px] -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <ArrowUpRight size={20} />
              </div>
              <p className="font-medium text-slate-500">Horas Extras</p>
            </div>
            <p className="text-3xl font-bold text-slate-800">+{totals.overtime.toFixed(1)}h</p>
            <p className="text-xs text-emerald-600 mt-1 font-medium flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
              Aprovadas este mês
            </p>
          </div>
        </div>

        <div className="relative group overflow-hidden bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-xl transition-all duration-300">
          <div className="absolute right-0 top-0 w-24 h-24 bg-amber-100 rounded-bl-[100px] -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <ArrowDownLeft size={20} />
              </div>
              <p className="font-medium text-slate-500">Compensações</p>
            </div>
            <p className="text-3xl font-bold text-slate-800">-{totals.compensation.toFixed(1)}h</p>
            <p className="text-xs text-amber-600 mt-1 font-medium flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1"></span>
              Utilizadas este mês
            </p>
          </div>
        </div>

        <div className="relative group overflow-hidden bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-xl transition-all duration-300">
          <div className="absolute right-0 top-0 w-24 h-24 bg-red-100 rounded-bl-[100px] -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <AlertCircle size={20} />
              </div>
              <p className="font-medium text-slate-500">Ausências</p>
            </div>
            <p className="text-3xl font-bold text-slate-800">-{totals.absence.toFixed(1)}h</p>
            <p className="text-xs text-red-600 mt-1 font-medium flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1"></span>
              Não justificadas
            </p>
          </div>
        </div>

        <div className={`relative group overflow-hidden rounded-2xl p-6 shadow-md border hover:shadow-xl transition-all duration-300 ${saldo >= 0 ? 'bg-gradient-to-br from-indigo-500 to-violet-600 border-indigo-400 text-white' : 'bg-gradient-to-br from-red-500 to-rose-600 border-red-400 text-white'}`}>
          <div className="absolute right-0 top-0 w-32 h-32 bg-white rounded-full mix-blend-overlay opacity-10 -mr-8 -mt-8 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Clock size={20} className="text-white" />
              </div>
              <p className="font-medium text-white/90">Saldo Geral</p>
            </div>
            <p className="text-4xl font-bold text-white tracking-tight">
              {saldo >= 0 ? '+' : ''}{saldo.toFixed(1)}h
            </p>
            <p className="text-xs text-white/80 mt-1 font-medium bg-black/10 w-fit px-2 py-0.5 rounded-full backdrop-blur-sm">
              Atualizado hoje
            </p>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col lg:flex-row gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por funcionário ou motivo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500/20 text-slate-600 placeholder:text-slate-400 transition-all font-medium"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border-none rounded-lg text-slate-600 font-medium cursor-pointer hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">Todos os Meses</option>
            {months.map((m, i) => (
              <option key={i} value={i.toString()}>{m}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border-none rounded-lg text-slate-600 font-medium cursor-pointer hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">Todos os Status</option>
            <option value="pendente">Pendentes ({totals.pending})</option>
            <option value="aprovado">Aprovados</option>
            <option value="rejeitado">Rejeitados</option>
          </select>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Funcionário</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Data & Tipo</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Horário</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                {isAdmin && <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Clock className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-slate-500 font-medium">Nenhum lançamento encontrado</p>
                      <p className="text-slate-400 text-sm mt-1">Tente ajustar seus filtros de busca</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden shadow-sm border-2 border-white">
                          {entry.profiles?.avatar_url ? (
                            <img src={entry.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            entry.profiles?.full_name?.charAt(0) || <User size={18} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{entry.profiles?.full_name}</p>
                          <p className="text-xs text-slate-500">Técnico</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">
                          {new Date(entry.entry_date + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          {getTypeIcon(entry.entry_type)}
                          <span className="text-xs text-slate-500 capitalize">{getTypeLabel(entry.entry_type)}</span>
                        </div>
                        {entry.reason && (
                          <span className="text-xs text-slate-400 mt-0.5 max-w-[150px] truncate" title={entry.reason}>{entry.reason}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100/50 px-2 py-1 rounded-md w-fit">
                        <Clock size={14} className="text-slate-400" />
                        {entry.start_time.substring(0, 5)} - {entry.end_time.substring(0, 5)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold text-lg ${entry.entry_type === 'overtime' ? 'text-emerald-600' :
                          entry.entry_type === 'absence' ? 'text-red-500' : 'text-amber-600'
                        }`}>
                        {entry.entry_type === 'overtime' ? '+' : '-'}{entry.total_hours.toFixed(1)}h
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(entry.status)} shadow-sm`}>
                        {entry.status === 'aprovado' && <Check size={12} className="mr-1" />}
                        {entry.status === 'rejeitado' && <X size={12} className="mr-1" />}
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {entry.status === 'pendente' && (
                            <>
                              <button
                                onClick={() => handleApprove(entry)}
                                className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 hover:shadow-sm border border-transparent hover:border-emerald-100 transition-all"
                                title="Aprovar"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => handleReject(entry)}
                                className="p-2 hover:bg-red-50 rounded-lg text-red-600 hover:shadow-sm border border-transparent hover:border-red-100 transition-all"
                                title="Rejeitar"
                              >
                                <X size={18} />
                              </button>
                            </>
                          )}
                          <Link
                            href="#"
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all"
                            title="Ver detalhes"
                          >
                            <Eye size={18} />
                          </Link>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Novo Lançamento</h2>
                <p className="text-xs text-slate-500">Preencha os dados abaixo</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {isAdmin && (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Funcionário</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      value={formData.user_id}
                      onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none"
                    >
                      <option value="">Lançar para mim</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Data</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      value={formData.entry_date}
                      onChange={(e) => setFormData({ ...formData, entry_date: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-600"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Tipo</label>
                  <select
                    value={formData.entry_type}
                    onChange={(e) => setFormData({ ...formData, entry_type: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-600"
                  >
                    <option value="overtime">⏰ Hora Extra</option>
                    <option value="compensation">🔄 Compensação</option>
                    <option value="absence">❌ Ausência</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Início</label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500/20 outline-none text-center font-mono text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Fim</label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500/20 outline-none text-center font-mono text-slate-700"
                  />
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-500">Cálculo Automático</span>
                  <span className="text-lg font-bold text-indigo-600">
                    {calculateHours(formData.start_time, formData.end_time).toFixed(1)} horas
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Motivo</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all min-h-[80px] resize-none text-slate-600 placeholder:text-slate-400"
                  placeholder="Descreva o motivo da hora extra ou ausência..."
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-800 font-medium transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={saving}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving && <Loader2 className="animate-spin" size={18} />}
                Confirmar Lançamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
