import type { Metadata } from 'next';
import './globals.css';
import { SITE_CONFIG } from '../lib/config/site.config';

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} — Agregador Real de Ofertas & Descontos`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.subtagline,
  keywords: ['ofertas', 'descontos', 'promoções', 'cupons de desconto', 'amazon', 'mercado livre', 'compras online'],
  authors: [{ name: SITE_CONFIG.legalName }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_CONFIG.domain,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.subtagline,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--color-neutral-50)] text-[var(--color-neutral-900)] selection:bg-[var(--color-brand-primary-700)] selection:text-white">
        {children}
      </body>
    </html>
  );
}
