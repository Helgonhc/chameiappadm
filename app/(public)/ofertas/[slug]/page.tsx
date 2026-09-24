import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { OfferService } from '../../../../lib/services/offer.service';
import { calculateDiscount } from '../../../../lib/utils/offer-helpers';
import { OfferCardCompact } from '../../../../components/offers/OfferCardCompact';
import { SITE_CONFIG } from '../../../../lib/config/site.config';

interface OfferDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: OfferDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const offer = await OfferService.getOfferBySlug(slug);

  if (!offer) {
    return {
      title: 'Oferta não encontrada | ChameiApp',
    };
  }

  const canonicalUrl = `${SITE_CONFIG.domain}/o/${offer.slug}`;

  return {
    title: `${offer.title} | ChameiApp`,
    description: offer.description || `Confira a oferta de ${offer.title} no ChameiApp.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${offer.title} — R$ ${offer.current_price.toFixed(2)}`,
      description: offer.description || `Preço verificado no ChameiApp.`,
      url: canonicalUrl,
      images: [
        {
          url: offer.image_url,
          width: 800,
          height: 600,
          alt: offer.title,
        },
      ],
    },
  };
}

export default async function OfferDetailPage({ params }: OfferDetailPageProps) {
  const { slug } = await params;
  const offer = await OfferService.getOfferBySlug(slug);

  if (!offer) {
    notFound();
  }

  const discountPercent = calculateDiscount(offer.current_price, offer.previous_price);
  const allOffers = await OfferService.getPublishedOffers();
  const relatedOffers = allOffers
    .filter((o) => o.id !== offer.id && (o.category_id === offer.category_id || o.merchant_id === offer.merchant_id))
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: offer.title,
    image: [offer.image_url],
    description: offer.description || undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      price: offer.current_price,
      url: `${SITE_CONFIG.domain}/go/${offer.id}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-8 py-2">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/ofertas" className="hover:underline">Ofertas</Link>
          <span>/</span>
          {offer.category && (
            <>
              <Link href={`/categoria/${offer.category.slug}`} className="hover:underline">
                {offer.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="font-semibold text-slate-900 truncate max-w-xs md:max-w-md">
            {offer.title}
          </span>
        </nav>

        {/* Card Principal de Detalhes da Oferta */}
        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            
            {/* Lado Esquerdo: Imagem */}
            <div className="relative w-full h-72 md:h-96 bg-slate-50 rounded p-6 flex items-center justify-center border border-slate-100 overflow-hidden">
              <Image
                src={offer.image_url}
                alt={offer.title}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-contain hover:scale-105 transition-transform duration-300"
                priority
              />
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                {offer.merchant && (
                  <span className="badge-merchant-amazon font-bold shadow-xs">
                    {offer.merchant.name}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="badge-discount shadow-xs font-bold">
                    ↓ {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Lado Direito: Informações e Ação */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {offer.category && (
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Categoria: {offer.category.name}
                    </span>
                  )}
                  {offer.free_shipping && (
                    <span className="badge-shipping">
                      ✓ Frete Grátis
                    </span>
                  )}
                </div>

                <h1 className="text-xl md:text-3xl font-black text-slate-900 leading-snug">
                  {offer.title}
                </h1>

                {offer.description && (
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded border border-slate-100">
                    {offer.description}
                  </p>
                )}
              </div>

              <div className="space-y-6 pt-4 border-t border-slate-200">
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Preço no ChameiApp:
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl md:text-4xl font-mono font-black text-slate-900">
                      R$ {offer.current_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    {offer.previous_price && offer.previous_price > offer.current_price && (
                      <span className="price-previous text-lg">
                        R$ {offer.previous_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                </div>

                {offer.coupon_code && (
                  <div className="badge-coupon py-3 px-4 text-sm w-full justify-between">
                    <span>Cupom ativo na loja:</span>
                    <strong className="font-mono text-base">{offer.coupon_code}</strong>
                  </div>
                )}

                {/* Botão de Redirecionamento Seguro */}
                <div className="space-y-2">
                  <a
                    href={`/go/${offer.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-offer-cta w-full text-center text-base font-extrabold justify-center py-3.5 rounded shadow-md"
                  >
                    <span>IR PARA A LOJA ({offer.merchant?.name || 'PARCEIRO'})</span>
                    <svg
                      width="20"
                      height="20"
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
                  <p className="text-[11px] text-slate-400 text-center">
                    Link de direcionamento seguro com tracking oficial Amazon Associados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ofertas Relacionadas */}
        {relatedOffers.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Outras ofertas em destaque
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedOffers.map((rel) => (
                <OfferCardCompact key={rel.id} offer={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
