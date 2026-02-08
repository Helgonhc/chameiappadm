'use client';

import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, User, Plus, Filter, LayoutGrid, List } from 'lucide-react';
import toast from 'react-hot-toast';

const mockEvents = [
    {
        id: 1,
        title: 'Visita Técnica Preventiva',
        client: 'Indústria Metal-X',
        address: 'Av. Industrial, 450 - São Paulo',
        time: '09:00 - 11:30',
        technician: 'Carlos Silva',
        type: 'Preventiva',
    },
    {
        id: 2,
        title: 'Reparo de Emergência',
        client: 'Logística Express',
        address: 'Rua das Cargas, 100 - Guarulhos',
        time: '13:30 - 15:00',
        technician: 'Rafael Souza',
        type: 'Corretiva',
    },
    {
        id: 3,
        title: 'Treinamento Operacional',
        client: 'Alimentos Boa Safra',
        address: 'Rod. Fernão Dias, Km 22 - Itatiba',
        time: '16:00 - 17:30',
        technician: 'Fernanda Lima',
        type: 'Treinamento',
    },
];

export default function DemoAgendaPage() {
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
                        <Calendar className="text-blue-500" size={28} />
                        Agenda Geral
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Controle central de visitas e cronogramas técnicos.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                        <button className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-blue-500"><LayoutGrid size={18} /></button>
                        <button onClick={() => handleDemoAction('Trocar Visão')} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><List size={18} /></button>
                    </div>
                    <button
                        onClick={() => handleDemoAction('Novo Agendamento')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={20} />
                        Novo Cadastro
                    </button>
                </div>
            </div>

            {/* Calendar Header */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Fevereiro 2024</h2>
                    <div className="flex gap-1">
                        <button onClick={() => handleDemoAction('Mês Anterior')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all border border-slate-200 dark:border-slate-700"><ChevronLeft size={20} className="text-slate-500" /></button>
                        <button onClick={() => handleDemoAction('Próximo Mês')} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all border border-slate-200 dark:border-slate-700"><ChevronRight size={20} className="text-slate-500" /></button>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button onClick={() => handleDemoAction('Filtrar Técnicos')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest"><User size={14} /> Todos Técnicos</button>
                    <button onClick={() => handleDemoAction('Filtrar Tipo')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest"><Filter size={14} /> Filtro</button>
                </div>
            </div>

            {/* Daily Events List */}
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Hoje</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">07</p>
                    </div>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {mockEvents.map((event) => (
                        <div key={event.id} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 p-6 rounded-2xl hover:border-blue-500/50 transition-all shadow-sm group">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${event.type === 'Corretiva' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                        event.type === 'Preventiva' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                    }`}>
                                    {event.type}
                                </div>
                                <button onClick={() => handleDemoAction(`Editar ${event.title}`)} className="text-slate-400 hover:text-blue-500 transition-colors">
                                    <Clock size={16} />
                                </button>
                            </div>
                            <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-blue-500 transition-colors">{event.title}</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                                    <Clock size={14} /> {event.time}
                                </div>
                                <div className="flex items-start gap-2 text-xs text-slate-500 font-bold">
                                    <MapPin size={14} className="mt-0.5 flex-shrink-0" /> {event.address}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-900 dark:text-slate-200 font-black pt-2 border-t border-slate-100 dark:border-slate-700/50">
                                    <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-[10px] text-blue-500">
                                        {event.technician.charAt(0)}
                                    </div>
                                    {event.technician}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Note */}
            <div className="bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex items-start gap-4">
                <div className="p-2 bg-blue-500/20 rounded-xl text-blue-500">
                    <Calendar size={24} />
                </div>
                <div>
                    <h3 className="text-blue-600 dark:text-blue-400 font-black text-sm uppercase tracking-widest mb-1">Logística de Campo Otimizada</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Visualize a carga de trabalho de toda a sua equipe em tempo real.
                        Reduza tempos de deslocamento e garanta que os técnicos certos estejam nos lugares certos com as peças certas (integrado com o Estoque).
                    </p>
                </div>
            </div>
        </div>
    );
}
