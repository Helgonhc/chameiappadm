'use client';

import { useState } from 'react';
import {
    Users, Search, Filter, MoreHorizontal, MessageCircle, Zap, Clock,
    CheckCircle2, Plus, TrendingUp, Phone, Mail, ArrowRight, LayoutGrid, List
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_LEADS = [
    {
        id: 'L-001',
        name: 'Roberto Almeida',
        company: 'Construtora Almeida',
        role: 'Diretor de Obras',
        status: 'new', // new, contact, qualified, converted, lost
        source: 'Instagram',
        interest: 'Gestão de Obras',
        avatar_color: 'bg-blue-500',
        whatsapp: '(11) 98765-4321',
        email: 'roberto@almeida.com.br',
        created_at: '2026-02-07T10:00:00',
        probability: 'high'
    },
    {
        id: 'L-002',
        name: 'Fernanda Costa',
        company: 'Clínica Saúde+',
        role: 'Gerente Administrativa',
        status: 'contact',
        source: 'Google Ads',
        interest: 'Agendamento Online',
        avatar_color: 'bg-emerald-500',
        whatsapp: '(21) 99999-8888',
        email: 'fernanda@saudemais.com.br',
        created_at: '2026-02-06T15:30:00',
        probability: 'medium'
    },
    {
        id: 'L-003',
        name: 'Carlos Oliveira',
        company: 'Restaurante Sabor & Arte',
        role: 'Proprietário',
        status: 'qualified',
        source: 'Indicação',
        interest: 'Cardápio Digital',
        avatar_color: 'bg-orange-500',
        whatsapp: '(31) 97777-6666',
        email: 'carlos@saborarte.com.br',
        created_at: '2026-02-05T09:15:00',
        probability: 'high'
    },
    {
        id: 'L-004',
        name: 'Juliana Santos',
        company: 'Academia FitLife',
        role: 'Coordenadora',
        status: 'new',
        source: 'Facebook',
        interest: 'Gestão de Alunos',
        avatar_color: 'bg-purple-500',
        whatsapp: '(41) 95555-4444',
        email: 'juliana@fitlife.com',
        created_at: '2026-02-07T11:45:00',
        probability: 'low'
    },
    {
        id: 'L-005',
        name: 'Ricardo Mendes',
        company: 'Mendes Advocacia',
        role: 'Sócio',
        status: 'converted',
        source: 'Linkedin',
        interest: 'CRM Jurídico',
        avatar_color: 'bg-indigo-500',
        whatsapp: '(51) 93333-2222',
        email: 'ricardo@mendes.adv.br',
        created_at: '2026-02-01T14:20:00',
        probability: 'won'
    },
    {
        id: 'L-006',
        name: 'Ana Pereira',
        company: 'Estética Bella',
        role: 'Dona',
        status: 'lost',
        source: 'Instagram',
        interest: 'Agendamento',
        avatar_color: 'bg-pink-500',
        whatsapp: '(61) 91111-0000',
        email: 'ana@bella.com',
        created_at: '2026-01-28T16:00:00',
        probability: 'lost'
    }
];

const STAGES = [
    { id: 'new', label: 'Novos', color: 'bg-blue-50 text-blue-700 border-blue-100', dot: 'bg-blue-500' },
    { id: 'contact', label: 'Em Contato', color: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' },
    { id: 'qualified', label: 'Qualificado', color: 'bg-indigo-50 text-indigo-700 border-indigo-100', dot: 'bg-indigo-500' },
    { id: 'converted', label: 'Convertido', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' },
    { id: 'lost', label: 'Perdido', color: 'bg-slate-50 text-slate-600 border-slate-100', dot: 'bg-slate-400' }
];

export default function LeadsPage() {
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [searchTerm, setSearchTerm] = useState('');
    const [leads, setLeads] = useState(MOCK_LEADS);

    // Helpers
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // KPIs
    const totalLeads = leads.length;
    const newLeadsToday = leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length;
    const conversionRate = Math.round((leads.filter(l => l.status === 'converted').length / totalLeads) * 100) || 0;

    return (
        <div className="space-y-8 animate-fadeIn pb-24 max-w-[1600px] mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase flex items-center gap-3">
                        <Zap className="text-amber-500 fill-amber-500" /> Gestão de Leads
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                        Centralize e gerencie seus potenciais clientes em um só lugar.
                    </p>
                </div>

                <div className="flex gap-3">
                    <div className="bg-white border border-slate-200 rounded-xl p-1 flex shadow-sm">
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-bold ${viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <LayoutGrid size={16} /> Kanban
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-bold ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <List size={16} /> Lista
                        </button>
                    </div>
                    <button className="btn btn-primary px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-200/50 flex items-center gap-2">
                        <Plus size={20} /> <span className="hidden sm:inline">Novo Lead</span>
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card border-none bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Users size={80} />
                    </div>
                    <p className="text-indigo-100 font-bold uppercase text-xs tracking-widest mb-1">Total de Leads</p>
                    <h3 className="text-4xl font-black tracking-tight">{totalLeads}</h3>
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                        <TrendingUp size={14} /> +15% esse mês
                    </div>
                </div>

                <div className="card border-none bg-white shadow-sm p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Zap size={80} />
                    </div>
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-1">Novos Hoje</p>
                    <h3 className="text-4xl font-black text-slate-800 tracking-tight">{newLeadsToday}</h3>
                    <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600 font-bold">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        Atividade recente
                    </div>
                </div>

                <div className="card border-none bg-white shadow-sm p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <CheckCircle2 size={80} />
                    </div>
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-1">Taxa de Conversão</p>
                    <h3 className="text-4xl font-black text-slate-800 tracking-tight">{conversionRate}%</h3>
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 font-medium">
                        Meta: <span className="text-slate-800 font-bold">20%</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 group relative">
                    <div className="flex items-center w-full px-4 py-3 border border-gray-200 rounded-xl bg-white transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 shadow-sm">
                        <Search className="text-gray-400 group-hover:text-indigo-500 transition-colors mr-3" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nome, empresa ou telefone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 font-medium"
                        />
                    </div>
                </div>
                <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
                    <Filter size={18} /> Filtros
                </button>
            </div>

            {/* View Content */}
            {viewMode === 'kanban' ? (
                <div className="flex gap-6 overflow-x-auto pb-8 snap-x item-start min-h-[500px]">
                    {STAGES.map(stage => {
                        const stageLeads = filteredLeads.filter(l => l.status === stage.id);
                        return (
                            <div key={stage.id} className="min-w-[320px] max-w-[320px] flex flex-col snap-center shrink-0">
                                {/* Column Header */}
                                <div className={`mb-4 p-4 rounded-xl border ${stage.color} flex justify-between items-center shadow-sm backdrop-blur-sm bg-white/50`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${stage.dot} shadow-sm ring-2 ring-white`}></div>
                                        <span className="font-black text-sm uppercase tracking-wide">{stage.label}</span>
                                    </div>
                                    <span className="bg-white px-2.5 py-1 rounded-lg text-xs font-black shadow-sm border border-slate-100">
                                        {stageLeads.length}
                                    </span>
                                </div>

                                {/* Cards */}
                                <div className="flex flex-col gap-4">
                                    {stageLeads.map(lead => (
                                        <div
                                            key={lead.id}
                                            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:translate-y-[-2px] hover:border-indigo-200 transition-all cursor-pointer group relative overflow-hidden"
                                        >
                                            <div className="absolute top-0 left-0 w-1 h-full bg-slate-100 group-hover:bg-indigo-500 transition-colors"></div>

                                            <div className="flex justify-between items-start mb-3 pl-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full ${lead.avatar_color} text-white flex items-center justify-center text-sm font-bold shadow-sm`}>
                                                        {getInitials(lead.name)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-indigo-600 transition-colors">{lead.name}</h4>
                                                        <p className="text-xs text-slate-500 font-medium truncate max-w-[140px]">{lead.company}</p>
                                                    </div>
                                                </div>
                                                <button className="text-slate-300 hover:text-slate-600 transition-colors">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </div>

                                            <div className="pl-3 space-y-2 mb-4">
                                                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                                    <MessageCircle size={14} className="text-emerald-500" />
                                                    {lead.whatsapp}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                                    <span className="text-slate-400">Interesse:</span>
                                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{lead.interest}</span>
                                                </div>
                                            </div>

                                            <div className="pl-3 mt-4 pt-3 border-t border-slate-50 flex justify-between items-center">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{lead.source}</span>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors" title="WhatsApp">
                                                        <MessageCircle size={14} />
                                                    </button>
                                                    <button className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors" title="Detalhes">
                                                        <ArrowRight size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-bold text-slate-500">
                            <tr>
                                <th className="px-6 py-4">Lead</th>
                                <th className="px-6 py-4">Contato</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Origem / Interesse</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredLeads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full ${lead.avatar_color} text-white flex items-center justify-center text-sm font-bold`}>
                                                {getInitials(lead.name)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{lead.name}</h4>
                                                <p className="text-xs text-slate-500">{lead.role} na {lead.company}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs font-medium">
                                                <Phone size={12} className="text-slate-400" /> {lead.whatsapp}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                                <Mail size={12} className="text-slate-400" /> {lead.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${STAGES.find(s => s.id === lead.status)?.color
                                            }`}>
                                            {STAGES.find(s => s.id === lead.status)?.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-700">{lead.source}</p>
                                            <p className="text-xs text-slate-500 bg-slate-100 w-fit px-2 py-0.5 rounded">{lead.interest}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                <MessageCircle size={18} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
