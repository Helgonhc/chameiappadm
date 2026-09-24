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

  const formattedPrice = currentPrice.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const [reais, centavos] = formattedPrice.split(',');

  const sizeClasses = {
    sm: {
      currency: 'text-xs',
      main: 'text-base font-extrabold',
      cents: 'text-xs',
      previous: 'text-xs',
      badge: 'badge-discount text-[10px] px-1 py-0.5',
    },
    md: {
      currency: 'text-sm',
      main: 'text-xl font-black',
      cents: 'text-xs font-bold',
      previous: 'text-xs',
      badge: 'badge-discount text-xs px-2 py-0.5',
    },
    lg: {
      currency: 'text-base',
      main: 'text-2xl font-black',
      cents: 'text-sm font-bold',
      previous: 'text-sm',
      badge: 'badge-discount text-xs px-2.5 py-1',
    },
    xl: {
      currency: 'text-lg',
      main: 'text-3xl font-black',
      cents: 'text-base font-bold',
      previous: 'text-base',
      badge: 'badge-discount text-sm px-3 py-1 font-extrabold',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      {hasDiscount && (
        <div className="flex items-center gap-2">
          <span className={`${currentSize.previous} line-through text-slate-400 font-normal`}>
            R$ {previousPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          {showDiscountBadge && (
            <span className={currentSize.badge}>
              ↓ {discountPercent}%
            </span>
          )}
        </div>
      )}

      <div className="flex items-baseline gap-0.5 text-slate-900 font-mono leading-none font-bold">
        <span className={`${currentSize.currency} font-semibold mr-0.5`}>R$</span>
        <span className={currentSize.main}>{reais}</span>
        <span className={currentSize.cents}>,{centavos}</span>
      </div>
    </div>
  );
};
