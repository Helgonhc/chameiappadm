'use client';

import { useState } from 'react';
import { ClipboardList, Plus, Search, Filter, Clock, CheckCircle2, AlertCircle, ArrowRight, User, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const mockOrders = [
    { id: 'OS-8821', type: 'Preventiva', client: 'Condomínio Solar', representative: 'Carlos Eduardo', equip: 'Ar Condicionado #04', priority: 'Média', status: 'Em triagem' },
    { id: 'OS-8819', type: 'Corretiva', client: 'Indústrias Metal-X', representative: 'Rafael Souza', equip: 'Gerador Principal', priority: 'Urgente', status: 'Em execução' },
    { id: 'OS-8815', type: 'Instalação', client: 'Shopping Center', representative: 'Ana Silva', equip: 'Sistema de Câmeras', priority: 'Baixa', status: 'Finalizado' },
    { id: 'OS-8798', type: 'Corretiva', client: 'Hospital Santa Maria', representative: 'Marcos Lima', equip: 'Chiller Central', priority: 'Alta', status: 'Aguardando Peças' },
];

export default function DemoOrdersPage() {
    const [search, setSearch] = useState('');

    const handleDemoAction = (action: string) => {
        toast(`🔒 "${action}" desabilitado no modo demonstração`, {
            icon: 'ℹ️',
            duration: 2000,
        });
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                        Ordens de Serviço <span className="text-indigo-600 text-sm font-black opacity-50 uppercase tracking-widest">Demo</span>
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">Gestão de manutenções e chamados técnicos</p>
                </div>
                <button
                    onClick={() => handleDemoAction('Nova O.S')}
                    className="btn bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95"
                >
                    <Plus size={20} />
                    Nova OS
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Abertas', value: 42, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Urgentes', value: 5, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Vencendo', value: 12, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Concluídas', value: 184, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por O.S, cliente ou técnico..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                    />
                </div>
                <button
                    onClick={() => handleDemoAction('Filtrar')}
                    className="bg-white border border-gray-100 px-4 py-3 rounded-2xl text-xs font-bold text-gray-500 flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
                >
                    <Filter size={18} /> Filtrar
                </button>
            </div>

            {/* List */}
            <div className="space-y-4">
                {mockOrders.map((os) => (
                    <div key={os.id} className="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group flex flex-col md:flex-row md:items-center gap-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex items-center gap-4 flex-1">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 ${os.status === 'Finalizado' ? 'bg-emerald-500 shadow-emerald-100' :
                                os.status === 'Em execução' ? 'bg-blue-500 shadow-blue-100' :
                                    'bg-indigo-600 shadow-indigo-100'
                                }`}>
                                <ClipboardList size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{os.id}</span>
                                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${os.priority === 'Urgente' ? 'bg-red-50 text-red-600 border-red-100' :
                                        os.priority === 'Alta' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                            'bg-gray-50 text-gray-400 border-gray-100'
                                        }`}>
                                        {os.priority}
                                    </span>
                                </div>
                                <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight truncate">{os.client}</h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                        <User size={12} className="text-indigo-400" />
                                        <span className="text-[10px] font-bold uppercase">{os.representative}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                        <MapPin size={12} />
                                        <span className="text-[10px] font-bold uppercase truncate max-w-[150px]">{os.equip}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between md:flex-col md:items-end gap-3 md:pl-6 md:border-l md:border-gray-50">
                            <div className="flex flex-col items-end">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Status</p>
                                <div className="flex items-center gap-1.5 text-gray-600">
                                    <Clock size={12} className="text-indigo-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{os.status}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDemoAction(`Gerenciar ${os.id}`)}
                                className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors"
                            >
                                Detalhes <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Strategic Banner */}
            <div className="bg-indigo-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20 group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -mr-40 -mt-40 group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                            <Clock size={24} />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter">O.S Inteligente em Minutos</h2>
                    </div>
                    <p className="text-indigo-100 text-sm font-medium leading-relaxed max-w-xl mb-8">
                        Reduza o tempo de atendimento em até 40%. Gere ordens de serviço automatizadas, acompanhe o deslocamento técnico e colha assinaturas digitais direto no celular. Simples, rápido e eficiente.
                    </p>
                    <button
                        onClick={() => handleDemoAction('Explorar O.S Digital')}
                        className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[2px] transition-all hover:bg-indigo-50 active:scale-95 shadow-xl"
                    >
                        Criar O.S Digital
                    </button>
                </div>
            </div>
        </div>
    );
}
