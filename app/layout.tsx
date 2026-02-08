import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './modal-root.css';
import { Toaster } from 'react-hot-toast';
import ThemeProvider from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ChameiApp Core - OS & Gestão Industrial',
  description: 'Sistema SaaS Multi-Tenant para gestão de ordens de serviço e manutenção industrial',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
