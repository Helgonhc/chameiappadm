'use client';

export function HowItWorks() {
    const steps = [
        { title: 'Agende', desc: 'Cadastre chamados e clientes pelo painel administrativo em segundos.' },
        { title: 'Execute', desc: 'Técnico registra fotos, checklists e CPF no app mobile direto do campo.' },
        { title: 'Envie', desc: 'Relatório PDF profissional com sua marca enviado via WhatsApp na hora.' },
    ];

    return (
        <section id="como-funciona" className="py-20 relative">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-12 space-y-3">
                    <h2 className="text-3xl md:text-5xl font-bold text-white">
                        Como <span className="text-emerald-400">Funciona</span>
                    </h2>
                    <p className="text-base text-slate-400">
                        Comece em 3 passos simples
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <div key={i} className="text-center space-y-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full text-white text-2xl font-black shadow-lg shadow-emerald-500/50">
                                {i + 1}
                            </div>
                            <h3 className="text-xl font-bold text-white">{step.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
