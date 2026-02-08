'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, Check, X, MessageCircle, Send, Edit, Trash2, CalendarClock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const mockRequests = [
    {
        id: '1',
        request_number: 'REQ-2024-001',
        title: 'Manutenção Preventiva de Ar Condicionado',
        description: 'Limpeza de filtros e verificação do dreno no andar superior.',
        client_name: 'Condomínio Solar das Palmeiras',
        requester_name: 'João Silva',
        suggested_date: '2024-02-15',
        suggested_time_period: 'manha',
        status: 'pendente',
        created_at: '2024-02-05T10:00:00'
    },
    {
        id: '2',
        request_number: 'REQ-2024-002',
        title: 'Reparo de Cerca Elétrica',
        description: 'Vários pontos da cerca estão sem tensão.',
        client_name: 'Residencial Bela Vista',
        requester_name: 'Maria Santos',
        suggested_date: '2024-02-16',
        suggested_time_period: 'tarde',
        status: 'confirmado',
        confirmed_date: '2024-02-16',
        created_at: '2024-02-06T14:30:00'
    },
];

export default function DemoMaintenanceRequestsPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 300);
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
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fadeIn pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                        <CalendarClock className="text-emerald-500" />
                        Solicitações de Manutenção
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Gerencie as solicitações enviadas pelos clientes</p>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Pendentes', count: 1, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-500/10' },
                    { label: 'Confirmadas', count: 1, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-500/10' },
                    { label: 'Atrasadas', count: 0, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-500/10' },
                    { label: 'Total', count: 2, color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <div className="flex items-center gap-2">
                            <span className={`text-2xl font-black ${stat.color}`}>{stat.count}</span>
                            <div className={`w-2 h-2 rounded-full ${stat.color === 'text-emerald-600' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Requests List */}
            <div className="space-y-4">
                {mockRequests.map((request) => (
                    <div
                        key={request.id}
                        className={`bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-500 border-l-4 ${request.status === 'pendente' ? 'border-l-amber-500' : 'border-l-emerald-500'
                            }`}
                    >
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 tracking-tighter">{request.request_number}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${request.status === 'pendente' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                                        }`}>
                                        {request.status === 'pendente' ? 'Aguardando' : 'Confirmada'}
                                    </span>
                                </div>

                                <h3 className="text-lg font-black text-gray-800 dark:text-white uppercase mb-2 group-hover:text-indigo-600 transition-colors tracking-tight">
                                    {request.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 leading-relaxed font-medium">
                                    {request.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-4 text-xs">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-bold">
                                        <div className="p-1.5 bg-slate-100 dark:bg-white/5 rounded-lg">
                                            <User size={14} className="text-slate-500" />
                                        </div>
                                        {request.client_name}
                                    </div>
                                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                                        <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                                            <Calendar size={14} />
                                        </div>
                                        {new Date(request.suggested_date + 'T12:00:00').toLocaleDateString('pt-BR')}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 lg:w-48">
                                <button
                                    onClick={() => handleDemoAction('Responder Solicitação')}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <Check size={16} /> Responder
                                </button>
                                <button
                                    onClick={() => handleDemoAction('WhatsApp Cliente')}
                                    className="px-6 py-3 bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-emerald-100 dark:shadow-none hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <MessageCircle size={16} /> WhatsApp
                                </button>
                                <div className="flex gap-2">
                                    <button onClick={() => handleDemoAction('Editar')} className="flex-1 p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-400 hover:text-indigo-600 transition-colors flex justify-center border border-transparent hover:border-indigo-100">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDemoAction('Excluir')} className="flex-1 p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-400 hover:text-red-600 transition-colors flex justify-center border border-transparent hover:border-red-100">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pro Tips Section */}
            <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-[3rem] p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200/20 dark:bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-indigo-200 dark:shadow-none shrink-0">
                        <AlertTriangle size={32} />
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-black text-indigo-900 dark:text-indigo-400 uppercase tracking-tighter mb-2">Agilidade no Atendimento</h3>
                        <p className="text-indigo-800/60 dark:text-indigo-400/60 text-sm font-medium leading-relaxed max-w-xl">
                            Solicitações convertidas em menos de 2 horas aumentam o nível de satisfação (NPS) do cliente em até 40%.
                            <strong> Use o botão "Responder" para sugerir novas datas ou confirmar o atendimento instantaneamente.</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
