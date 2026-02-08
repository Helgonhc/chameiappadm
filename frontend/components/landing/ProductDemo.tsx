'use client';

import { useState } from 'react';
import { TabletMockup } from './TabletMockup';
import { DemoModal } from './DemoModal';
import { SessionTimer } from '../demo/SessionTimer';

export function ProductDemo() {
    const [showDemoModal, setShowDemoModal] = useState(false);

    const handleWhatsAppClick = (message?: string) => {
        const phone = '5511999999999';
        const defaultMessage = 'Olá! Gostaria de conhecer o ChameiApp.';
        const encodedMessage = encodeURIComponent(message || defaultMessage);
        window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
    };

    return (
        <section id="demo" className="py-24 relative scroll-mt-20 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.1),transparent_50%)]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Text Content */}
                    <div className="space-y-8 animate-fadeInUp">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-emerald-400 text-sm font-bold">Demonstração ao Vivo</span>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                                Veja o <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Sistema em Ação</span>
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed">
                                Explore nossa interface intuitiva e descubra como podemos transformar a gestão da sua empresa.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => setShowDemoModal(true)}
                                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                Solicitar Demonstração Completa
                            </button>
                            <button
                                onClick={() => handleWhatsAppClick('Olá! Gostaria de agendar uma demonstração personalizada do ChameiApp.')}
                                className="px-8 py-4 border-2 border-emerald-500/50 text-white rounded-xl font-bold hover:bg-emerald-500/10 transition-all"
                            >
                                Falar com Especialista
                            </button>
                        </div>
                    </div>

                    {/* Right: High-End Tablet Mockup with REAL App */}
                    <div className="relative flex justify-center items-center animate-fadeInUp w-full pt-12 lg:pt-0" style={{ animationDelay: '0.4s' }}>
                        <TabletMockup orientation="landscape">
                            {/* Real App Dashboard in iframe - Demo Mode */}
                            <iframe
                                src="/demo"
                                className="w-full h-full border-0"
                                title="Chamei App Demo Dashboard"
                                loading="lazy"
                            />
                        </TabletMockup>
                    </div>
                </div>
            </div>

            {/* Demo Modal */}
            {showDemoModal && (
                <DemoModal
                    selectedPlan="Professional"
                    onClose={() => setShowDemoModal(false)}
                    handleWhatsAppClick={handleWhatsAppClick}
                />
            )}
        </section>
    );
}
