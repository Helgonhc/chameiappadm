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
    <header className="bg-[var(--color-brand-primary-900)] text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Logo & Marca nominal */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <ChameiMarker size="sm" label="CHAMEIAPP" className="bg-[var(--color-brand-accent-500)] text-white" />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-[var(--color-brand-accent-400)] transition-colors">
                {SITE_CONFIG.name}
              </span>
              <span className="text-[10px] text-emerald-200 hidden sm:block font-medium">
                {SITE_CONFIG.tagline}
              </span>
            </div>
          </Link>

          {/* Campo de Busca Funcional (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-lg relative">
            <input
              id="main-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar ofertas, marcas, produtos... (Ctrl + K)"
              className="w-full bg-[var(--color-brand-primary-800)] text-white placeholder-emerald-200/60 border border-[var(--color-brand-primary-600)] rounded-md py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-accent-500)] focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-200 hover:text-white p-1"
              aria-label="Pesquisar ofertas"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

          {/* Navegação Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
            <Link href="/ofertas" className="text-emerald-100 hover:text-white transition-colors">
              Todas as Ofertas
            </Link>
            <Link href="/como-funciona" className="text-emerald-100 hover:text-white transition-colors">
              Como Funciona
            </Link>
            <Link href="/sobre" className="text-emerald-100 hover:text-white transition-colors">
              Sobre Nós
            </Link>
            <Link href="/contato" className="text-emerald-100 hover:text-white transition-colors">
              Contato
            </Link>
            <Link href="/admin/login" className="px-3 py-1.5 rounded text-xs font-bold bg-[var(--color-brand-primary-800)] border border-[var(--color-brand-primary-600)] hover:bg-[var(--color-brand-primary-700)] text-emerald-100 hover:text-white transition-colors">
              Painel Admin
            </Link>
          </nav>

          {/* Hamburguer Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-emerald-100 hover:text-white focus:outline-none"
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

        {/* Busca Mobile Dropdown */}
        <div className="md:hidden py-2 pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar ofertas de hoje..."
              className="w-full bg-[var(--color-brand-primary-800)] text-white placeholder-emerald-200/60 border border-[var(--color-brand-primary-600)] rounded-md py-2 pl-4 pr-10 text-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-emerald-200 p-1"
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
        <div className="lg:hidden bg-[var(--color-brand-primary-800)] border-t border-[var(--color-brand-primary-700)] px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/ofertas"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-semibold text-emerald-100 hover:text-white py-2 border-b border-[var(--color-brand-primary-700)]"
          >
            Todas as Ofertas
          </Link>
          <Link
            href="/como-funciona"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-semibold text-emerald-100 hover:text-white py-2 border-b border-[var(--color-brand-primary-700)]"
          >
            Como Funciona
          </Link>
          <Link
            href="/sobre"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-semibold text-emerald-100 hover:text-white py-2 border-b border-[var(--color-brand-primary-700)]"
          >
            Sobre Nós
          </Link>
          <Link
            href="/contato"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-semibold text-emerald-100 hover:text-white py-2 border-b border-[var(--color-brand-primary-700)]"
          >
            Contato & Dúvidas
          </Link>
          <Link
            href="/divulgacao-de-afiliados"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-base font-semibold text-emerald-100 hover:text-white py-2"
          >
            Transparência & Afiliados
          </Link>
          <Link
            href="/admin/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-center mt-4 btn-chamei-accent w-full text-xs font-bold"
          >
            Painel Administrativo
          </Link>
        </div>
      )}
    </header>
  );
};
