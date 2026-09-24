import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nenhuma oferta cadastrada no momento',
  description = 'Não encontramos oportunidades ativas para este filtro. Volte em breve para conferir novas ofertas verificadas.',
  actionText = 'Ver todas as ofertas',
  actionHref = '/ofertas',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white border border-slate-200 rounded-md shadow-xs my-6 max-w-xl mx-auto">
      <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>

      <h3 className="text-lg font-extrabold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-md">
        {description}
      </p>

      {actionHref && (
        <Link href={actionHref} className="btn-offer-cta max-w-xs">
          {actionText}
        </Link>
      )}
    </div>
  );
};
