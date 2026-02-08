'use client';

import { ChameiLogo } from '@/frontend/components/Logo';

export function Footer() {
    return (
        <footer className="py-16 border-t border-white/5 relative z-10 glass-premium">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[3px] md:tracking-[5px]">
                    © {new Date().getFullYear()} <span className="text-white">CHAMEIAPP</span>. OS INTEGRADA & GESTÃO INDUSTRIAL.
                </p>
                <p className="text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-[3px]">
                    DESENVOLVIDO POR <span className="text-emerald-500/60 hover:text-emerald-500 transition-colors cursor-pointer">HELGON HC</span>
                </p>
            </div>
        </footer>
    );
}
