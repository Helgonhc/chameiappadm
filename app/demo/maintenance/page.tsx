'use client';

import { Calendar, Plus, Clock, Tooltip, CheckCircle, AlertTriangle, ShieldCheck, Settings, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const mockMaintenance = [
    {
        id: 'PM-001',
        equipment: 'Compressor Atlas Copco GA37',
        client: 'Manufatura Sul S.A.',
        type: 'Preventiva',
        period: 'Trimestral',
        nextDate: '2024-02-15',
        status: 'Agendado',
    },
    {
        id: 'PM-002',
        equipment: 'Ponte Rolante 10T',
        client: 'Siderurgia Norte',
        type: 'Preditiva',
        period: 'Semestral',
        nextDate: '2024-02-10',
        status: 'Em Atraso',
    },
    {
        id: 'PM-003',
        equipment: 'Gerador STEMAC 500kVA',
        client: 'Hospital Vida',
        type: 'Preventiva',
        period: 'Mensal',
        nextDate: '2024-02-28',
        status: 'No Prazo',
    },
    {
        id: 'PM-004',
        equipment: 'Elevador Industrial Otis',
        client: 'Armazéns Gerais',
        type: 'Segurança',
        period: 'Anual',
        nextDate: '2024-03-05',
        status: 'No Prazo',
    },
];

export default function DemoMaintenancePage() {
    const handleDemoAction = (action: string) => {
        toast(`🔒 "${action}" desabilitado no modo demonstração`, {
            icon: 'ℹ️',
            duration: 2000,
        });
    };

    return (
        <div className="space-y-6 animate-fadeIn p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        <Calendar className="text-purple-500" size={28} />
                        Plano de Manutenção
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Cronograma de preventivas e preditivas recorrentes.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleDemoAction('Configurar Recorrência')}
                        className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                    >
                        <Settings size={20} />
                    </button>
                    <button
                        onClick={() => handleDemoAction('Novo Plano')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20"
                    >
                        <Plus size={20} />
                        Novo Cronograma
                    </button>
                </div>
            </div>

            {/* Calendar Strip (Visual Mock) */}
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 p-4 rounded-2xl flex items-center justify-between gap-2 overflow-x-auto shadow-sm">
                {[...Array(7)].map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const isToday = i === 0;
                    return (
                        <div key={i} className={`flex-1 min-w-[80px] flex flex-col items-center p-3 rounded-xl transition-all ${isToday ? 'bg-purple-500 text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-white/80' : 'text-slate-400'}`}>
                                {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                            </span>
                            <span className="text-lg font-black">{date.getDate()}</span>
                            {isToday && <div className="w-1.5 h-1.5 bg-white rounded-full mt-1 animate-pulse" />}
                        </div>
                    );
                })}
            </div>

            {/* Maintenance List */}
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <h2 className="text-xs font-black uppercase tracking-[2px] text-slate-500">Cronograma Ativo</h2>
                    <Search size={16} className="text-slate-400" />
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
                    {mockMaintenance.map((item) => (
                        <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${item.status === 'Em Atraso' ? 'bg-red-500/10 text-red-500' :
                                        item.status === 'Agendado' ? 'bg-purple-500/10 text-purple-500' :
                                            'bg-emerald-500/10 text-emerald-500'
                                    }`}>
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors uppercase tracking-tight">{item.equipment}</h4>
                                    <p className="text-xs text-slate-500 font-bold">{item.client}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="flex items-center gap-1 text-[10px] font-black uppercase text-purple-400 tracking-wider">
                                            <ShieldCheck size={12} /> {item.type}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                                            {item.period}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-100 dark:border-slate-700/50 pt-4 md:pt-0">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Próxima Visita</p>
                                    <p className={`text-sm font-black ${item.status === 'Em Atraso' ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                                        {new Date(item.nextDate).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDemoAction(`Acessar cronograma ${item.id}`)}
                                    className="p-2.5 bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 rounded-xl transition-all"
                                >
                                    <CheckCircle size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Strategic Note */}
            <div className="bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-500/20 rounded-xl text-purple-500">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <h3 className="text-purple-600 dark:text-purple-400 font-black text-sm uppercase tracking-widest mb-1">Manutenção Inteligente</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Elimine planilhas e processos manuais. O sistema gera as ordens de serviço preventivas automaticamente com base na periodicidade,
                            evitando falhas catastróficas e aumentando a vida útil dos ativos dos seus clientes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
