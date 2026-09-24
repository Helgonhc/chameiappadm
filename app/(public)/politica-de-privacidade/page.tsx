import React from 'react';
import { SITE_CONFIG } from '../../../lib/config/site.config';

export const metadata = {
  title: `Política de Privacidade | ${SITE_CONFIG.name}`,
  description: `Política de Privacidade e Conformidade LGPD do portal ${SITE_CONFIG.name}.`,
};

export default function PoliticaPrivacidadePage() {
  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="bg-white p-8 rounded-xl border border-[var(--color-neutral-200)] shadow-card space-y-6">
        <div className="space-y-2 border-b border-[var(--color-neutral-200)] pb-4">
          <span className="text-xs font-bold text-[var(--color-brand-primary-700)] uppercase tracking-wider">
            Conformidade LGPD
          </span>
          <h1 className="text-3xl font-black text-[var(--color-neutral-900)]">
            Política de Privacidade
          </h1>
        </div>

        <div className="prose prose-emerald max-w-none text-sm leading-relaxed text-[var(--color-neutral-700)] space-y-4">
          <p>
            A sua privacidade é de extrema importância para o <strong>{SITE_CONFIG.name}</strong> ({SITE_CONFIG.legalName}). Esta política descreve como coletamos, usamos e protegemos as informações fornecidas por você em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
          </p>

          <h2 className="text-lg font-bold text-[var(--color-neutral-900)] pt-2">
            1. Dados Coletados
          </h2>
          <p>
            Não exigimos cadastro de conta nem coleta de CPF ou dados bancários para a navegação pública no portal.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Dados de Navegação Anônimos:</strong> Registramos eventos anônimos de clique (como horário, origem da navegação e oferta acessada) para fins estatísticos e prevenção de spam.</li>
            <li><strong>Formulário de Contato:</strong> Se você nos enviar uma mensagem através da página de contato, seu nome e e-mail serão utilizados estritamente para responder à sua solicitação.</li>
          </ul>

          <h2 className="text-lg font-bold text-[var(--color-neutral-900)] pt-2">
            2. Uso de Cookies e Tecnologias de Rastreamento
          </h2>
          <p>
            Utilizamos cookies estritamente necessários para o funcionamento e otimização do site. Ao clicar nos links de afiliados, o comerciante parceiro (ex: Amazon ou Mercado Livre) pode armazenar um cookie no seu navegador para identificar que a visita originou-se do {SITE_CONFIG.name}.
          </p>

          <h2 className="text-lg font-bold text-[var(--color-neutral-900)] pt-2">
            3. Direitos do Titular de Dados
          </h2>
          <p>
            Conforme a LGPD, você tem o direito de solicitar a confirmação, correção ou exclusão de qualquer dado pessoal eventualmente fornecido através dos nossos canais diretos de contato.
          </p>
        </div>
      </div>
    </div>
  );
}
