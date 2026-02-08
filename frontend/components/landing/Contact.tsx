'use client';

interface ContactProps {
    handleWhatsAppClick: (message?: string) => void;
}

export function Contact({ handleWhatsAppClick }: ContactProps) {
    return (
        <section id="contato" className="py-24 relative">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-3xl p-12 md:p-16 space-y-8">
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-emerald-400 font-bold text-sm">
                        🚀 Comece hoje mesmo
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-white">
                        Pronto para <span className="text-emerald-400">Começar?</span>
                    </h2>

                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Teste grátis por 7 dias. Sem cartão de crédito. Cancele quando quiser.
                    </p>

                    <button
                        onClick={() => handleWhatsAppClick('Olá! Quero começar meu teste grátis no ChameiApp!')}
                        className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-emerald-500/50 hover:shadow-emerald-500/70 hover:scale-105 transition-all"
                    >
                        Começar Teste Grátis →
                    </button>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 text-sm pt-4">
                        <span>✓ Setup em 5 minutos</span>
                        <span>✓ Suporte em português</span>
                        <span>✓ Dados 100% seguros</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
