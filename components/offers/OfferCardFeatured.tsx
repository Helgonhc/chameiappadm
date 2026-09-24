import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Offer } from '../../lib/types/database';
import { MarkerPrecim } from '../ui/MarkerPrecim';
import { PriceTag } from '../ui/PriceTag';
import { CopyCouponButton } from './CopyCouponButton';

interface OfferCardFeaturedProps {
  offer: Offer;
}

export const OfferCardFeatured: React.FC<OfferCardFeaturedProps> = ({ offer }) => {
  return (
    <div className="card-precim overflow-hidden border-2 border-[var(--color-brand-primary-600)] bg-white p-4 md:p-6 mb-8 relative">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Imagem do Produto */}
        <div className="relative w-full md:w-80 h-64 md:h-72 shrink-0 bg-neutral-100 rounded-lg overflow-hidden flex items-center justify-center p-4">
          <Image
            src={offer.image_url}
            alt={offer.title}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="object-contain hover:scale-105 transition-transform duration-300"
            priority
          />
          <div className="absolute top-3 left-3 z-10">
            <MarkerPrecim label="DESTAQUE DO DIA" size="md" />
          </div>
        </div>

        {/* Informações da Oferta */}
        <div className="flex-1 flex flex-col justify-between h-full w-full">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {offer.merchant && (
                <span className="text-xs font-bold text-[var(--color-neutral-700)] bg-neutral-100 px-2.5 py-1 rounded">
                  {offer.merchant.name}
                </span>
              )}
              {offer.category && (
                <span className="text-xs font-medium text-[var(--color-brand-primary-700)] bg-emerald-50 px-2.5 py-1 rounded">
                  {offer.category.name}
                </span>
              )}
              {offer.free_shipping && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded flex items-center gap-1">
                  ✓ Frete Grátis
                </span>
              )}
            </div>

            <Link href={`/ofertas/${offer.slug}`} className="group">
              <h2 className="text-lg md:text-2xl font-extrabold text-[var(--color-neutral-900)] group-hover:text-[var(--color-brand-primary-700)] transition-colors line-clamp-2 mb-3">
                {offer.title}
              </h2>
            </Link>

            {offer.description && (
              <p className="text-sm text-[var(--color-neutral-700)] line-clamp-2 md:line-clamp-3 mb-4 leading-relaxed">
                {offer.description}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-[var(--color-neutral-200)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <PriceTag
                currentPrice={offer.current_price}
                previousPrice={offer.previous_price}
                size="xl"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              {offer.coupon_code && (
                <CopyCouponButton code={offer.coupon_code} />
              )}
              
              <a
                href={`/go/${offer.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-precim-accent text-center justify-center font-bold"
              >
                <span>Ver oferta na loja</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
