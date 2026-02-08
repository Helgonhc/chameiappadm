'use client';

import React from 'react';

type Orientation = 'landscape' | 'portrait';

interface TabletMockupProps {
    children: React.ReactNode;
    orientation?: Orientation;
    /**
     * Presets comuns:
     * - "ipadPro11": 11" (aprox 4:3)
     * - "ipadPro129": 12.9" (aprox 4:3, mesma vibe)
     */
    preset?: 'ipadPro11' | 'ipadPro129';
}

export function TabletMockup({
    children,
    orientation = 'landscape',
    preset = 'ipadPro11',
}: TabletMockupProps) {
    // iPad Pro é essencialmente 4:3 (em portrait e landscape)
    const ratioClass = orientation === 'portrait' ? 'aspect-[3/4]' : 'aspect-[4/3]';

    return (
        <div className="relative w-full max-w-[880px] mx-auto group">
            {/* Ambient glow (bem controlado, premium) */}
            <div className="absolute -inset-10 bg-gradient-to-br from-emerald-500/20 via-blue-500/12 to-purple-500/18 rounded-[3.5rem] blur-[110px] opacity-50 group-hover:opacity-75 transition-opacity duration-700 pointer-events-none" />

            {/* Device */}
            <div
                className={`relative w-full ${ratioClass} rounded-[2.35rem] p-[8px] overflow-hidden shadow-[0_40px_95px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/12 bg-[radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.40),rgba(255,255,255,0.06)_30%,rgba(0,0,0,0)_60%),linear-gradient(135deg,rgba(226,232,240,1),rgba(148,163,184,1),rgba(71,85,105,1))]`}
            >
                {/* Aro metálico: brilho e profundidade */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-14 -left-14 w-72 h-72 bg-white/18 blur-2xl rotate-12" />
                    <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-black/28 blur-2xl" />
                    <div className="absolute inset-0 rounded-[2.35rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(0,0,0,0.25)]" />
                </div>

                {/* Antenna lines (sutil no aro) */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* top antenna */}
                    <div className="absolute top-[6px] left-[18%] right-[18%] h-px bg-white/18 opacity-50" />
                    {/* bottom antenna */}
                    <div className="absolute bottom-[6px] left-[18%] right-[18%] h-px bg-black/25 opacity-40" />
                    {/* side antennas */}
                    <div className="absolute left-[6px] top-[18%] bottom-[18%] w-px bg-white/14 opacity-45" />
                    <div className="absolute right-[6px] top-[18%] bottom-[18%] w-px bg-black/22 opacity-40" />
                </div>

                {/* Inner bezel (fino, iPad Pro) */}
                <div className="relative w-full h-full rounded-[2.05rem] bg-black/95 p-[10px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
                    {/* Camera module (iPad Pro: no lado “de cima” da orientação) */}
                    {orientation === 'landscape' ? (
                        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-full bg-black/55 backdrop-blur-md border border-white/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                            <span className="w-2 h-2 rounded-full bg-slate-950 border border-white/10" />
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-slate-700 to-slate-950 border border-white/10 relative overflow-hidden ml-1">
                                <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.32),transparent_55%)]" />
                                <span className="absolute top-[2px] left-[2px] w-1.5 h-1.5 rounded-full bg-white/12" />
                            </span>
                        </div>
                    ) : (
                        <div className="absolute left-[10px] top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2 px-2 py-4 rounded-full bg-black/55 backdrop-blur-md border border-white/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                            <span className="w-2 h-2 rounded-full bg-slate-950 border border-white/10" />
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-slate-700 to-slate-950 border border-white/10 relative overflow-hidden">
                                <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.32),transparent_55%)]" />
                                <span className="absolute top-[2px] left-[2px] w-1.5 h-1.5 rounded-full bg-white/12" />
                            </span>
                        </div>
                    )}

                    {/* Screen (bem edge-to-edge + vinheta) */}
                    <div className="relative w-full h-full rounded-[1.75rem] overflow-hidden bg-slate-950 border border-white/5 shadow-[inset_0_14px_40px_rgba(0,0,0,0.78)]">
                        {/* App */}
                        <div className="absolute inset-0 z-10">{children}</div>

                        {/* Vignette (iPad feel) */}
                        <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_58%,rgba(0,0,0,0.60)_100%)] opacity-75" />

                        {/* Glass reflections (mais “real”) */}
                        <div className="absolute inset-0 z-30 pointer-events-none">
                            <div className="absolute -top-24 -left-28 w-[70%] h-[55%] bg-white/10 blur-2xl rotate-12 opacity-55 group-hover:opacity-35 transition-opacity duration-700" />
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent opacity-70" />
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-45" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/8 via-transparent to-white/5 opacity-35" />
                        </div>
                    </div>

                    {/* Home indicator: iPad não tem, mas fica “ok” como detalhe opcional — deixei ultra sutil */}
                    <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-28 h-1 rounded-full bg-white/8 opacity-60" />
                </div>

                {/* Side buttons (dependem da orientação) */}
                {orientation === 'landscape' ? (
                    <>
                        <div className="absolute right-0 top-[22%] w-[4px] h-14 rounded-l-sm bg-gradient-to-b from-slate-200 to-slate-500 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]" />
                        <div className="absolute right-0 top-[36%] w-[4px] h-10 rounded-l-sm bg-gradient-to-b from-slate-200 to-slate-500 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]" />
                        <div className="absolute top-0 right-[18%] w-14 h-[4px] rounded-b-sm bg-gradient-to-r from-slate-200 to-slate-500 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]" />
                    </>
                ) : (
                    <>
                        <div className="absolute top-0 left-[22%] w-14 h-[4px] rounded-b-sm bg-gradient-to-r from-slate-200 to-slate-500 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]" />
                        <div className="absolute top-0 left-[36%] w-10 h-[4px] rounded-b-sm bg-gradient-to-r from-slate-200 to-slate-500 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]" />
                        <div className="absolute left-0 top-[18%] w-[4px] h-14 rounded-r-sm bg-gradient-to-b from-slate-200 to-slate-500 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)]" />
                    </>
                )}
            </div>

            {/* Contact shadow */}
            <div className="absolute -bottom-10 inset-x-12 h-10 bg-black/60 blur-2xl rounded-full -z-10" />
        </div>
    );
}
