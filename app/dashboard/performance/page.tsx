'use client';

import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
    Users, TrendingUp, Clock, CheckCircle, AlertCircle,
    ChevronRight, Calendar, Filter, Award, Target
} from 'lucide-react';
import { ListSkeleton } from '@/components/Skeleton';
import { getStatusLabel } from '@/utils/statusUtils';

export default function PerformancePage() {
    const [loading, setLoading] = useState(true);
    const [techPerformance, setTechPerformance] = useState<any[]>([]);
    const [clientDemand, setClientDemand] = useState<any[]>([]);
    const [slaStats, setSlaStats] = useState<any[]>([]);
    const [profitData, setProfitData] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalProfit: 0,
        avgProfitMargin: 0
    });

    useEffect(() => {
        loadPerformanceData();
    }, []);

    async function loadPerformanceData() {
        setLoading(true);

        // MOCK DATA - Performance & BI Standalone

        // 1. Performance dos Técnicos
        const mockTechPerformance = [
            { name: 'Ricardo Silva', count: 48 },
            { name: 'Ana Oliveira', count: 42 },
            { name: 'Carlos Santos', count: 35 },
            { name: 'Marcos Souza', count: 31 },
            { name: 'Juliana Lima', count: 28 },
            { name: 'Paulo Mendes', count: 22 },
        ];
        setTechPerformance(mockTechPerformance);

        // 2. Demanda por Cliente (Top 10)
        const mockClientDemand = [
            { name: 'Shopping Center Norte', count: 124 },
            { name: 'Hospital Santa Clara', count: 98 },
            { name: 'Escola Internacional', count: 76 },
            { name: 'Condomínio Solar', count: 54 },
            { name: 'Indústria Metalúrgica', count: 42 },
            { name: 'Restaurante Bom Sabor', count: 38 },
            { name: 'Academia Fit', count: 31 },
            { name: 'Hotel Transamérica', count: 27 },
            { name: 'Supermercado Extra', count: 22 },
            { name: 'Centro Empresarial', count: 18 },
        ];
        setClientDemand(mockClientDemand);

        // 3. Lucratividade (BI Magnata)
        const mockProfitData = [
            { name: 'VRF Install 01', receita: 45000, lucro: 12500, date: '01/02/2024' },
            { name: 'Preventiva Jan', receita: 12000, lucro: 8400, date: '05/02/2024' },
            { name: 'Emergency Rep', receita: 8500, lucro: 4200, date: '07/02/2024' },
            { name: 'Upgrade QGBT', receita: 32000, lucro: 9800, date: '10/02/2024' },
            { name: 'Instal. Câmeras', receita: 15400, lucro: 6100, date: '12/02/2024' },
            { name: 'Retrofit Chiller', receita: 88000, lucro: 24500, date: '15/02/2024' },
            { name: 'Maint. Gerador', receita: 7200, lucro: 3800, date: '18/02/2024' },
            { name: 'Cabling Proj', receita: 18000, lucro: 7400, date: '20/02/2024' },
        ];
        setProfitData(mockProfitData);

        // 4. Stats Summary
        setStats({
            totalRevenue: 226100,
            totalProfit: 76700,
            avgProfitMargin: 33.9
        });

        // 5. Volume Mensal
        const monthlyData = [
            { name: 'Jan', os: 38, tickets: 25 },
            { name: 'Fev', os: 45, tickets: 30 },
            { name: 'Mar', os: 52, tickets: 38 },
            { name: 'Abr', os: 48, tickets: 35 },
            { name: 'Mai', os: 61, tickets: 42 },
            { name: 'Jun', os: 55, tickets: 40 },
            { name: 'Jul', os: 67, tickets: 45 },
        ];
        setSlaStats(monthlyData);

        setTimeout(() => setLoading(false), 800);
    }

    const COLORS = ['#4f46e5', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6', '#EC4899'];

    if (loading) return <ListSkeleton />;

    return (
        <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-10">
            {/* Premium Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-2 flex items-center gap-3">
                            <Award className="text-purple-500" size={32} />
                            Performance & Insights
                        </h1>
                        <p className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400">Análise detalhada de produtividade e volume operacional</p>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-full">
                        <div className="relative flex items-center justify-center">
                            <span className="absolute w-3 h-3 bg-purple-500 rounded-full animate-ping opacity-75"></span>
                            <span className="relative w-2.5 h-2.5 bg-purple-500 rounded-full"></span>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-purple-700 dark:text-purple-400">Dados em Tempo Real</span>
                    </div>
                </div>

                {/* Subtle Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent"></div>
            </div>

            {/* Premium KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {/* Total Revenue */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                            <TrendingUp size={24} className="text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20 px-2 py-1 rounded-full">Total</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Receita Total</p>
                    <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                        R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Total Profit */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-500/10 dark:to-green-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-emerald-500 rounded-xl shadow-lg">
                            <TrendingUp size={24} className="text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/20 px-2 py-1 rounded-full">Lucro</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Lucro Total</p>
                    <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                        R$ {stats.totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Profit Margin */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 border border-purple-200 dark:border-purple-500/20 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
                            <Target size={24} className="text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20 px-2 py-1 rounded-full">Margem</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Margem de Lucro</p>
                    <p className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                        {stats.avgProfitMargin.toFixed(1)}%
                    </p>
                </div>
            </div>

            {/* Premium Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Técnico Ranking */}
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                        <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                            <Users size={20} className="text-indigo-500" strokeWidth={2.5} />
                            Ranking de Técnicos
                        </h3>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full">OS Concluídas</span>
                    </div>
                    <div className="p-6 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={techPerformance} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Client Demand */}
                <div className="card dark:bg-gray-900 border-none shadow-sm overflow-hidden">
                    <div className="p-4 border-b dark:border-gray-800">
                        <h3 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            <Target size={18} className="text-rose-500" /> Volume por Cliente (Top 10)
                        </h3>
                    </div>
                    <div className="p-4 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={clientDemand}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="count"
                                >
                                    {clientDemand.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend
                                    layout="horizontal"
                                    align="center"
                                    verticalAlign="bottom"
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Performance & Revenue Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lucratividade por OS (BI Magnata) */}
                <div className="card dark:bg-gray-900 border-none shadow-sm overflow-hidden">
                    <div className="p-4 border-b dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 to-transparent">
                        <h3 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            <TrendingUp size={18} className="text-emerald-500" /> Lucratividade por OS
                        </h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Real-time Profit</span>
                    </div>
                    <div className="p-4 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={profitData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(value) => `R$${value}`} />
                                <Tooltip
                                    formatter={(value: any) => [`R$ ${value.toFixed(2)}`, 'Lucro']}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="lucro" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Crescimento Operacional */}
                <div className="card dark:bg-gray-900 border-none shadow-sm overflow-hidden">
                    <div className="p-4 border-b dark:border-gray-800">
                        <h3 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                            <TrendingUp size={18} className="text-indigo-500" /> Volume de Atendimentos
                        </h3>
                    </div>
                    <div className="p-4 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={slaStats}>
                                <defs>
                                    <linearGradient id="colorOS" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="os" stroke="#4f46e5" fillOpacity={1} fill="url(#colorOS)" strokeWidth={3} />
                                <Area type="monotone" dataKey="tickets" stroke="#10B981" fillOpacity={0} strokeWidth={3} strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Stats Grid - Métricas Reais do BI Magnata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="card dark:bg-gray-900 border-none shadow-sm p-4 md:p-6 flex flex-col items-center text-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                        <TrendingUp size={20} />
                    </div>
                    <p className="text-lg md:text-2xl font-black dark:text-gray-100 leading-tight">R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1">Faturamento Total</p>
                </div>

                <div className="card dark:bg-gray-900 border-none shadow-sm p-4 md:p-6 flex flex-col items-center text-center border-b-4 border-emerald-500">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                        <Award size={20} />
                    </div>
                    <p className="text-lg md:text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-tight">R$ {stats.totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1">Lucro Líquido</p>
                </div>

                <div className="card dark:bg-gray-900 border-none shadow-sm p-4 md:p-6 flex flex-col items-center text-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 mb-4">
                        <Target size={20} />
                    </div>
                    <p className="text-lg md:text-2xl font-black dark:text-gray-100 leading-tight">{stats.avgProfitMargin.toFixed(1)}%</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1">Margem Média</p>
                </div>

                <div className="card dark:bg-gray-900 border-none shadow-sm p-4 md:p-6 flex flex-col items-center text-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 mb-4">
                        <Clock size={20} />
                    </div>
                    <p className="text-lg md:text-2xl font-black dark:text-gray-100 leading-tight">4h 15m</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1">SLA Médio</p>
                </div>
            </div>
        </div>
    );
}
