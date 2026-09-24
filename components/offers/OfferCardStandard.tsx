import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Offer } from '../../lib/types/database';
import { MarkerPrecim } from '../ui/MarkerPrecim';
import { PriceTag } from '../ui/PriceTag';
import { CopyCouponButton } from './CopyCouponButton';

interface OfferCardStandardProps {
  offer: Offer;
}

export const OfferCardStandard: React.FC<OfferCardStandardProps> = ({ offer }) => {
  return (
    <div className="card-precim flex flex-col justify-between overflow-hidden bg-white h-full relative group">
      <div>
        {/* Container da Imagem */}
        <div className="relative w-full h-48 bg-neutral-100 p-4 flex items-center justify-center overflow-hidden">
          <Image
            src={offer.image_url}
            alt={offer.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 z-10">
            <MarkerPrecim size="sm" label="OFERTA" />
          </div>
          {offer.free_shipping && (
            <div className="absolute bottom-2 right-2 z-10 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
              Frete Grátis
            </div>
          )}
        </div>

        {/* Detalhes do Produto */}
        <div className="p-4">
          <div className="flex items-center justify-between gap-2 mb-2 text-xs">
            {offer.merchant && (
              <span className="font-bold text-[var(--color-neutral-700)] bg-neutral-100 px-2 py-0.5 rounded">
                {offer.merchant.name}
              </span>
            )}
            {offer.category && (
              <span className="font-medium text-[var(--color-brand-primary-700)] truncate">
                {offer.category.name}
              </span>
            )}
          </div>

          <Link href={`/ofertas/${offer.slug}`} className="block">
            <h3 className="font-bold text-sm md:text-base text-[var(--color-neutral-900)] group-hover:text-[var(--color-brand-primary-700)] transition-colors line-clamp-2 min-h-[2.5rem] mb-3 leading-snug">
              {offer.title}
            </h3>
          </Link>
        </div>
      </div>

      {/* Preço e CTA */}
      <div className="p-4 pt-0 border-t border-neutral-100 mt-auto">
        <div className="my-3">
          <PriceTag
            currentPrice={offer.current_price}
            previousPrice={offer.previous_price}
            size="md"
          />
        </div>

        {offer.coupon_code && (
          <div className="mb-3">
            <CopyCouponButton code={offer.coupon_code} />
          </div>
        )}

        <a
          href={`/go/${offer.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-precim-primary w-full text-center text-xs font-bold justify-center"
        >
          <span>Ir para a loja</span>
          <svg
            width="14"
            height="14"
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
  );
};
