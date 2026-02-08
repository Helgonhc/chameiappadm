'use client';

import { useState } from 'react';
import { Bell, Info, AlertCircle, CheckCircle2, Search, Filter, Trash2, Check, Clock, User, ClipboardList, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const mockNotifications = [
    {
        id: 1,
        type: 'alert',
        title: 'Manutenção Vencida',
        message: 'O equipamento "Ar Condicionado Central #02" do cliente "Hospital Santa Maria" está com a manutenção vencida há 5 dias.',
        time: 'há 10 minutos',
        read: false,
        icon: <AlertCircle className="text-red-500" />
    },
    {
        id: 2,
        type: 'success',
        title: 'O.S. Finalizada',
        message: 'O técnico Carlos Eduardo finalizou a O.S. #8821 com sucesso.',
        time: 'há 1 hora',
        read: false,
        icon: <CheckCircle2 className="text-emerald-500" />
    },
    {
        id: 3,
        type: 'info',
        title: 'Novo Ticket',
        message: 'Um novo ticket de suporte foi aberto por "Indústrias Metal-X".',
        time: 'há 3 horas',
        read: true,
        icon: <Info className="text-blue-500" />
    },
    {
        id: 4,
        type: 'update',
        title: 'Atualização de Sistema',
        message: 'Novas funcionalidades de telemetria foram liberadas para sua conta.',
        time: 'há 1 dia',
        read: true,
        icon: <Zap className="text-indigo-500" />
    },
];

export default function DemoNotificationsPage() {
    const [filter, setFilter] = useState('all');

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
                        Central de Notificações <span className="text-indigo-600 text-sm font-black opacity-50 uppercase tracking-widest">Demo</span>
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">Fique por dentro das atualizações da sua operação em tempo real</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleDemoAction('Marcar todas como lidas')}
                        className="btn bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
                    >
                        <Check size={16} /> Marcar todas
                    </button>
                    <button
                        onClick={() => handleDemoAction('Limpar tudo')}
                        className="btn bg-white border border-gray-100 text-red-500 hover:bg-red-50 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
                    >
                        <Trash2 size={16} /> Limpar
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Não Lidas', value: 2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Alertas', value: 1, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'O.S. Prontas', value: 12, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Total Hoje', value: 24, color: 'text-slate-600', bg: 'bg-slate-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex gap-2 p-1 bg-white border border-gray-100 rounded-2xl w-fit shadow-sm overflow-x-auto max-w-full">
                {['all', 'unread', 'alerts', 'system'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-400 hover:bg-gray-50'
                            }`}
                    >
                        {f === 'all' ? 'Todas' : f === 'unread' ? 'Não Lidas' : f === 'alerts' ? 'Alertas' : 'Sistema'}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                {mockNotifications.map((notif) => (
                    <div key={notif.id} className={`p-6 flex items-start gap-4 transition-all group hover:bg-gray-50/50 relative overflow-hidden ${!notif.read ? 'bg-indigo-50/10' : ''}`}>
                        {!notif.read && <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>}

                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${notif.type === 'alert' ? 'bg-red-50 border border-red-100' :
                                notif.type === 'success' ? 'bg-emerald-50 border border-emerald-100' :
                                    notif.type === 'info' ? 'bg-blue-50 border border-blue-100' :
                                        'bg-indigo-50 border border-indigo-100'
                            }`}>
                            {notif.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-4 mb-1">
                                <h3 className={`text-sm font-black uppercase tracking-tight ${!notif.read ? 'text-gray-800' : 'text-gray-500'}`}>
                                    {notif.title}
                                </h3>
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest whitespace-nowrap">
                                    {notif.time}
                                </span>
                            </div>
                            <p className={`text-sm leading-relaxed ${!notif.read ? 'text-gray-600' : 'text-gray-400'}`}>
                                {notif.message}
                            </p>

                            <div className="flex items-center gap-4 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDemoAction('Ver detalhes')}
                                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-widest"
                                >
                                    Ver Detalhes
                                </button>
                                {!notif.read && (
                                    <button
                                        onClick={() => handleDemoAction('Marcar como lida')}
                                        className="text-[10px] font-bold text-gray-400 hover:text-indigo-600 uppercase tracking-widest"
                                    >
                                        Lida
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Intelligence Section */}
            <div className="bg-indigo-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20 group">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -mr-40 -mt-40 group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 shrink-0">
                        <Bell size={32} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Monitoramento Inteligente</h2>
                        <p className="text-indigo-100/70 text-sm font-medium leading-relaxed max-w-lg">
                            Nosso sistema envia alertas automáticos via WhatsApp e E-mail sempre que uma manutenção vence ou um chamado crítico é aberto. Nunca mais perca um prazo importante.
                        </p>
                    </div>
                    <button
                        onClick={() => handleDemoAction('Configurar Canais')}
                        className="bg-white text-indigo-900 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[2px] hover:bg-indigo-50 transition-all active:scale-95 shadow-xl"
                    >
                        Configurar Alertas
                    </button>
                </div>
            </div>
        </div>
    );
}
