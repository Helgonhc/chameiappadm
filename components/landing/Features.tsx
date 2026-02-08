'use client';

import {
    LayoutDashboard, Users, Wrench, ClipboardList,
    Ticket, Calculator, Calendar, Clock, Package,
    MessageSquare, Bell, Settings
} from 'lucide-react';

export function Features() {
    const modules = [
        { icon: <LayoutDashboard size={20} />, n: 'Dashboard', d: 'Visão geral do sistema' },
        { icon: <Users size={20} />, n: 'Clientes', d: 'Gestão completa da base' },
        { icon: <Wrench size={20} />, n: 'Equipamentos', d: 'Controle com QR Code' },
        { icon: <ClipboardList size={20} />, n: 'Ordens de Serviço', d: 'Criação e acompanhamento' },
        { icon: <Ticket size={20} />, n: 'Chamados', d: 'Sistema de tickets agéis' },
        { icon: <Calculator size={20} />, n: 'Orçamentos', d: 'Criação e envio rápido' },
        { icon: <Calendar size={20} />, n: 'Agenda', d: 'Calendário sincronizado' },
        { icon: <Clock size={20} />, n: 'Banco de Horas', d: 'Controle de produtividade' },
        { icon: <Package size={20} />, n: 'Estoque', d: 'Gestão de materiais' },
        { icon: <MessageSquare size={20} />, n: 'Chat', d: 'Comunicação interna' },
        { icon: <Bell size={20} />, n: 'Notificações', d: 'Central de alertas' },
        { icon: <Settings size={20} />, n: 'Gestão', d: 'Usuários e permissões' },
    ];

    return (
        <section id="recursos" className="py-24 relative scroll-mt-20 bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black text-white">
                        Tudo que você precisa
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500"> em um só lugar</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Recursos completos para transformar sua gestão operacional
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {modules.map((m, i) => (
                        <div
                            key={i}
                            className="group p-6 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 transition-all hover:-translate-y-2 cursor-pointer"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 rounded-xl flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                {m.icon}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{m.n}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{m.d}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
