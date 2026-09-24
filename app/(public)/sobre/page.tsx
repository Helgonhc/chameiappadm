import React from 'react';
import { SITE_CONFIG } from '../../../lib/config/site.config';
import { MarkerPrecim } from '../../../components/ui/MarkerPrecim';

export const metadata = {
  title: `Sobre Nós | ${SITE_CONFIG.name}`,
  description: `Conheça a história e transparência do portal ${SITE_CONFIG.name}.`,
};

export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="bg-white p-8 rounded-xl border border-[var(--color-neutral-200)] shadow-card space-y-6">
        <div className="space-y-2 border-b border-[var(--color-neutral-200)] pb-6">
          <MarkerPrecim size="sm" label="TRANSPARÊNCIA & PROPÓSITO" />
          <h1 className="text-3xl font-black text-[var(--color-neutral-900)]">
            Sobre o {SITE_CONFIG.name}
          </h1>
          <p className="text-base text-[var(--color-neutral-700)] font-medium">
            &quot;{SITE_CONFIG.tagline}&quot;
          </p>
        </div>

        <div className="prose prose-emerald max-w-none text-sm leading-relaxed text-[var(--color-neutral-700)] space-y-4">
          <p>
            O <strong>{SITE_CONFIG.name}</strong> nasceu do desejo de simplificar a busca por boas oportunidades de compra na internet brasileira. Em um ambiente repleto de promoções maquiadas, nosso objetivo é oferecer um portal limpo, direto e confiável.
          </p>

          <h2 className="text-xl font-bold text-[var(--color-neutral-900)] pt-4">
            Nossa Filosofia de Trabalho
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Apenas Ofertas Reais:</strong> Não divulgamos descontos fictícios de &quot;metade do dobro&quot;. Verificamos o histórico recente de preços antes de publicar.
            </li>
            <li>
              <strong>Curadoria Humana e Responsável:</strong> Selecionamos produtos de alta utilidade e marcas reconhecidas em parceiros oficiais como Amazon e Mercado Livre.
            </li>
            <li>
              <strong>Total Respeito ao Usuário:</strong> Sem pop-ups invasivos, sem rastreamento abusivo de dados pessoais e sem cobrança de taxas.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-[var(--color-neutral-900)] pt-4">
            Como Mantemos o Portal
          </h2>
          <p>
            Para manter o serviço gratuito e sem anúncios poluentes, participamos de programas de afiliados oficiais. Quando você clica em um link e conclui uma compra na loja parceira, podemos receber uma comissão. Isso não altera em nada o valor que você paga pelo produto.
          </p>
        </div>
      </div>
    </div>
  );
}
