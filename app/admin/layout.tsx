import React from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '../../lib/config/site.config';
import { ChameiMarker } from '../../components/ui/ChameiMarker';

export const metadata = {
  title: `Painel Admin | ${SITE_CONFIG.name}`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans">
      {/* Header do Painel Admin V2 */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            <div className="flex items-center gap-3">
              <ChameiMarker size="sm" label="ADMIN V2" className="bg-[var(--color-signal-primary)] text-white font-bold" />
              <Link href="/admin/dashboard" className="font-extrabold text-lg text-white hover:text-[var(--color-signal-primary)] transition-colors">
                CHAMEI<span className="text-[var(--color-signal-primary)]">APP</span> <span className="text-xs text-slate-400 font-normal">| Gestão & Radar</span>
              </Link>
            </div>

            {/* Menu Principal Admin */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-bold">
              <Link
                href="/admin/dashboard"
                className="px-3 py-2 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Visão Geral
              </Link>

              <Link
                href="/admin/radar"
                className="px-3 py-2 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <span>📡 Radar Chamei</span>
              </Link>

              <Link
                href="/admin/radar/candidatas"
                className="px-3 py-2 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <span>📋 Fila Candidatas</span>
              </Link>

              <Link
                href="/admin/ofertas"
                className="px-3 py-2 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Ofertas Publicadas
              </Link>

              <Link
                href="/admin/integracoes"
                className="px-3 py-2 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Integrações
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/ofertas/nova"
                className="px-3 py-1.5 rounded text-xs font-bold bg-[var(--color-signal-primary)] text-white hover:bg-[var(--color-signal-hover)] transition-colors shadow-xs"
              >
                + Link Especial Manual
              </Link>
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-block text-xs text-slate-400 hover:text-white transition-colors"
              >
                Ver Site ↗
              </Link>
            </div>

          </div>
        </div>

        {/* Sub-bar de navegação mobile admin */}
        <div className="md:hidden bg-slate-800 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs font-bold text-slate-300 border-t border-slate-700">
          <Link href="/admin/dashboard" className="shrink-0 hover:text-white">Visão Geral</Link>
          <span>•</span>
          <Link href="/admin/radar" className="shrink-0 hover:text-white">📡 Radar</Link>
          <span>•</span>
          <Link href="/admin/radar/candidatas" className="shrink-0 hover:text-white">📋 Candidatas</Link>
          <span>•</span>
          <Link href="/admin/integracoes" className="shrink-0 hover:text-white">Integrações</Link>
        </div>
      </header>

      {/* Conteúdo Principal do Admin */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-400 text-xs py-4 px-6 text-center border-t border-slate-800">
        Painel Restrito CHAMEIAPP V2 — Operação Real & Zero Dados Fictícios
      </footer>
    </div>
  );
}
