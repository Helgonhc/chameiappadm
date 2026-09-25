'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChameiMarker } from '../ui/ChameiMarker';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/ofertas?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('main-search-input');
        input?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="bg-slate-950 text-white sticky top-0 z-40 shadow-lg border-b border-slate-800/80 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Logo & Marca nominal CHAMEIAPP */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <ChameiMarker size="sm" label="CHAMEI" className="bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] text-white font-black shadow-md shadow-orange-500/20" />
            <div className="flex flex-col">
              <span className="font-black text-xl md:text-2xl tracking-tight text-white group-hover:text-[#FF5500] transition-colors flex items-center gap-1">
                CHAMEI<span className="text-[#FF5500]">APP</span>
              </span>
              <span className="text-[10px] text-orange-400 font-bold tracking-wider uppercase hidden sm:block">
                🔥 Portal de Ofertas Reais
              </span>
            </div>
          </Link>

          {/* Campo de Busca Protagonista (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl relative">
            <input
              id="main-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar produtos, marcas ou cupons ativos... (Ctrl + K)"
              className="w-full bg-slate-900 text-white placeholder-slate-400 border border-slate-700/80 rounded-xl py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:border-[#FF5500] focus:ring-2 focus:ring-[#FF5500]/20 transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FF5500] text-white p-1.5 rounded-lg hover:bg-[#E04B00] transition-colors shadow-sm"
              aria-label="Pesquisar ofertas"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

          {/* Navegação & Status Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-200">
            <Link href="/ofertas" className="hover:text-[#FF5500] transition-colors flex items-center gap-1">
              🔥 Ofertas
            </Link>
            <Link href="/categoria/celulares-e-acessorios" className="hover:text-[#FF5500] transition-colors">
              Celulares
            </Link>
            <Link href="/categoria/itens-gamer" className="hover:text-[#FF5500] transition-colors">
              Gamer
            </Link>
            <Link href="/categoria/casa-inteligente" className="hover:text-[#FF5500] transition-colors">
              Casa Smart
            </Link>
            <Link
              href="/admin/ofertas"
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black border border-slate-700 transition-all"
            >
              Painel Admin ⚙️
            </Link>
          </nav>

          {/* Hamburguer Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Abrir Menu de Navegação"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isMobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Busca Mobile Protagonista */}
        <div className="md:hidden py-2 pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar ofertas de hoje..."
              className="w-full bg-slate-900 text-white placeholder-slate-400 border border-slate-700/80 rounded-lg py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-[#FF5500]"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-400 p-1"
              aria-label="Pesquisar no CHAMEIAPP"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Menu Deslizante Mobile */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-t border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/ofertas"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-bold text-[#FF5500] py-2 border-b border-slate-800"
          >
            🔥 Todas as Ofertas
          </Link>
          <Link
            href="/categoria/celulares-e-acessorios"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-white py-2 border-b border-slate-800"
          >
            📱 Celulares e Acessórios
          </Link>
          <Link
            href="/categoria/itens-gamer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-white py-2 border-b border-slate-800"
          >
            🎮 Itens Gamer
          </Link>
          <Link
            href="/categoria/cozinha"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-white py-2 border-b border-slate-800"
          >
            🍳 Cozinha & Eletro
          </Link>
          <Link
            href="/admin/ofertas"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-bold text-orange-400 py-2"
          >
            ⚙️ Painel do Administrador
          </Link>
        </div>
      )}
    </header>
  );
};
