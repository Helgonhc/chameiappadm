import React from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '../../../lib/config/site.config';

export const metadata = {
  title: `Como Funciona | ${SITE_CONFIG.name}`,
  description: `Entenda o funcionamento do agregador de ofertas ${SITE_CONFIG.name}.`,
};

export default function ComoFuncionaPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="bg-white p-8 rounded-xl border border-[var(--color-neutral-200)] shadow-card space-y-6">
        <div className="space-y-2 border-b border-[var(--color-neutral-200)] pb-6">
          <span className="text-xs font-bold text-[var(--color-brand-primary-700)] uppercase tracking-wider">
            Funcionamento do Agregador
          </span>
          <h1 className="text-3xl font-black text-[var(--color-neutral-900)]">
            Como Funciona o {SITE_CONFIG.name}
          </h1>
          <p className="text-sm text-[var(--color-neutral-700)]">
            Entenda como organizamos as ofertas e direcionamos você para as lojas oficiais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-brand-primary-700)] text-white flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-lg text-[var(--color-neutral-900)]">
              1. Seleção de Ofertas
            </h3>
            <p className="text-xs text-[var(--color-neutral-700)] leading-relaxed">
              Registramos produtos com promoções ativas na Amazon Brasil, Mercado Livre e principais varejistas online.
            </p>
          </div>

          <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-brand-primary-700)] text-white flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-lg text-[var(--color-neutral-900)]">
              2. Validação e Informações
            </h3>
            <p className="text-xs text-[var(--color-neutral-700)] leading-relaxed">
              Exibimos o preço atualizado, eventual preço anterior riscado, cupom de desconto quando existente e condições de frete.
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
              Ao clicar em &quot;Ir para a loja&quot;, você é levado com segurança diretamente para o site oficial do comerciante.
            </p>
          </div>

          <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-brand-primary-700)] text-white flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h3 className="font-bold text-lg text-[var(--color-neutral-900)]">
              4. Compra na Loja Parceira
            </h3>
            <p className="text-xs text-[var(--color-neutral-700)] leading-relaxed">
              A compra, o pagamento e a entrega ocorrem integralmente no ambiente seguro da loja oficial.
            </p>
          </div>
        </div>

        <div className="pt-6 text-center">
          <Link href="/ofertas" className="btn-chamei-primary">
            Explorar ofertas verificadas agora →
          </Link>
        </div>
      </div>
    </div>
  );
}
