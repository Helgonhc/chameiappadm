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
            Em conformidade com as diretrizes de transparência e defesa do consumidor, o <strong>{SITE_CONFIG.name}</strong> declara que é um portal agregador de ofertas participante de programas de afiliados oficiais de grandes empresas do varejo eletrônico, incluindo (mas não se limitando a) o <strong>Programa de Associados da Amazon Brasil</strong> e o <strong>Programa de Afiliados do Mercado Livre</strong>.
          </p>

          <h2 className="text-lg font-bold text-[var(--color-neutral-900)] pt-2">
            Como Funciona o Comissionamento?
          </h2>
          <p>
            Quando você clica em um link de oferta publicado em nosso site e efetua uma compra na loja de destino, o comerciante parceiro nos paga uma pequena comissão pela indicação.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Sem Custo Adicional:</strong> O valor do produto para você é exatamente o mesmo, com ou sem a comissão de afiliado.</li>
            <li><strong>Isenção de Influência:</strong> Nosso processo de seleção e indicação de ofertas prioriza a relevância da promoção e o desconto real, não a margem de comissão.</li>
            <li><strong>Independência:</strong> O {SITE_CONFIG.name} não é proprietário nem possui vínculo de controle sobre os marketplaces citados.</li>
          </ul>

          <h2 className="text-lg font-bold text-[var(--color-neutral-900)] pt-2">
            Compromisso com o Leitor
          </h2>
          <p>
            Esta receita é o que nos permite manter a infraestrutura do site ativa, a curadoria constante e o acesso 100% gratuito para todos os visitantes sem a necessidade de cadastros pagos ou anúncios visuais intrusivos.
          </p>
        </div>
      </div>
    </div>
  );
}
