'use client';

import { Check, Gift } from 'lucide-react';

interface PricingProps {
    onSelectPlan: (plan: string) => void;
    handleWhatsAppClick: (message?: string) => void;
}

export function Pricing({ onSelectPlan, handleWhatsAppClick }: PricingProps) {
    return (
        <section id="preços" className="py-24 relative scroll-mt-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-6xl font-black text-white">
                        Planos que <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">cabem no seu bolso</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Escolha o plano ideal para o tamanho da sua operação
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 text-left max-w-7xl mx-auto">
                    {/* FREE TRIAL CARD */}
                    <div className="p-10 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-slate-900/50 border-2 border-purple-500/40 rounded-2xl flex flex-col gap-6 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20 transition-all hover:scale-105 relative animate-pulse-slow">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Gift className="text-purple-400" size={20} />
                                <span className="text-purple-400 font-bold uppercase text-xs tracking-wider">Teste Grátis</span>
                            </div>
                            <h3 className="text-5xl font-black text-white mt-2">
                                R$ 0<span className="text-lg text-slate-400">,00</span>
                            </h3>
                            <p className="text-purple-300 text-sm font-bold mt-1">7 dias • Sem cartão</p>
                        </div>
                        <ul className="space-y-3 flex-1 text-sm text-slate-300">
                            <li className="flex items-center gap-3">
                                <Check size={18} className="text-purple-400 flex-shrink-0" />
                                <span>Acesso Completo</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check size={18} className="text-purple-400 flex-shrink-0" />
                                <span>Todos os Recursos</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check size={18} className="text-purple-400 flex-shrink-0" />
                                <span>Suporte Prioritário</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check size={18} className="text-purple-400 flex-shrink-0" />
                                <span>Sem Compromisso</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => onSelectPlan('Trial')}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-500 hover:via-fuchsia-400 hover:to-pink-400 transition-all shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-pink-500/60 hover:scale-105 active:scale-95"
                            style={{ background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(217, 70, 239), rgb(236, 72, 153))' }}
                        >
                            🎁 Começar Teste Grátis
                        </button>
                    </div>

                    {/* Plan Start */}
                    <div className="p-10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl flex flex-col gap-6 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all hover:scale-105 animate-pulse-slow">
                        <div>
                            <span className="text-emerald-500 font-bold uppercase text-xs tracking-wider">Start</span>
                            <h3 className="text-5xl font-black text-white mt-2">
                                R$ 49<span className="text-lg text-slate-400">,90/mês</span>
                            </h3>
                        </div>
                        <ul className="space-y-3 flex-1 text-sm text-slate-300">
                            <li className="flex items-center gap-3">
                                <Check size={18} className="text-emerald-500 flex-shrink-0" />
                                <span>1 Usuário</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check size={18} className="text-emerald-500 flex-shrink-0" />
                                <span>OS Ilimitadas</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check size={18} className="text-emerald-500 flex-shrink-0" />
                                <span>Relatórios Básicos</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => onSelectPlan('Start')}
                            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl font-bold hover:from-emerald-500 hover:to-emerald-400 transition-all shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-400/60 hover:scale-105"
                            style={{ background: 'linear-gradient(to right, rgb(5, 150, 105), rgb(16, 185, 129))' }}
                        >
                            Começar Agora
                        </button>
                    </div>

                    {/* Plan Professional - DESTAQUE */}
                    <div className="relative p-10 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-slate-900/50 border-2 border-emerald-500 rounded-2xl flex flex-col gap-6 shadow-2xl shadow-emerald-500/30 hover:scale-105 transition-all duration-500 animate-pulse-slow">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-emerald-400 font-bold uppercase text-xs tracking-wider">⭐ Mais Popular</span>
                            </div>
                            <span className="text-emerald-400 font-bold uppercase text-xs tracking-wider">Professional</span>
                            <h3 className="text-5xl font-black text-white mt-2">
                                R$ 149<span className="text-lg text-slate-400">,90/mês</span>
                            </h3>
                        </div>
                        <ul className="space-y-3 flex-1 text-sm text-white">
                            <li className="flex items-center gap-3">
                                <Check size={18} className="text-emerald-400 flex-shrink-0" />
                                <span>3 Usuários</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check size={18} className="text-emerald-400 flex-shrink-0" />
                                <span>QR Codes</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check size={18} className="text-emerald-400 flex-shrink-0" />
                                <span>Logo Personalizada</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => onSelectPlan('Professional')}
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            Assinar Agora
                        </button>
                    </div>

                    {/* Plan Business */}
                    <div className="p-10 bg-gradient-to-br from-blue-500/10 to-slate-900/50 border border-blue-500/30 rounded-2xl flex flex-col gap-6 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all hover:scale-105 animate-pulse-slow">
                        <div>
                            <span className="text-blue-400 font-bold uppercase text-xs tracking-wider">Business</span>
                            <h3 className="text-5xl font-black text-white mt-2">
                                R$ 349<span className="text-lg text-slate-400">,90/mês</span>
                            </h3>
                        </div>
                        <ul className="space-y-3 flex-1 text-sm text-slate-300">
                            <li className="flex items-center gap-3">
                                <Check size={18} className="text-blue-400 flex-shrink-0" />
                                <span>10 Usuários</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check size={18} className="text-blue-400 flex-shrink-0" />
                                <span>Dashboards BI</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check size={18} className="text-blue-400 flex-shrink-0" />
                                <span>Suporte Prioritário</span>
                            </li>
                        </ul>
                        <button
                            onClick={() => handleWhatsAppClick('Olá! Tenho interesse no plano Business. Gostaria de mais informações.')}
                            className="w-full py-4 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                        >
                            Falar com Vendas
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
