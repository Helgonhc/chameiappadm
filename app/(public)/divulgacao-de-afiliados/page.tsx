import React from 'react';
import { SITE_CONFIG } from '../../../lib/config/site.config';

export const metadata = {
  title: `Divulgação de Afiliados | ${SITE_CONFIG.name}`,
  description: `Declaração formal de transparência sobre comissionamento de afiliados do portal ${SITE_CONFIG.name}.`,
};

export default function DivulgacaoAfiliadosPage() {
  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="bg-white p-8 rounded-xl border border-[var(--color-neutral-200)] shadow-card space-y-6">
        <div className="space-y-2 border-b border-[var(--color-neutral-200)] pb-4">
          <span className="text-xs font-bold text-[var(--color-brand-primary-700)] uppercase tracking-wider">
            Transparência Comercial
          </span>
          <h1 className="text-3xl font-black text-[var(--color-neutral-900)]">
            Divulgação de Afiliados
          </h1>
        </div>

        <div className="prose prose-emerald max-w-none text-sm leading-relaxed text-[var(--color-neutral-700)] space-y-4">
          <p>
            O <strong>{SITE_CONFIG.name}</strong> é um portal agregador de ofertas e promoções. Em cumprimento às boas práticas comerciais e de transparência com o consumidor, declaramos que participamos de programas de afiliados oficiais do varejo e-commerce, incluindo:
          </p>

          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Programa de Associados da Amazon Brasil:</strong> Como participantes do Programa de Associados da Amazon (Tracking ID: <code>{SITE_CONFIG.amazonAssociateTag}</code>), divulgamos links de produtos disponíveis na Amazon Brasil (<code>https://www.amazon.com.br/</code>).
            </li>
            <li>
              <strong>Programa de Afiliados do Mercado Livre:</strong> Divulgamos links de produtos disponíveis no Mercado Livre (<code>https://www.mercadolivre.com.br/</code>).
            </li>
          </ul>

          <h2 className="text-lg font-bold text-[var(--color-neutral-900)] pt-2">
            Como Funciona o Comissionamento?
          </h2>
          <p>
            Quando você clica em um link de oferta publicado no {SITE_CONFIG.name} e conclui uma compra no site do comerciante parceiro, podemos receber uma pequena comissão de indicação.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Sem Custo Adicional:</strong> O valor do produto é exatamente o mesmo anunciado pela loja parceira, não existindo qualquer acréscimo para você.</li>
            <li><strong>Independência:</strong> O {SITE_CONFIG.name} não é proprietário nem possui vínculo de controle sobre os ecommerces parceiros.</li>
            <li><strong>Isenção de Preço e Estoque:</strong> Os preços, fretes e disponibilidade de estoque são de inteira responsabilidade das lojas parceiras no momento da finalização da compra.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
