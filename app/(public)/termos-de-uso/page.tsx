import React from 'react';
import { SITE_CONFIG } from '../../../lib/config/site.config';

export const metadata = {
  title: `Termos de Uso | ${SITE_CONFIG.name}`,
  description: `Termos e Condições de Uso do portal de ofertas ${SITE_CONFIG.name}.`,
};

export default function TermosUsoPage() {
  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="bg-white p-8 rounded-xl border border-[var(--color-neutral-200)] shadow-card space-y-6">
        <div className="space-y-2 border-b border-[var(--color-neutral-200)] pb-4">
          <span className="text-xs font-bold text-[var(--color-brand-primary-700)] uppercase tracking-wider">
            Termos Legais
          </span>
          <h1 className="text-3xl font-black text-[var(--color-neutral-900)]">
            Termos de Uso
          </h1>
        </div>

        <div className="prose prose-emerald max-w-none text-sm leading-relaxed text-[var(--color-neutral-700)] space-y-4">
          <p>
            Bem-vindo ao <strong>{SITE_CONFIG.name}</strong>. Ao acessar e utilizar este site, você concorda expressamente com os seguintes termos e condições de uso.
          </p>

          <h2 className="text-lg font-bold text-[var(--color-neutral-900)] pt-2">
            1. Natureza do Serviço
          </h2>
          <p>
            O {SITE_CONFIG.name} é um serviço meramente informativo e agregador de links de ofertas de terceiros. Nós <strong>não fabricamos, não vendemos, não estocamos e não entregamos</strong> nenhum produto listado no portal.
          </p>

          <h2 className="text-lg font-bold text-[var(--color-neutral-900)] pt-2">
            2. Variação de Preços e Estoque
          </h2>
          <p>
            Os preços, estoques e condições de frete anunciados são de responsabilidade exclusiva dos comerciantes parceiros (ex: Amazon e Mercado Livre) e estão sujeitos a alterações a qualquer momento sem aviso prévio. Orientamos sempre a verificar o valor final no carrinho de compras do site oficial antes de concluir o pagamento.
          </p>

          <h2 className="text-lg font-bold text-[var(--color-neutral-900)] pt-2">
            3. Limitação de Responsabilidade
          </h2>
          <p>
            O {SITE_CONFIG.name} não se responsabiliza por eventuais atrasos de entrega, produtos com defeito ou problemas no processamento de pagamento ocorridos na plataforma do comerciante. Qualquer garantia ou troca deve ser tratada diretamente com o vendedor final.
          </p>
        </div>
      </div>
    </div>
  );
}
