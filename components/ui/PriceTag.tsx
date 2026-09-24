import React from 'react';

interface PriceTagProps {
  currentPrice: number;
  previousPrice?: number | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showDiscountBadge?: boolean;
  className?: string;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  currentPrice,
  previousPrice,
  size = 'md',
  showDiscountBadge = true,
  className = '',
}) => {
  const hasDiscount = Boolean(previousPrice && previousPrice > currentPrice);
  const discountPercent = hasDiscount
    ? Math.round(((previousPrice! - currentPrice) / previousPrice!) * 100)
    : 0;

  // Formatação dos centavos
  const formattedPrice = currentPrice.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const [reais, centavos] = formattedPrice.split(',');

  const sizeClasses = {
    sm: {
      currency: 'text-xs',
      main: 'text-base font-bold',
      cents: 'text-xs',
      previous: 'text-xs',
      badge: 'text-[10px] px-1.5 py-0.5',
    },
    md: {
      currency: 'text-sm',
      main: 'text-xl font-extrabold',
      cents: 'text-xs font-semibold',
      previous: 'text-xs',
      badge: 'text-xs px-2 py-0.5',
    },
    lg: {
      currency: 'text-base',
      main: 'text-2xl font-extrabold',
      cents: 'text-sm font-semibold',
      previous: 'text-sm',
      badge: 'text-xs px-2.5 py-1 font-bold',
    },
    xl: {
      currency: 'text-lg',
      main: 'text-3xl font-black',
      cents: 'text-base font-bold',
      previous: 'text-base',
      badge: 'text-sm px-3 py-1 font-extrabold',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {hasDiscount && (
        <div className="flex items-center gap-2">
          <span className={`${currentSize.previous} line-through text-[var(--color-neutral-500)]`}>
            R$ {previousPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          {showDiscountBadge && (
            <span
              className={`${currentSize.badge} font-bold rounded bg-red-100 text-red-700 border border-red-200`}
            >
              -{discountPercent}%
            </span>
          )}
        </div>
      )}

      <div className="flex items-baseline gap-0.5 text-[var(--color-brand-accent-600)] font-price leading-none">
        <span className={`${currentSize.currency} font-semibold mr-0.5`}>R$</span>
        <span className={currentSize.main}>{reais}</span>
        <span className={currentSize.cents}>,{centavos}</span>
      </div>
    </div>
  );
};
