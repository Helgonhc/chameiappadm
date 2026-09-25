import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SITE_CONFIG } from '../lib/config/site.config';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} — Agregador Real de Ofertas & Descontos`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.subtagline,
  keywords: ['ofertas', 'descontos', 'promoções', 'cupons de desconto', 'amazon', 'mercado livre', 'compras online'],
  authors: [{ name: SITE_CONFIG.legalName || SITE_CONFIG.name }],
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
    <html lang="pt-BR" className={`scroll-smooth ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-[var(--color-neutral-50)] text-[var(--color-neutral-900)] selection:bg-[var(--color-brand-primary-700)] selection:text-white">
        {children}
      </body>
    </html>
  );
}

