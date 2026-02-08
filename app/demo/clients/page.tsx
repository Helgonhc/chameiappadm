'use client';

import { useState, useEffect } from 'react';
import { Building2, Phone, Mail, MapPin, Plus, Search, Filter, X, Edit, Trash2, User, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const mockClients = [
    {
        id: 1,
        name: 'Condomínio Solar das Palmeiras',
        responsible_name: 'João Silva',
        phone: '(11) 98765-4321',
        email: 'contato@solar.com.br',
        address: 'Av. Paulista, 1000 - São Paulo, SP',
        type: 'PJ',
        state: 'SP',
        client_logo_url: null
    },
    {
        id: 2,
        name: 'Empresa Tech Solutions',
        responsible_name: 'Maria Santos',
        phone: '(21) 97654-3210',
        email: 'maria@techsolutions.com',
        address: 'Rua do Comércio, 500 - Rio de Janeiro, RJ',
        type: 'PJ',
        state: 'RJ',
        client_logo_url: null
    },
    {
        id: 3,
        name: 'Indústrias Exemplo S.A.',
        responsible_name: 'Pedro Costa',
        phone: '(31) 96543-2109',
        email: 'pedro@industrias.com.br',
        address: 'Rod. BR-040, Km 15 - Belo Horizonte, MG',
        type: 'PJ',
        state: 'MG',
        client_logo_url: null
    },
];

export default function DemoClientsPage() {
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons@main/flags/4x3/br.svg" className="w-8 h-6 object-cover rounded-[3px] shadow-sm" alt="Brasil" />
                        Carteira de Clientes
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{mockClients.length} clientes na rede</p>
                    </div>
                </div>
                <button
                    onClick={() => handleDemoAction('Novo Cliente')}
                    className="group bg-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>Novo Cliente</span>
                </button>
            </div>

            {/* Search and Filters Simulation */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative group/search flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within/search:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Pesquisar clientes..."
                        className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl leading-5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
                        readOnly
                        onClick={() => handleDemoAction('Busca')}
                    />
                </div>
                <button
                    onClick={() => handleDemoAction('Filtros')}
                    className="px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl font-bold text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                >
                    <Filter size={18} />
                    Filtros
                </button>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {mockClients.map((client) => (
                    <div
                        key={client.id}
                        className="relative flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-white/5 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 transition-all duration-500 overflow-hidden group"
                    >
                        <div className="h-1.5 w-full bg-indigo-500" />

                        <div className="p-5 sm:p-6 flex flex-col h-full">
                            <div className="flex items-start gap-4 mb-5">
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform duration-500 group-hover:scale-105">
                                    {client.name[0].toUpperCase()}
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <h3 className="font-bold text-slate-800 dark:text-white text-lg leading-tight uppercase tracking-tight truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {client.name}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <div className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-full flex items-center gap-1 border border-indigo-100 dark:border-indigo-500/20">
                                            <User size={10} /> {client.responsible_name}
                                        </div>
                                        <div className="px-2 py-0.5 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-mono rounded-full border border-slate-100 dark:border-white/5">
                                            {client.state}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <button onClick={() => handleDemoAction('Editar')} className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDemoAction('Excluir')} className="p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-slate-400 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 flex-1">
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600">
                                        <Phone size={14} />
                                    </div>
                                    <span className="text-sm font-medium">{client.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600">
                                        <Mail size={14} />
                                    </div>
                                    <span className="text-sm font-medium truncate">{client.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                                    <div className="p-2 bg-rose-50 dark:bg-rose-500/10 rounded-lg text-rose-500">
                                        <MapPin size={14} />
                                    </div>
                                    <span className="text-sm font-medium line-clamp-2 leading-relaxed">{client.address}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDemoAction('Ver Dashboard')}
                                className="w-full py-3 bg-slate-50 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-[2px] transition-all border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/20"
                            >
                                Acessar Dashboard do Cliente
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Demo Notice */}
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-[2rem] p-8 mt-12">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-amber-200 dark:shadow-none">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-amber-900 dark:text-amber-400 uppercase tracking-tight mb-2">Gestão de Carteira</h3>
                        <p className="text-sm font-medium text-amber-800/60 dark:text-amber-400/60 leading-relaxed">
                            No painel real, você tem acesso a relatórios de lucratividade por cliente, documentos fiscais, faturas pendentes e histórico completo de interações.
                            <strong> Simule a criação de um novo cliente acima para ver as notificações em tempo real.</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
