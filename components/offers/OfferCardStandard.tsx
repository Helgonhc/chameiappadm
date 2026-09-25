import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Offer } from '../../lib/types/database';
import { calculateDiscount } from '../../lib/utils/offer-helpers';

interface OfferCardStandardProps {
  offer: Offer;
}

export const OfferCardStandard: React.FC<OfferCardStandardProps> = ({ offer }) => {
  const discountPercent = calculateDiscount(offer.current_price, offer.previous_price);
  const isMercadoLivre = offer.merchant?.slug?.includes('mercado') || offer.affiliate_url?.includes('mercadolivre');
  const isAmazon = offer.merchant?.slug?.includes('amazon') || offer.affiliate_url?.includes('amazon');

  return (
    <div className="offer-card-standard relative group">
      {/* Top Badges overlay */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between gap-1 pointer-events-none">
        {discountPercent > 0 ? (
          <span className="badge-discount font-extrabold shadow-md">
            🔥 {discountPercent}% OFF
          </span>
        ) : <span />}

        {offer.merchant ? (
          <span className={isMercadoLivre ? 'badge-merchant-ml font-bold shadow-xs' : 'badge-merchant-amazon font-bold shadow-xs'}>
            {offer.merchant.name}
          </span>
        ) : (
          isAmazon ? (
            <span className="badge-merchant-amazon font-bold shadow-xs">Amazon</span>
          ) : isMercadoLivre ? (
            <span className="badge-merchant-ml font-bold shadow-xs">Mercado Livre</span>
          ) : null
        )}
      </div>

      {/* Container da Imagem HD */}
      <div className="relative w-full h-48 bg-white p-4 flex items-center justify-center overflow-hidden border-b border-slate-100 group-hover:bg-orange-50/20 transition-colors">
        <Image
          src={offer.image_url}
          alt={offer.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-2 group-hover:scale-110 transition-transform duration-300 ease-out"
        />
        {offer.free_shipping && (
          <span className="absolute bottom-2 left-2.5 badge-shipping shadow-xs">
            ✓ Frete Grátis
          </span>
        )}
      </div>

      {/* Detalhes do Produto */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {offer.category && (
            <span className="text-[10px] font-black text-[#FF5500] uppercase tracking-wider block mb-1">
              {offer.category.name}
            </span>
          )}

          <Link href={`/o/${offer.slug}`} className="block">
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#FF5500] transition-colors line-clamp-2 min-h-[2.5rem] mb-2 leading-snug">
              {offer.title}
            </h3>
          </Link>
        </div>

        {/* Preço e CTA */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="price-current">
              R$ {offer.current_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            {offer.previous_price && offer.previous_price > offer.current_price && (
              <span className="price-previous">
                R$ {offer.previous_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          {offer.coupon_code && (
            <div className="badge-coupon mb-3 w-full justify-center py-1">
              <span>Cupom:</span>
              <strong className="font-mono text-xs">{offer.coupon_code}</strong>
            </div>
          )}

          <a
            href={`/go/${offer.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-offer-cta"
          >
            <span>PEGAR OFERTA</span>
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
    </div>
  );
};
