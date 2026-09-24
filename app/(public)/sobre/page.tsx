import React from 'react';
import { SITE_CONFIG } from '../../../lib/config/site.config';
import { ChameiMarker } from '../../../components/ui/ChameiMarker';

export const metadata = {
  title: `Sobre Nós | ${SITE_CONFIG.name}`,
  description: `Conheça a história e proposta de valor do portal ${SITE_CONFIG.name}.`,
};

export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="bg-white p-8 rounded-xl border border-[var(--color-neutral-200)] shadow-card space-y-6">
        <div className="space-y-2 border-b border-[var(--color-neutral-200)] pb-6">
          <ChameiMarker size="sm" label="TRANSPARÊNCIA & PROPÓSITO" />
          <h1 className="text-3xl font-black text-[var(--color-neutral-900)]">
            Sobre o {SITE_CONFIG.name}
          </h1>
          <p className="text-base text-[var(--color-neutral-700)] font-medium">
            &quot;{SITE_CONFIG.tagline}&quot;
          </p>
        </div>

        <div className="prose prose-emerald max-w-none text-sm leading-relaxed text-[var(--color-neutral-700)] space-y-4">
          <p>
            O <strong>{SITE_CONFIG.name}</strong> é um portal independente agregador de ofertas e promoções. Nosso objetivo é apresentar produtos com descontos reais de grandes lojas virtuais como Amazon Brasil e Mercado Livre, de forma rápida, limpa e transparente.
          </p>

          <h2 className="text-xl font-bold text-[var(--color-neutral-900)] pt-4">
            Princípios do CHAMEIAPP
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Validação de Preço:</strong> Não divulgamos descontos mascarados ou irrelevantes.
            </li>
            <li>
              <strong>Links Diretos e Seguros:</strong> O usuário é redirecionado diretamente para o site oficial do comerciante.
            </li>
            <li>
              <strong>Navegação sem Poluição:</strong> Sem anúncios gráficos intrusivos ou cadastros obrigatórios.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-[var(--color-neutral-900)] pt-4">
            Transparência de Afiliados
          </h2>
          <p>
            Participamos de programas de afiliados comerciais (como o Programa de Associados da Amazon). Ao realizar uma compra por meio dos nossos links, o portal pode receber uma comissão sem qualquer alteração no preço pago pelo comprador.
          </p>
        </div>
      </div>
    </div>
  );
}
