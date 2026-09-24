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
    <div className="min-h-screen flex flex-col bg-neutral-100 text-neutral-900">
      {/* Navbar do Admin */}
      <header className="bg-[var(--color-neutral-900)] text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <ChameiMarker size="sm" label="ADMIN" className="bg-[var(--color-brand-accent-500)]" />
          <Link href="/admin/dashboard" className="font-bold text-lg hover:text-[var(--color-brand-accent-400)]">
            {SITE_CONFIG.name} Admin
          </Link>
        </div>

        <nav className="flex items-center gap-4 text-xs font-semibold">
          <Link href="/admin/dashboard" className="text-neutral-300 hover:text-white">
            Dashboard
          </Link>
          <Link href="/admin/ofertas/nova" className="px-3 py-1.5 rounded bg-[var(--color-brand-primary-700)] text-white hover:bg-[var(--color-brand-primary-600)]">
            + Nova Oferta Real
          </Link>
          <Link href="/" target="_blank" className="text-neutral-400 hover:text-white">
            Ver Site Público ↗
          </Link>
        </nav>
      </header>

      {/* Conteúdo Principal do Admin */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {children}
      </main>

      <footer className="bg-neutral-900 text-neutral-400 text-xs py-4 px-6 text-center border-t border-neutral-800">
        Painel Restrito — {SITE_CONFIG.legalName || SITE_CONFIG.name}
      </footer>
    </div>
  );
}
