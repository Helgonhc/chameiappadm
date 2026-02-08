'use client';

import { useState, useEffect } from 'react';
import {
    Users, Building2, Wrench, ClipboardList, Ticket, Clock,
    TrendingUp, AlertCircle, CheckCircle, Calendar, Bell,
    ChevronRight, MessageCircle
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import toast from 'react-hot-toast';

export default function DemoDashboardPage() {
    const [loading, setLoading] = useState(true);

    const COLORS = ['#4f46e5', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            toast.error('Atenção: Você tem 2 manutenções críticas!', {
                id: 'msg-manutencao-critica',
                icon: '⚠️',
                duration: 6000
            });
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleDemoAction = (action: string) => {
        toast(`🔒 "${action}" desabilitado no modo demonstração`, {
            icon: 'ℹ️',
            duration: 2000,
        });
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fadeIn pb-20">
            {/* 1. Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Olá, Administrador! 👋
                </h1>
                <p className="text-gray-500 dark:text-gray-400">Aqui está o resumo operacional de hoje</p>
            </div>

            {/* 2. Lembretes / Próximos Agendamentos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { id: '1', title: 'Manutenção Preventiva', client: 'Condomínio Solar', date: '07/02', time: '10:00', status: 'pending' },
                    { id: '2', title: 'Instalação de Câmeras', client: 'Empresa Alpha', date: '07/02', time: '14:30', status: 'confirmed' },
                ].map((app) => (
                    <div key={app.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm border-l-4 border-l-indigo-500 relative overflow-hidden group">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                                    <Calendar size={10} /> {app.date} às {app.time}
                                </p>
                                <h4 className="font-bold text-gray-800 dark:text-white text-sm">{app.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{app.client}</p>
                            </div>
                            {app.status === 'pending' && (
                                <button
                                    onClick={() => handleDemoAction('Confirmar Agendamento')}
                                    className="p-1.5 bg-white dark:bg-slate-800 text-emerald-600 rounded-lg shadow-sm border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
                                >
                                    <CheckCircle size={18} />
                                </button>
                            )}
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${app.status === 'confirmed' ? 'bg-green-100 dark:bg-emerald-500/10 text-green-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                }`}>
                                {app.status === 'pending' ? 'Pendente' : 'Confirmado'}
                            </span>
                            <button
                                onClick={() => handleDemoAction('Ver Agenda')}
                                className="text-[10px] text-gray-400 hover:text-indigo-600 hover:underline"
                            >
                                Ver na agenda
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Alertas de Manutenções Críticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { id: 'm1', title: 'Subestação de Energia', client: 'Indústria Metalex', date: '01/02', status: 'vencido' },
                    { id: 'm2', title: 'Chiller Unidade 2', client: 'Hospital Regional', date: '09/02', status: 'urgente' },
                ].map((alert) => (
                    <div key={alert.id} className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm border-l-4 ${alert.status === 'vencido' ? 'border-l-red-500 bg-red-50/50 dark:bg-red-500/5' : 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-500/5'
                        } relative overflow-hidden group`}>
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <p className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${alert.status === 'vencido' ? 'text-red-600' : 'text-amber-600'
                                    }`}>
                                    {alert.status === 'vencido' ? <AlertCircle size={10} /> : <Clock size={10} />}
                                    {alert.status === 'vencido' ? 'Manutenção Vencida' : 'Urgente (Próximos 7 dias)'}
                                </p>
                                <h4 className="font-bold text-gray-800 dark:text-white text-sm truncate max-w-[200px]">{alert.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{alert.client}</p>
                            </div>
                            <button
                                onClick={() => handleDemoAction('Ver Manutenção')}
                                className={`p-1.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm border transition-colors ${alert.status === 'vencido' ? 'text-red-600 border-red-100 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10' : 'text-amber-600 border-amber-100 dark:border-amber-500/20 hover:bg-amber-50 dark:hover:bg-amber-500/10'
                                    }`}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">
                                Data: {alert.date}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${alert.status === 'vencido' ? 'bg-red-100 dark:bg-red-500/20 text-red-700' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700'
                                }`}>
                                {alert.status === 'vencido' ? 'Vencida' : 'Urgente'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 4. Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                    { label: 'Clientes', count: 42, icon: Building2, color: 'blue', href: '/demo/clients' },
                    { label: 'Equipamentos', count: 184, icon: Wrench, color: 'purple', href: '/demo/equipments' },
                    { label: 'OS Pendentes', count: 12, icon: ClipboardList, color: 'amber', href: '/demo/orders' },
                    { label: 'Chamados', count: 5, icon: Ticket, color: 'red', href: '/demo/tickets' },
                    { label: 'Horas', count: 2, icon: Clock, color: 'indigo', href: '/demo/overtime' },
                    { label: 'Hoje', count: 8, icon: CheckCircle, color: 'emerald', noLink: true },
                ].map((stat, i) => {
                    const bgColors: Record<string, string> = {
                        blue: 'bg-blue-100 dark:bg-blue-500/10 text-blue-600',
                        purple: 'bg-purple-100 dark:bg-purple-500/10 text-purple-600',
                        amber: 'bg-amber-100 dark:bg-amber-500/10 text-amber-600',
                        red: 'bg-red-100 dark:bg-red-500/10 text-red-600',
                        indigo: 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600',
                        emerald: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600',
                    };

                    const Content = (
                        <>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${bgColors[stat.color]}`}>
                                    <stat.icon size={20} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white leading-none mb-1">{stat.count}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-tight">{stat.label}</p>
                                </div>
                            </div>
                        </>
                    );

                    return stat.noLink ? (
                        <div key={i} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 p-4 rounded-xl shadow-sm">
                            {Content}
                        </div>
                    ) : (
                        <a key={i} href={stat.href} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 p-4 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer">
                            {Content}
                        </a>
                    );
                })}
            </div>

            {/* 5. Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
                        <TrendingUp size={18} className="text-indigo-600" />
                        Volume de O.S. (Últimos 7 dias)
                    </h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[{ day: 'Seg', q: 12 }, { day: 'Ter', q: 18 }, { day: 'Qua', q: 15 }, { day: 'Qui', q: 22 }, { day: 'Sex', q: 19 }, { day: 'Sáb', q: 8 }, { day: 'Dom', q: 5 }]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: '#1e293b', color: '#fff' }}
                                    cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                                />
                                <Bar dataKey="q" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-6 flex items-center gap-2 text-sm uppercase tracking-widest">
                        <ClipboardList size={18} className="text-indigo-600" />
                        Distribuição por Status
                    </h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[{ n: 'Pendente', v: 12 }, { n: 'Execução', v: 25 }, { n: 'Concluído', v: 147 }, { n: 'Cancelado', v: 3 }]}
                                    cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="v"
                                >
                                    {COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', background: '#1e293b', color: '#fff' }} />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 6. Alerta de Manutenções Pendentes (Banner) */}
            <div className="bg-white dark:bg-slate-900 border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-500/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-500/20 rounded-lg">
                            <Bell className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-red-800 dark:text-red-400">⚠️ Atenção: Manutenções Pendentes!</h3>
                            <p className="text-xs text-red-600/80 dark:text-red-400/60 font-medium">
                                2 vencidas • 1 urgente (próximos 7 dias)
                            </p>
                        </div>
                    </div>
                    <a href="/demo/maintenance" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase rounded-lg transition-all">
                        Ver Manutenções
                    </a>
                </div>
            </div>

            {/* 7. Stats de Manutenções (Secondary Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Vencidas', count: 2, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-500/10', border: 'border-l-red-500' },
                    { label: 'Urgentes (7d)', count: 1, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-500/10', border: 'border-l-amber-500' },
                    { label: 'Próximas (30d)', count: 5, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-500/10', border: 'border-l-blue-500' },
                ].map((stat, i) => (
                    <a key={i} href="/demo/maintenance" className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm border-l-4 ${stat.border} hover:bg-gray-50 dark:hover:bg-slate-800 transition-all`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tight">{stat.label}</p>
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            {/* 8. Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-gray-800 dark:text-white uppercase text-xs tracking-widest">Ordens Recentes</h2>
                        <a href="/demo/orders" className="text-[10px] font-black text-indigo-600 uppercase hover:underline">Ver todas</a>
                    </div>
                    <div className="space-y-3">
                        {[
                            { t: 'Manutenção Mensal Elevadores', c: 'Condomínio Solar', s: 'completed' },
                            { t: 'Troca de Sensores de Presença', c: 'Office Center', s: 'in_progress' },
                            { t: 'Reparo em Quadros de Comando', c: 'Tech Solutions', s: 'pending' },
                        ].map((order, j) => (
                            <button
                                key={j}
                                onClick={() => handleDemoAction(`Ver OS: ${order.t}`)}
                                className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-800/30 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all"
                            >
                                <div className="text-left">
                                    <p className="font-bold text-gray-800 dark:text-white text-sm leading-tight">{order.t}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{order.c}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${order.s === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                        order.s === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {order.s === 'completed' ? 'Concluído' : order.s === 'in_progress' ? 'Em Execução' : 'Pendente'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recent Tickets */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-gray-800 dark:text-white uppercase text-xs tracking-widest">Chamados Recentes</h2>
                        <a href="/demo/tickets" className="text-[10px] font-black text-indigo-600 uppercase hover:underline">Ver todos</a>
                    </div>
                    <div className="space-y-3">
                        {[
                            { t: 'Ar Condicionado Sem Resfriar', c: 'Empresa Alpha', s: 'open' },
                            { t: 'Cerca Elétrica em Curto', c: 'Condomínio Bela Vista', s: 'open' },
                            { t: 'Gerador Apresentando Falha', c: 'Indústria Metalex', s: 'in_progress' },
                        ].map((ticket, j) => (
                            <button
                                key={j}
                                onClick={() => handleDemoAction(`Ver Chamado: ${ticket.t}`)}
                                className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-800/30 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all"
                            >
                                <div className="text-left">
                                    <p className="font-bold text-gray-800 dark:text-white text-sm leading-tight">{ticket.t}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{ticket.c}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${ticket.s === 'open' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    {ticket.s === 'open' ? 'Aberto' : 'Em Análise'}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 9. Credits Footer */}
            <div className="pt-20 pb-10 border-t border-gray-100 dark:border-white/5 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[4px]">
                    © 2026 ChameiApp - Gestão Inteligente <br />
                    <span className="text-emerald-500 mt-2 block ">Desenvolvido por Helgon Henrique</span>
                </p>
            </div>
        </div>
    );
}
