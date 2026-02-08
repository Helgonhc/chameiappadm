'use client';

import { Zap, ShieldCheck, Smartphone, Database, Wrench, Building2, LayoutDashboard, Users } from 'lucide-react';

export function Segments() {
    const segments = [
        { t: 'Climatização & HVAC', d: 'Manutenção preventiva (PMOC) e corretiva de sistemas centrais.', i: <Zap size={24} /> },
        { t: 'Elétrica & Fotovoltaica', d: 'Projetos, instalações de usinas solares e baixa/média tensão.', i: <ShieldCheck size={24} /> },
        { t: 'Segurança Eletrônica', d: 'Monitoramento 24h, CFTV, alarmes e controle de acesso.', i: <Smartphone size={24} /> },
        { t: 'TI & Data Centers', d: 'Infraestrutura de redes, servidores e cabeamento estruturado.', i: <Database size={24} /> },
        { t: 'Hidráulica Industrial', d: 'Gestão de redes de incêndio, bombas e saneamento.', i: <Wrench size={24} /> },
        { t: 'Manutenção de Elevadores', d: 'Controle rigoroso de chamados de emergência e revisões.', i: <Building2 size={24} /> },
        { t: 'Refrigeração Comercial', d: 'Câmaras frias, balcões e logística de cadeia de frio.', i: <LayoutDashboard size={24} /> },
        { t: 'Facilities & Limpeza', d: 'Gestão de equipes volantes para manutenção predial geral.', i: <Users size={24} /> },
    ];

    return (
        <section id="segmentos" className="py-20 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12 space-y-3">
                    <h2 className="text-3xl md:text-5xl font-bold text-white">
                        Soluções para <span className="text-emerald-400">cada segmento</span>
                    </h2>
                    <p className="text-base text-slate-400 max-w-2xl mx-auto">
                        Atendemos empresas de todos os portes
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {segments.map((s, i) => (
                        <div
                            key={i}
                            className="group p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all cursor-pointer"
                        >
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                {s.i}
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{s.t}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{s.d}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
