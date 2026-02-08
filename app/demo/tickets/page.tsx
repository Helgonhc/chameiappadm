'use client';

import { Ticket, Plus, Search, Filter, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const mockTickets = [
    {
        id: 'TKT-2024-001',
        title: 'Vazamento no painel frontal - Injetora HAITI',
        client: 'Indústrias Metal-X',
        priority: 'Alta',
        status: 'Em Atendimento',
        assignedTo: 'Carlos Técnico',
        createdAt: '2024-02-06T10:00:00Z',
    },
    {
        id: 'TKT-2024-002',
        title: 'Calibração anual balança industrial',
        client: 'Logística Express',
        priority: 'Média',
        status: 'Aberto',
        assignedTo: 'Aguardando',
        createdAt: '2024-02-07T08:30:00Z',
    },
    {
        id: 'TKT-2024-003',
        title: 'Erro de software no CLP Siemens',
        client: 'Alimentos Boa Safra',
        priority: 'Crítica',
        status: 'Aberto',
        assignedTo: 'Aguardando',
        createdAt: '2024-02-07T09:15:00Z',
    },
    {
        id: 'TKT-2024-004',
        title: 'Troca de sensores de presença',
        client: 'Supermercado Central',
        priority: 'Baixa',
        status: 'Concluído',
        assignedTo: 'Rafael Silva',
        createdAt: '2024-02-05T14:20:00Z',
    },
];

export default function DemoTicketsPage() {
    const handleDemoAction = (action: string) => {
        toast(`🔒 "${action}" desabilitado no modo demonstração`, {
            icon: 'ℹ️',
            duration: 2000,
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Crítica': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'Alta': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'Média': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Em Atendimento': return <MessageSquare size={14} className="text-blue-500" />;
            case 'Concluído': return <CheckCircle size={14} className="text-emerald-500" />;
            default: return <Clock size={14} className="text-amber-500" />;
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        <Ticket className="text-blue-500" size={28} />
                        Chamados de Suporte
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Atendimento ao cliente e suporte técnico.</p>
                </div>
                <button
                    onClick={() => handleDemoAction('Novo Chamado')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                    <Plus size={20} />
                    Abrir Chamado
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[300px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por ID, Cliente ou Título..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white"
                        readOnly
                    />
                </div>
                <button
                    onClick={() => handleDemoAction('Filtrar')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                    <Filter size={18} />
                    Filtros
                </button>
            </div>

            {/* Tickets Table/List */}
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">ID / Data</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Chamado / Cliente</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Atribuído</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                            {mockTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                                    <td className="px-6 py-5">
                                        <div className="font-black text-slate-900 dark:text-white text-sm">{ticket.id}</div>
                                        <div className="text-[10px] text-slate-400 mt-1">{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black border ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority.toUpperCase()}
                                                </span>
                                                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm line-clamp-1">
                                                    {ticket.title}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1.5 italic">
                                                {ticket.client}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ${ticket.status === 'Concluído' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    ticket.status === 'Em Atendimento' ? 'bg-blue-500/10 text-blue-500' :
                                                        'bg-amber-500/10 text-amber-500'
                                                }`}>
                                                {getStatusIcon(ticket.status)}
                                                {ticket.status.toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-1 pl-1">
                                            Resp: {ticket.assignedTo}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button
                                            onClick={() => handleDemoAction(`Acessar ${ticket.id}`)}
                                            className="px-4 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-black uppercase hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                        >
                                            Detalhes
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Demo Notice */}
            <div className="bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex items-start gap-4">
                <div className="p-2 bg-blue-500/20 rounded-xl text-blue-500">
                    <Ticket size={24} />
                </div>
                <div>
                    <h3 className="text-blue-600 dark:text-blue-400 font-black text-sm uppercase tracking-widest mb-1">Central de Atendimento</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Este módulo centraliza todas as solicitações de suporte, dúvidas técnicas e reclamações.
                        No sistema real, você poderá configurar SLAs, workflows de aprovação e chat direto com o cliente.
                    </p>
                </div>
            </div>
        </div>
    );
}
