'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

export function FAQ() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const faqItems = [
        { q: 'O sistema funciona sem internet?', a: 'Sim! Nosso app mobile permite a abertura de OS e preenchimento de checklists offline. Os dados são sincronizados automaticamente assim que houver conexão.' },
        { q: 'Meus dados estão seguros?', a: 'Utilizamos infraestrutura de ponta com criptografia de banco de dados e backups diários automáticos. Seus dados são sua propriedade.' },
        { q: 'Posso testar de graça?', a: 'Com certeza. Oferecemos 7 dias de acesso total VIP para você configurar sua empresa e ver os resultados na prática antes de decidir.' },
        { q: 'Envio a OS pelo WhatsApp?', a: 'Sim. Ao finalizar o serviço, o sistema gera o PDF e permite o envio imediato para o cliente via WhatsApp com apenas um clique.' },
    ];

    return (
        <section id="faq" className="py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/20 blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest mb-2">
                        <HelpCircle size={14} />
                        Suporte & Dúvidas
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                        Perguntas <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Frequentes</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-xl mx-auto">
                        Tudo o que você precisa saber para transformar a gestão industrial da sua empresa com o ChameiApp.
                    </p>
                </div>

                <div className="grid gap-4">
                    {faqItems.map((faq, i) => (
                        <div
                            key={i}
                            className={`group relative overflow-hidden rounded-2xl transition-all duration-500 border ${activeFaq === i
                                ? 'bg-white/10 border-emerald-500/30 shadow-[0_20px_50px_-12px_rgba(16,185,129,0.1)]'
                                : 'bg-white/5 border-white/10 hover:border-white/20'
                                }`}
                        >
                            <button
                                onClick={() => toggleFaq(i)}
                                className="w-full p-6 flex items-center justify-between text-left transition-all relative z-10"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg transition-colors ${activeFaq === i ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500 group-hover:text-slate-300'}`}>
                                        <MessageCircle size={18} />
                                    </div>
                                    <span className={`text-lg font-bold transition-colors ${activeFaq === i ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                        {faq.q}
                                    </span>
                                </div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${activeFaq === i ? 'bg-emerald-500 border-emerald-400 text-white rotate-180' : 'border-white/10 text-slate-500 group-hover:border-white/20'}`}>
                                    <ChevronDown
                                        size={18}
                                        className="transition-transform duration-500"
                                    />
                                </div>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${activeFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-6 pb-6 pl-16 text-slate-400 leading-relaxed text-base italic">
                                    <p className="border-l-2 border-emerald-500/30 pl-4 py-1">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>

                            {/* Hover highlight effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                    ))}
                </div>

                {/* CTA footer */}
                <div className="mt-16 text-center">
                    <p className="text-slate-500 text-sm mb-4 italic">Ainda tem alguma dúvida específica?</p>
                    <button
                        onClick={() => {
                            const pricing = document.getElementById('preços');
                            pricing?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors flex items-center gap-2 mx-auto"
                    >
                        Fale com um consultor agora
                        <ChevronDown size={16} className="-rotate-90" />
                    </button>
                </div>
            </div>
        </section>
    );
}
