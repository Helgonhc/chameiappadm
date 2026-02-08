'use client';

import { ChameiLogo } from '@/frontend/components/Logo';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
    scrolled: boolean;
    scrollToSection: (id: string) => void;
    setShowDemoModal: (show: boolean) => void;
}

export function Navbar({ scrolled, scrollToSection, setShowDemoModal }: NavbarProps) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLoginClick = () => router.push('/login');

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleNavClick = (id: string) => {
        scrollToSection(id);
        setIsMenuOpen(false);
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled || isMenuOpen ? 'glass-premium border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-10 md:h-12">
                {/* Logo */}
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => handleNavClick('home')}>
                    <ChameiLogo className="h-8 md:h-10" color="#10B981" textColor="white" />
                </div>

                {/* Menus Principais - Desktop */}
                <div className="hidden md:flex items-center gap-10">
                    <button onClick={() => handleNavClick('recursos')} className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 hover:text-white transition-colors">Recursos</button>
                    <button onClick={() => handleNavClick('segmentos')} className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 hover:text-white transition-colors">Segmentos</button>
                    <button onClick={() => handleNavClick('como-funciona')} className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 hover:text-white transition-colors">Como Funciona</button>
                    <button onClick={() => handleNavClick('preços')} className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 hover:text-white transition-colors">Preços</button>
                    <button onClick={() => handleNavClick('faq')} className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 hover:text-white transition-colors">Dúvidas</button>
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-4 md:gap-8">
                    <button onClick={handleLoginClick} className="hidden sm:block text-[10px] font-black uppercase tracking-[3px] text-slate-400 hover:text-white px-2 md:px-4 transition-colors">Acessar Painel</button>
                    <button onClick={() => setShowDemoModal(true)} className="px-4 md:px-10 py-2.5 md:py-3.5 bg-white text-black hover:bg-emerald-500 hover:text-white hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-[2px] md:tracking-[3px] shadow-lg active:scale-95">Demo Grátis</button>

                    {/* Mobile Menu Toggle */}
                    <button onClick={toggleMenu} className="md:hidden text-white p-2">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Content */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[#020617] border-b border-white/5 py-8 px-6 animate-fadeIn">
                    <div className="flex flex-col gap-6">
                        <button onClick={() => handleNavClick('recursos')} className="text-[10px] font-black uppercase tracking-[3px] text-left text-slate-400 hover:text-white">Recursos</button>
                        <button onClick={() => handleNavClick('segmentos')} className="text-[10px] font-black uppercase tracking-[3px] text-left text-slate-400 hover:text-white">Segmentos</button>
                        <button onClick={() => handleNavClick('como-funciona')} className="text-[10px] font-black uppercase tracking-[3px] text-left text-slate-400 hover:text-white">Como Funciona</button>
                        <button onClick={() => handleNavClick('preços')} className="text-[10px] font-black uppercase tracking-[3px] text-left text-slate-400 hover:text-white">Preços</button>
                        <button onClick={() => handleNavClick('faq')} className="text-[10px] font-black uppercase tracking-[3px] text-left text-slate-400 hover:text-white">Dúvidas</button>
                        <div className="h-px bg-white/5 my-2" />
                        <button onClick={handleLoginClick} className="text-[10px] font-black uppercase tracking-[3px] text-left text-emerald-400">Acessar Painel</button>
                    </div>
                </div>
            )}
        </nav>
    );
}
