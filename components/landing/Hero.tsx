'use client';

import { ShieldCheck } from 'lucide-react';

interface HeroProps {
    setShowDemoModal: (show: boolean) => void;
    scrollToSection: (id: string) => void;
}

export function Hero({ setShowDemoModal, scrollToSection }: HeroProps) {
    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20 overflow-hidden scroll-mt-20">
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30" />
            <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    Sistema Completo de Gestão
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight">
                    Gestão Profissional
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-blue-500">
                        para sua Empresa
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                    Plataforma completa para <span className="text-white font-bold">gerenciar ordens de serviço</span>,
                    controlar equipamentos e <span className="text-emerald-400 font-bold">organizar sua operação</span>
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button
                        onClick={() => setShowDemoModal(true)}
                        className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/60 hover:scale-105 transition-all flex items-center gap-3"
                    >
                        Começar Teste Grátis
                        <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                    <button
                        onClick={() => scrollToSection('recursos')}
                        className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
                    >
                        Ver Recursos
                    </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        <span>Sem cartão de crédito</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        <span>Setup rápido</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        <span>Suporte em português</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
