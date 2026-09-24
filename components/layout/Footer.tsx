import React from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '../../lib/config/site.config';
import { MarkerPrecim } from '../ui/MarkerPrecim';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--color-brand-primary-900)] text-white border-t border-[var(--color-brand-primary-800)] pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-[var(--color-brand-primary-800)]">
          
          {/* Coluna 1: Marca & Visão */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <MarkerPrecim size="sm" label="PRECIM" className="bg-[var(--color-brand-accent-500)] text-white" />
              <span className="font-extrabold text-2xl tracking-tight">
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="text-sm text-emerald-100 leading-relaxed max-w-md">
              {SITE_CONFIG.subtagline}
            </p>
            <div className="text-xs text-emerald-200/80 bg-[var(--color-brand-primary-800)] p-3 rounded border border-[var(--color-brand-primary-700)] max-w-md">
              <strong>💡 Isenção e Transparência:</strong> O {SITE_CONFIG.name} é um agregador independente. Não vendemos produtos diretamente nem processamos pagamentos. Ao clicar em nossas ofertas, você é redirecionado para lojas parceiras oficiais.
            </div>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div>
            <h4 className="font-bold text-sm text-[var(--color-brand-accent-400)] uppercase tracking-wider mb-3">
              Plataforma
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/ofertas" className="text-emerald-100 hover:text-white transition-colors">
                  Todas as Ofertas
                </Link>
              </li>
              <li>
                <Link href="/loja/amazon" className="text-emerald-100 hover:text-white transition-colors">
                  Ofertas Amazon
                </Link>
              </li>
              <li>
                <Link href="/loja/mercado-livre" className="text-emerald-100 hover:text-white transition-colors">
                  Ofertas Mercado Livre
                </Link>
              </li>
              <li>
                <Link href="/como-funciona" className="text-emerald-100 hover:text-white transition-colors">
                  Como Selecionamos Ofertas
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Links Legais & Institucional */}
          <div>
            <h4 className="font-bold text-sm text-[var(--color-brand-accent-400)] uppercase tracking-wider mb-3">
              Transparência & Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/divulgacao-de-afiliados" className="text-emerald-100 hover:text-white transition-colors">
                  Divulgação de Afiliados
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className="text-emerald-100 hover:text-white transition-colors">
                  Política de Privacidade (LGPD)
                </Link>
              </li>
              <li>
                <Link href="/termos-de-uso" className="text-emerald-100 hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-emerald-100 hover:text-white transition-colors">
                  Fale Conosco
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Rodapé Inferior */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-200/70 gap-4">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.legalName}. Todos os direitos reservados. {SITE_CONFIG.region}.
          </p>
          <p className="font-medium text-emerald-200">
            &quot;{SITE_CONFIG.tagline}&quot;
          </p>
        </div>
      </div>
    </footer>
  );
};
