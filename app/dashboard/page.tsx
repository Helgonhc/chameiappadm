'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import {
  Users,
  Building2,
  Wrench,
  ClipboardList,
  Ticket,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  Calendar,
  Bell,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { Skeleton, DashboardSkeleton } from '@/components/Skeleton';
import { getStatusColor, getStatusLabel } from '@/utils/statusUtils';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

interface DashboardStats {
  totalClients: number;
  totalEquipments: number;
  pendingOrders: number;
  openTickets: number;
  pendingOvertime: number;
  completedToday: number;
  maintenanceVencidas: number;
  maintenanceUrgentes: number;
  maintenanceProximas: number;
}

export default function DashboardPage() {
  const { profile, isDemoMode } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [statusChartData, setStatusChartData] = useState<any[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const alertShown = useRef(false);


  const COLORS = ['#4f46e5', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

  useEffect(() => {
    loadMockDashboard();
  }, []);

  async function loadMockDashboard() {
    setLoading(true);
    // Simular atraso para feeling premium
    await new Promise(resolve => setTimeout(resolve, 800));

    setStats({
      totalClients: 42,
      totalEquipments: 156,
      pendingOrders: 8,
      openTickets: 3,
      pendingOvertime: 12,
      completedToday: 5,
      maintenanceVencidas: 2,
      maintenanceUrgentes: 4,
      maintenanceProximas: 15
    });

    setRecentOrders([
      { id: '1', client_name: 'Condomínio Solar', title: 'Manutenção AC Central', status: 'em_andamento', created_at: new Date().toISOString() },
      { id: '2', client_name: 'Hospital Santa Maria', title: 'Reparo Chiller', status: 'pendente', created_at: new Date().toISOString() }
    ]);

    setRecentTickets([
      { id: '1', client_name: 'Escritório Advocacia', subject: 'Vazamento no split', priority: 'high', status: 'aberto', created_at: new Date().toISOString() },
      { id: '2', client_name: 'Hotel Plaza', subject: 'Equipamento não liga', priority: 'medium', status: 'em_analise', created_at: new Date().toISOString() }
    ]);

    setChartData([
      { name: 'Seg', ordens: 4, chamados: 2 },
      { name: 'Ter', ordens: 7, chamados: 4 },
      { name: 'Qua', ordens: 5, chamados: 8 },
      { name: 'Qui', ordens: 8, chamados: 3 },
      { name: 'Sex', ordens: 12, chamados: 5 },
      { name: 'Sáb', ordens: 3, chamados: 1 },
      { name: 'Dom', ordens: 1, chamados: 0 }
    ]);

    setStatusChartData([
      { name: 'Concluídas', value: 45 },
      { name: 'Em Andamento', value: 25 },
      { name: 'Pendentes', value: 20 },
      { name: 'Atrasadas', value: 10 }
    ]);

    setUpcomingAppointments([
      { id: '1', client_name: 'Supermercado Ideal', title: 'Limpeza Preventiva', date: new Date().toISOString() },
      { id: '2', client_name: 'Residencial Aurora', title: 'Troca de Filtros', date: new Date(Date.now() + 86400000).toISOString() }
    ]);

    setMaintenanceAlerts([
      { id: '1', client_name: 'Condomínio Solar', title: 'Manutenção de Outubro', urgency_status: 'vencido', next_maintenance_date: '2023-10-15' },
      { id: '2', client_name: 'Shopping Center', title: 'Revisão Semestral', urgency_status: 'urgente', next_maintenance_date: '2023-11-20' }
    ]);

    setLoading(false);
  }

  // Purely mock update for demo
  async function updateAppointmentStatus(id: string, newStatus: string) {
    toast.success(`Agendamento ${newStatus === 'confirmed' ? 'confirmado' : 'atualizado'}! (Simulação)`);
    // No need to reload as we are in static development mode
  }

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Premium Header */}
      <div className="mb-8 sm:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-2">
              {(() => {
                const hour = new Date().getHours();
                if (hour < 12) return 'Bom dia';
                if (hour < 18) return 'Boa tarde';
                return 'Boa noite';
              })()}, {profile?.full_name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400">Aqui está o resumo operacional de hoje</p>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full">
            <div className="relative flex items-center justify-center">
              <span className="absolute w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75"></span>
              <span className="relative w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400">Sistema Operacional</span>
          </div>
        </div>

        {/* Subtle Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent"></div>
      </div>

      {/* Lembretes / Próximos Agendamentos */}
      {upcomingAppointments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingAppointments.map((app) => (
            <div key={app.id} className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm border-l-4 border-l-indigo-500 relative overflow-hidden group">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-[9px] sm:text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                    <Calendar size={10} /> {app.requested_date} às {app.requested_time_start}
                  </p>
                  <h4 className="font-bold text-gray-800 dark:text-white text-xs sm:text-sm leading-tight">{app.title || app.service_type}</h4>
                  <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{app.clients?.name}</p>
                </div>
                {(app.status === 'pending' || app.status === 'pendente') && (
                  <button
                    onClick={() => updateAppointmentStatus(app.id, 'confirmed')}
                    className="p-1.5 bg-white dark:bg-slate-800 text-emerald-600 rounded-lg shadow-sm border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors shrink-0"
                    title="Confirmar Agendamento"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest ${app.status === 'confirmed' || app.status === 'confirmado' ? 'bg-green-100 dark:bg-emerald-500/10 text-green-700 dark:text-emerald-400' :
                  app.status === 'pending' || app.status === 'pendente' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' :
                    'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-400'
                  }`}>
                  {app.status === 'pending' || app.status === 'pendente' ? 'Pendente' :
                    app.status === 'confirmed' || app.status === 'confirmado' ? 'Confirmado' : app.status}
                </span>
                <Link href="/dashboard/agenda" className="text-[9px] sm:text-[10px] font-black text-gray-400 hover:text-indigo-600 hover:underline uppercase tracking-widest">
                  Ver na agenda
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alertas de Manutenções Críticas */}
      {maintenanceAlerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {maintenanceAlerts.map((alert) => (
            <div key={alert.id} className={`card ${alert.urgency_status === 'vencido' ? 'border-l-4 border-l-red-500 bg-red-50/50' : 'border-l-4 border-l-amber-500 bg-amber-50/50'
              } relative overflow-hidden group`}>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${alert.urgency_status === 'vencido' ? 'text-red-600' : 'text-amber-600'
                    }`}>
                    {alert.urgency_status === 'vencido' ? <AlertCircle size={10} /> : <Clock size={10} />}
                    {alert.urgency_status === 'vencido' ? 'Manutenção Vencida' : 'Urgente (Próximos 7 dias)'}
                  </p>
                  <h4 className="font-bold text-gray-800 text-sm truncate max-w-[200px]">{alert.title}</h4>
                  <p className="text-xs text-gray-500">{alert.client_name}</p>
                </div>
                <Link
                  href={`/dashboard/maintenance`}
                  className={`p-1.5 rounded-lg shadow-sm border transition-colors ${alert.urgency_status === 'vencido' ? 'bg-white text-red-600 border-red-100 hover:bg-red-50' : 'bg-white text-amber-600 border-amber-100 hover:bg-amber-50'
                    }`}
                >
                  <ChevronRight size={18} />
                </Link>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-[10px] text-gray-500 font-bold">
                  Data: {new Date(alert.next_maintenance_date).toLocaleDateString('pt-BR')}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${alert.urgency_status === 'vencido' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                  {alert.urgency_status === 'vencido' ? 'Vencida' : 'Urgente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Premium Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Clientes', count: stats?.totalClients, icon: Building2, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', borderColor: 'hover:border-blue-200 dark:hover:border-blue-500/30', href: '/dashboard/clients' },
          { label: 'Equipamentos', count: stats?.totalEquipments, icon: Wrench, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10', borderColor: 'hover:border-purple-200 dark:hover:border-purple-500/30', href: '/dashboard/equipments' },
          { label: 'OS Pendentes', count: stats?.pendingOrders, icon: ClipboardList, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', borderColor: 'hover:border-amber-200 dark:hover:border-amber-500/30', href: '/dashboard/orders' },
          { label: 'Chamados', count: stats?.openTickets, icon: Ticket, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10', borderColor: 'hover:border-red-200 dark:hover:border-red-500/30', href: '/dashboard/tickets' },
          { label: 'Horas', count: stats?.pendingOvertime, icon: Clock, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10', borderColor: 'hover:border-indigo-200 dark:hover:border-indigo-500/30', href: '/dashboard/overtime' },
          { label: 'Hoje', count: stats?.completedToday, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', borderColor: 'hover:border-emerald-200 dark:hover:border-emerald-500/30' },
        ].map((stat, i) => {
          const Content = (
            <div className="flex flex-col items-center text-center gap-3">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform duration-300 group-hover:scale-110`}>
                <stat.icon size={24} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-none mb-1.5">{stat.count}</p>
                <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          );

          return stat.href ? (
            <Link key={i} href={stat.href} className={`group bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/5 ${stat.borderColor} p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
              {Content}
            </Link>
          ) : (
            <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/5 p-5 sm:p-6 rounded-2xl shadow-sm">
              {Content}
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-600" />
            Volume de O.S. (Últimos 7 dias)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                />
                <Bar dataKey="quantidade" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card text-responsive overflow-hidden">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ClipboardList size={18} className="text-indigo-600" />
            Distribuição por Status
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alertas de Manutenções */}
      {(stats?.maintenanceVencidas || 0) + (stats?.maintenanceUrgentes || 0) > 0 && (
        <div className="card border-l-4 border-l-red-500 bg-red-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Bell className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800">⚠️ Atenção: Manutenções Pendentes!</h3>
                <p className="text-sm text-red-600">
                  {stats?.maintenanceVencidas || 0} vencidas • {stats?.maintenanceUrgentes || 0} urgentes (próximos 7 dias)
                </p>
              </div>
            </div>
            <Link href="/dashboard/maintenance" className="btn btn-sm bg-red-600 hover:bg-red-700 text-white">
              Ver Manutenções
            </Link>
          </div>
        </div>
      )}

      {/* Stats de Manutenções */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/maintenance" className="card card-hover border-l-4 border-l-red-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats?.maintenanceVencidas || 0}</p>
              <p className="text-xs text-gray-500">Manutenções Vencidas</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/maintenance" className="card card-hover border-l-4 border-l-amber-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats?.maintenanceUrgentes || 0}</p>
              <p className="text-xs text-gray-500">Urgentes (7 dias)</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/maintenance" className="card card-hover border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats?.maintenanceProximas || 0}</p>
              <p className="text-xs text-gray-500">Próximas (30 dias)</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Ordens Recentes</h2>
            <Link href="/dashboard/orders" className="text-sm text-indigo-600 hover:underline">
              Ver todas
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Nenhuma ordem encontrada</p>
            ) : (
              recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{order.title}</p>
                    <p className="text-xs text-gray-500">{order.clients?.name}</p>
                  </div>
                  <span className={`badge ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Chamados Recentes</h2>
            <Link href="/dashboard/tickets" className="text-sm text-indigo-600 hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {recentTickets.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Nenhum chamado encontrado</p>
            ) : (
              recentTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/dashboard/tickets/${ticket.id}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{ticket.title}</p>
                    <p className="text-xs text-gray-500">{ticket.clients?.name}</p>
                  </div>
                  <span className={`badge ${getStatusColor(ticket.status)}`}>
                    {getStatusLabel(ticket.status)}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Rodapé de Créditos - Padrão Global */}
      <div className="pt-20 pb-10 border-t border-gray-100 dark:border-white/5 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">
          © 2026 ChameiApp - Gestão Inteligente <br />
          <span className="text-emerald-500 mt-2 block ">Desenvolvido por Helgon Henrique</span>
        </p>
      </div>
    </div>
  );
}
