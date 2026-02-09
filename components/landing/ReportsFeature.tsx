'use client';

import { FileText, Zap, Shield, Search } from 'lucide-react';

export function ReportsFeature() {
    const categories = [
        {
            title: 'Elétrica & Inspeção',
            items: ['Termografia Infravermelha', 'Cabine Primária', 'Laudo de SPDA'],
            color: 'from-blue-500 to-indigo-600'
        },
        {
            title: 'Climatização',
            items: ['PMOC (Lei 13.589/18)', 'Manutenção de HVAC', 'Qualidade do Ar'],
            color: 'from-emerald-500 to-teal-600'
        },
        {
            title: 'Gestão Técnica',
            items: ['Parecer de Engenharia', 'Coleta de Óleo', 'Quadros Elétricos'],
            color: 'from-orange-500 to-amber-600'
        }
    ];

    return (
        <section id="relatorios" className="py-24 relative overflow-hidden bg-[#020617]">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Text Content */}
                    <div className="lg:w-1/2 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                            <Zap size={14} />
                            Diferencial Exclusivo
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                            Geradores de <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                                Relatórios Técnicos
                            </span>
                        </h2>

                        <p className="text-xl text-slate-400 leading-relaxed">
                            O único sistema que já vem com inteligência de campo. Gere laudos, pareceres e checklists profissionais em questão de segundos, totalmente integrados.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">PDF Profissional</h4>
                                    <p className="text-sm text-slate-500">Layouts premium prontos para entrega ao cliente.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-1">Conformidade</h4>
                                    <p className="text-sm text-slate-500">Baseado em normas técnicas (NR-10, NBR-5419).</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Visual Display */}
                    <div className="lg:w-1/2 w-full">
                        <div className="grid grid-cols-1 gap-4">
                            {categories.map((cat, i) => (
                                <div
                                    key={i}
                                    className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-default"
                                >
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-white">{cat.title}</h3>
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {cat.items.map((item, j) => (
                                            <span
                                                key={j}
                                                className="px-3 py-1 rounded-md bg-white/5 border border-white/5 text-[11px] font-bold text-slate-400 group-hover:text-slate-200 transition-colors"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
