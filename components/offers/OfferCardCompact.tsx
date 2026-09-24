import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Offer } from '../../lib/types/database';
import { PriceTag } from '../ui/PriceTag';

interface OfferCardCompactProps {
  offer: Offer;
}

export const OfferCardCompact: React.FC<OfferCardCompactProps> = ({ offer }) => {
  return (
    <div className="card-chamei p-3 flex items-center gap-3 bg-white hover:border-[var(--color-brand-primary-600)] transition-all">
      <div className="relative w-20 h-20 shrink-0 bg-neutral-100 rounded overflow-hidden p-1">
        <Image
          src={offer.image_url}
          alt={offer.title}
          fill
          sizes="80px"
          className="object-contain"
        />
      </div>

      <div className="flex-1 min-w-0">
        {offer.merchant && (
          <span className="text-[10px] font-bold text-[var(--color-neutral-500)] uppercase block">
            {offer.merchant.name}
          </span>
        )}
        <Link href={`/ofertas/${offer.slug}`}>
          <h4 className="font-bold text-xs text-[var(--color-neutral-900)] hover:text-[var(--color-brand-primary-700)] line-clamp-2 leading-snug mb-1">
            {offer.title}
          </h4>
        </Link>
        <PriceTag
          currentPrice={offer.current_price}
          previousPrice={offer.previous_price}
          size="sm"
          showDiscountBadge={false}
        />
      </div>

      <a
        href={`/go/${offer.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-chamei-accent text-[11px] px-2.5 py-1.5 shrink-0 self-center font-bold"
      >
        <span>Ver</span>
      </a>
    </div>
  );
};
