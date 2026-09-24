import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Offer } from '../../lib/types/database';
import { calculateDiscount } from '../../lib/utils/offer-helpers';

interface OfferCardFeaturedProps {
  offer: Offer;
}

export const OfferCardFeatured: React.FC<OfferCardFeaturedProps> = ({ offer }) => {
  const discountPercent = calculateDiscount(offer.current_price, offer.previous_price);

  return (
    <div className="offer-card-feature mb-8 relative">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Imagem do Produto */}
        <div className="relative w-full md:w-80 h-64 md:h-72 shrink-0 bg-white rounded-md overflow-hidden flex items-center justify-center p-4 border border-slate-200">
          <Image
            src={offer.image_url}
            alt={offer.title}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="object-contain p-2 hover:scale-105 transition-transform duration-300"
            priority
          />
          <div className="absolute top-3 left-3 z-10 bg-[var(--color-editorial-main)] text-white text-xs font-bold px-2.5 py-1 rounded shadow-xs uppercase tracking-wider">
            Oportunidade Principal
          </div>
          {discountPercent > 0 && (
            <div className="absolute top-3 right-3 z-10 badge-discount text-sm font-bold shadow-xs">
              ↓ {discountPercent}% OFF
            </div>
          )}
        </div>

        {/* Informações da Oferta */}
        <div className="flex-1 flex flex-col justify-between h-full w-full">
          <div>
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {offer.merchant && (
                <span className="badge-merchant-amazon font-bold">
                  {offer.merchant.name}
                </span>
              )}
              {offer.category && (
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {offer.category.name}
                </span>
              )}
              {offer.free_shipping && (
                <span className="badge-shipping">
                  ✓ Frete Grátis
                </span>
              )}
            </div>

            <Link href={`/o/${offer.slug}`} className="group">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-[var(--color-signal-primary)] transition-colors line-clamp-2 mb-3 leading-tight">
                {offer.title}
              </h2>
            </Link>

            {offer.description && (
              <p className="text-sm text-slate-600 line-clamp-2 md:line-clamp-3 mb-4 leading-relaxed">
                {offer.description}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider mb-0.5">Preço no ChameiApp</span>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl md:text-3xl font-mono font-black text-slate-900">
                  R$ {offer.current_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                {offer.previous_price && offer.previous_price > offer.current_price && (
                  <span className="price-previous text-base">
                    R$ {offer.previous_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              {offer.coupon_code && (
                <div className="badge-coupon py-2 px-3 text-sm">
                  <span>Cupom:</span>
                  <strong className="font-mono">{offer.coupon_code}</strong>
                </div>
              )}
              
              <a
                href={`/go/${offer.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-offer-cta py-3 px-6 text-sm font-bold shadow-md"
              >
                <span>VER OFERTA NA LOJA</span>
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
