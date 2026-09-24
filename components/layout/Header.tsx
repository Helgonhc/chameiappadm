'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SITE_CONFIG } from '../../lib/config/site.config';
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
    <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Logo & Marca nominal CHAMEIAPP */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <ChameiMarker size="sm" label="CHAMEI" className="bg-[var(--color-signal-primary)] text-white font-black" />
            <div className="flex flex-col">
              <span className="font-black text-xl md:text-2xl tracking-tight text-white group-hover:text-[var(--color-signal-primary)] transition-colors">
                CHAMEI<span className="text-[var(--color-signal-primary)]">APP</span>
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:block font-medium">
                Portal Agregador de Ofertas Reais
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
              placeholder="Buscar produtos, marcas, cupons ou menor preço... (Ctrl + K)"
              className="w-full bg-slate-950 text-white placeholder-slate-400 border border-slate-700 rounded-md py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:border-[var(--color-signal-primary)] focus:ring-2 focus:ring-[var(--color-signal-primary)]/20 transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white p-1.5 rounded-md hover:bg-slate-800 transition-colors"
              aria-label="Pesquisar ofertas"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

          {/* Navegação Desktop */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-semibold text-slate-200">
            <Link href="/ofertas" className="hover:text-white transition-colors">
              Ofertas
            </Link>
            <Link href="/categoria/tecnologia" className="hover:text-white transition-colors">
              Tecnologia
            </Link>
            <Link href="/categoria/ferramentas" className="hover:text-white transition-colors">
              Ferramentas
            </Link>
            <Link href="/categoria/casa-e-cozinha" className="hover:text-white transition-colors">
              Casa & Cozinha
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
              className="w-full bg-slate-950 text-white placeholder-slate-400 border border-slate-700 rounded-md py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-[var(--color-signal-primary)]"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 p-1"
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

      {/* Menu Deslizante Mobile (Sheet) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-t border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/ofertas"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-white py-2 border-b border-slate-800"
          >
            Todas as Ofertas
          </Link>
          <Link
            href="/categoria/tecnologia"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-white py-2 border-b border-slate-800"
          >
            Tecnologia & Informática
          </Link>
          <Link
            href="/categoria/ferramentas"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-white py-2 border-b border-slate-800"
          >
            Ferramentas & Construção
          </Link>
          <Link
            href="/categoria/casa-e-cozinha"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-semibold text-slate-200 hover:text-white py-2 border-b border-slate-800"
          >
            Casa & Cozinha
          </Link>
        </div>
      )}
    </header>
  );
};
