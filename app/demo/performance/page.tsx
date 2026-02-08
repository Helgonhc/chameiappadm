'use client';

import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import {
    Users, TrendingUp, Clock, Award, Target, Calendar, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DemoPerformancePage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleDemoAction = (action: string) => {
        toast(`🔒 "${action}" desabilitado no modo demonstração`, {
            icon: 'ℹ️',
            duration: 2000,
        });
    };

    const COLORS = ['#4f46e5', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899'];

    // High Fidelity Mock Data from Production Patterns
    const techPerformance = [
        { name: 'Ricardo Silva', count: 48 },
        { name: 'Marcos Oliveira', count: 42 },
        { name: 'Felipe Costa', count: 35 },
        { name: 'Ana Souza', count: 29 },
        { name: 'Breno Mendes', count: 24 },
    ];

    const clientDemand = [
        { name: 'Condomínio Solar', count: 25 },
        { name: 'Hospital Central', count: 18 },
        { name: 'Shopping Plaza', count: 15 },
        { name: 'Indústria Metalex', count: 12 },
        { name: 'Escola ABC', count: 8 },
    ];

    const profitData = [
        { name: 'OS #2041', lucro: 1250 },
        { name: 'OS #2038', lucro: 980 },
        { name: 'OS #2045', lucro: 850 },
        { name: 'OS #2033', lucro: 720 },
        { name: 'OS #2050', lucro: 650 },
    ];

    const volumeData = [
        { name: 'Jul', os: 45, tickets: 30 },
        { name: 'Ago', os: 52, tickets: 38 },
        { name: 'Set', os: 48, tickets: 35 },
        { name: 'Out', os: 61, tickets: 42 },
        { name: 'Nov', os: 55, tickets: 40 },
        { name: 'Dez', os: 67, tickets: 45 },
    ];

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fadeIn pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Award className="text-indigo-600" /> Performance & Insights
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Análise detalhada de produtividade e volume operacional</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleDemoAction('Alterar Período')}
                        className="px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                    >
                        <Calendar size={16} /> Últimos 30 dias
                    </button>
                    <button
                        onClick={() => handleDemoAction('Filtros Avançados')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 dark:shadow-none"
                    >
                        <Filter size={16} /> Filtros
                    </button>
                </div>
            </div>

            {/* Primary Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Técnico Ranking */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm flex items-center gap-2">
                            <Users size={18} className="text-indigo-500" /> Ranking de Técnicos
                        </h3>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full uppercase tracking-widest">OS Concluídas</span>
                    </div>
                    <div className="p-4 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={techPerformance} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: '#1e293b', color: '#fff' }}
                                />
                                <Bar dataKey="count" fill="#4f46e5" radius={[0, 6, 6, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Client Demand */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-100 dark:border-white/5">
                        <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm flex items-center gap-2">
                            <Target size={18} className="text-rose-500" /> Volume por Cliente (Top 5)
                        </h3>
                    </div>
                    <div className="p-4 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={clientDemand}
                                    cx="50%" cy="45%" innerRadius={65} outerRadius={90} paddingAngle={8} dataKey="count"
                                >
                                    {clientDemand.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', background: '#1e293b', color: '#fff' }} />
                                <Legend
                                    layout="horizontal" align="center" verticalAlign="bottom" iconType="circle"
                                    wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px', color: '#64748b' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Performance & Revenue Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lucratividade por OS */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gradient-to-r from-emerald-500/[0.03] to-transparent">
                        <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm flex items-center gap-2">
                            <TrendingUp size={18} className="text-emerald-500" /> Lucratividade por OS
                        </h3>
                        <span className="text-[10px] font-black uppercase tracking-[2px] text-emerald-600">Filtro: Top 5</span>
                    </div>
                    <div className="p-4 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={profitData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} tickFormatter={(v) => `R$${v}`} />
                                <Tooltip
                                    formatter={(v: any) => [`R$ ${v.toFixed(2)}`, 'Lucro Líquido']}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: '#1e293b', color: '#fff' }}
                                />
                                <Bar dataKey="lucro" fill="#10B981" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Crescimento Operacional */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-100 dark:border-white/5">
                        <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm flex items-center gap-2">
                            <TrendingUp size={18} className="text-indigo-500" /> Volume de Atendimentos
                        </h3>
                    </div>
                    <div className="p-4 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={volumeData}>
                                <defs>
                                    <linearGradient id="colorOSDemo" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', background: '#1e293b', color: '#fff' }} />
                                <Area type="monotone" dataKey="os" stroke="#4f46e5" fillOpacity={1} fill="url(#colorOSDemo)" strokeWidth={4} />
                                <Area type="monotone" dataKey="tickets" stroke="#10B981" fillOpacity={0} strokeWidth={3} strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Faturamento Total', value: 'R$ 158.420,00', icon: TrendingUp, color: 'indigo', bg: 'bg-indigo-100 dark:bg-indigo-500/20' },
                    { label: 'Lucro Líquido', value: 'R$ 64.180,00', icon: Award, color: 'emerald', bg: 'bg-emerald-100 dark:bg-emerald-500/20', border: 'border-b-4 border-emerald-500' },
                    { label: 'Margem Média', value: '40.5%', icon: Target, color: 'amber', bg: 'bg-amber-100 dark:bg-amber-500/20' },
                    { label: 'SLA Médio', value: '4h 15m', icon: Clock, color: 'blue', bg: 'bg-blue-100 dark:bg-blue-500/20' },
                ].map((stat, i) => (
                    <div key={i} className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col items-center text-center group hover:shadow-lg transition-all ${stat.border || ''}`}>
                        <div className={`w-14 h-14 ${stat.bg} rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                            <stat.icon size={24} className={`text-${stat.color}-600 dark:text-${stat.color}-400`} />
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white leading-tight">{stat.value}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Footer Notice */}
            <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[3rem] text-center border border-gray-100 dark:border-white/5 mt-10">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[5px] mb-2">Relatórios Gerenciais Avançados</p>
                <p className="max-w-xl mx-auto text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    Obtenha métricas em tempo real sobre a saúde financeira do seu negócio. O sistema calcula automaticamente o custo de estoque e mão de obra para entregar a lucratividade real de cada serviço.
                </p>
            </div>
        </div>
    );
}
