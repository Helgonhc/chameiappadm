import React from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '../../../lib/config/site.config';

export const metadata = {
  title: `Como Funciona | ${SITE_CONFIG.name}`,
  description: `Entenda didaticamente o funcionamento do agregador de ofertas ${SITE_CONFIG.name}.`,
};

export default function ComoFuncionaPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="bg-white p-8 rounded-xl border border-[var(--color-neutral-200)] shadow-card space-y-6">
        <div className="space-y-2 border-b border-[var(--color-neutral-200)] pb-6">
          <span className="text-xs font-bold text-[var(--color-brand-primary-700)] uppercase tracking-wider">
            Guia Didático
          </span>
          <h1 className="text-3xl font-black text-[var(--color-neutral-900)]">
            Como Funciona o {SITE_CONFIG.name}
          </h1>
          <p className="text-sm text-[var(--color-neutral-700)]">
            Entenda passo a passo como ajudamos você a economizar tempo e dinheiro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-brand-primary-700)] text-white flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-lg text-[var(--color-neutral-900)]">
              1. Monitoramento & Seleção
            </h3>
            <p className="text-xs text-[var(--color-neutral-700)] leading-relaxed">
              Varremos os maiores ecommerces do Brasil (como Amazon Brasil e Mercado Livre) em busca de quedas reais de preço e cupons ativos.
            </p>
          </div>

          <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-brand-primary-700)] text-white flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-lg text-[var(--color-neutral-900)]">
              2. Validação e Publicação
            </h3>
            <p className="text-xs text-[var(--color-neutral-700)] leading-relaxed">
              Verificamos se o produto tem boa reputação, entrega confiável e frete justo antes de ser publicado na nossa vitrine.
            </p>
          </div>

          <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-brand-primary-700)] text-white flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-lg text-[var(--color-neutral-900)]">
              3. Clique e Redirecionamento
            </h3>
            <p className="text-xs text-[var(--color-neutral-700)] leading-relaxed">
              Ao clicar no botão &quot;Ver oferta na loja&quot;, você é redirecionado via link seguro diretamente para o checkout ou página oficial do produto.
            </p>
          </div>

          <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-brand-primary-700)] text-white flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h3 className="font-bold text-lg text-[var(--color-neutral-900)]">
              4. Compra Segura na Loja Oficial
            </h3>
            <p className="text-xs text-[var(--color-neutral-700)] leading-relaxed">
              Toda a transação, pagamento e entrega são realizados diretamente pelo marketplace oficial. Nós não retemos seus dados de cartão ou endereço.
            </p>
          </div>
        </div>

        <div className="pt-6 text-center">
          <Link href="/ofertas" className="btn-precim-primary">
            Explorar ofertas verificadas agora →
          </Link>
        </div>
      </div>
    </div>
  );
}
