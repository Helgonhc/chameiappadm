import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Offer } from '../../lib/types/database';
import { calculateDiscount } from '../../lib/utils/offer-helpers';

interface OfferCardCompactProps {
  offer: Offer;
}

export const OfferCardCompact: React.FC<OfferCardCompactProps> = ({ offer }) => {
  const discountPercent = calculateDiscount(offer.current_price, offer.previous_price);

  return (
    <div className="offer-card-compact group">
      <div className="relative w-20 h-20 shrink-0 bg-slate-50 rounded border border-slate-100 p-1 overflow-hidden">
        <Image
          src={offer.image_url}
          alt={offer.title}
          fill
          sizes="80px"
          className="object-contain p-1 group-hover:scale-105 transition-transform"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          {offer.merchant && (
            <span className="badge-merchant-amazon text-[9px] py-0 px-1">
              {offer.merchant.name}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="badge-discount text-[10px] py-0 px-1 font-bold">
              ↓ {discountPercent}%
            </span>
          )}
        </div>

        <Link href={`/o/${offer.slug}`}>
          <h4 className="font-bold text-xs text-slate-900 group-hover:text-[var(--color-signal-primary)] line-clamp-2 leading-tight mb-1 transition-colors">
            {offer.title}
          </h4>
        </Link>

        <div className="flex items-baseline gap-1.5">
          <span className="font-mono font-bold text-sm text-slate-900">
            R$ {offer.current_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          {offer.previous_price && offer.previous_price > offer.current_price && (
            <span className="price-previous text-[10px]">
              R$ {offer.previous_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </div>

      <a
        href={`/go/${offer.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-offer-cta text-xs px-3 py-1.5 shrink-0 self-center w-auto"
      >
        <span>VER</span>
      </a>
    </div>
  );
};
