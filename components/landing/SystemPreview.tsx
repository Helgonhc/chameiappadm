'use client';

import { Suspense } from 'react';

export function SystemPreview() {
    return (
        <section className="relative py-20 bg-slate-900 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black text-white">
                        Uma Experiência <span className="text-emerald-500 italic">Premium</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Interface intuitiva e moderna, otimizada para tablets e desktop.
                    </p>
                </div>

                <div className="relative mx-auto max-w-[850px] group transition-all duration-500">
                    {/* Tablet Mockup Shell */}
                    <div className="relative bg-slate-800 rounded-[2.5rem] p-3 shadow-2xl border-[8px] border-slate-700 shadow-emerald-500/10 transition-all duration-700 hover:shadow-emerald-500/20 hover:-translate-y-2">
                        {/* Device Buttons */}
                        <div className="absolute -left-[16px] top-24 w-[4px] h-12 bg-slate-600 rounded-l-md" />
                        <div className="absolute -left-[16px] top-40 w-[4px] h-12 bg-slate-600 rounded-l-md" />
                        <div className="absolute -right-[16px] top-32 w-[4px] h-20 bg-slate-600 rounded-r-md" />

                        {/* Camera/Sensor Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-700 rounded-b-2xl z-20 flex items-center justify-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-600" />
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                        </div>

                        {/* Screen Content */}
                        <div className="relative bg-white dark:bg-slate-950 rounded-[1.8rem] overflow-hidden aspect-[4/3] w-full border border-slate-700/50">
                            <Suspense fallback={
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            }>
                                <iframe
                                    src="/demo"
                                    className="w-full h-full border-none"
                                    title="Demo Preview"
                                    loading="lazy"
                                />
                            </Suspense>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
            </div>
        </section>
    );
}
