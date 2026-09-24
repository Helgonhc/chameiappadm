import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { OfferService } from '../../../../lib/services/offer.service';
import { ChameiMarker } from '../../../../components/ui/ChameiMarker';
import { PriceTag } from '../../../../components/ui/PriceTag';
import { CopyCouponButton } from '../../../../components/offers/CopyCouponButton';
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
      title: 'Oferta não encontrada',
    };
  }

  const canonicalUrl = `${SITE_CONFIG.domain}/ofertas/${offer.slug}`;

  return {
    title: `${offer.title} | ${SITE_CONFIG.name}`,
    description: offer.description || `Confira a oferta de ${offer.title} no ${SITE_CONFIG.name}.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${offer.title} — R$ ${offer.current_price.toFixed(2)}`,
      description: offer.description || `Preço verificado no ${SITE_CONFIG.name}.`,
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

  const allOffers = await OfferService.getPublishedOffers();
  const relatedOffers = allOffers
    .filter((o) => o.id !== offer.id && (o.category_id === offer.category_id || o.merchant_id === offer.merchant_id))
    .slice(0, 4);

  // JSON-LD Dados Estruturados Estritos (Apenas dados reais existentes)
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

      <div className="space-y-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-[var(--color-neutral-500)] flex items-center gap-2">
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
          <span className="font-semibold text-[var(--color-neutral-900)] truncate max-w-xs md:max-w-md">
            {offer.title}
          </span>
        </nav>

        {/* Card Principal de Detalhe */}
        <div className="bg-white rounded-xl border border-[var(--color-neutral-200)] shadow-card overflow-hidden p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            
            {/* Lado Esquerdo: Imagem */}
            <div className="relative w-full h-72 md:h-96 bg-neutral-50 rounded-lg p-6 flex items-center justify-center border border-neutral-100 overflow-hidden">
              <Image
                src={offer.image_url}
                alt={offer.title}
                fill
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-contain hover:scale-105 transition-transform duration-300"
                priority
              />
              <div className="absolute top-3 left-3 z-10">
                <ChameiMarker size="md" label="OFERTA VERIFICADA" />
              </div>
            </div>

            {/* Lado Direito: Informações e CTA */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {offer.merchant && (
                    <span className="text-xs font-bold text-[var(--color-neutral-700)] bg-neutral-100 px-3 py-1 rounded">
                      Loja: {offer.merchant.name}
                    </span>
                  )}
                  {offer.category && (
                    <span className="text-xs font-medium text-[var(--color-brand-primary-700)] bg-emerald-50 px-3 py-1 rounded">
                      Categoria: {offer.category.name}
                    </span>
                  )}
                  {offer.free_shipping && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded">
                      ✓ Frete Grátis
                    </span>
                  )}
                </div>

                <h1 className="text-xl md:text-3xl font-black text-[var(--color-neutral-900)] leading-snug">
                  {offer.title}
                </h1>

                {offer.description && (
                  <p className="text-sm text-[var(--color-neutral-700)] leading-relaxed bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                    {offer.description}
                  </p>
                )}
              </div>

              <div className="space-y-6 pt-4 border-t border-[var(--color-neutral-200)]">
                <div>
                  <span className="text-xs text-[var(--color-neutral-500)] font-medium block mb-1">
                    Preço verificado no portal:
                  </span>
                  <PriceTag
                    currentPrice={offer.current_price}
                    previousPrice={offer.previous_price}
                    size="xl"
                  />
                </div>

                {offer.coupon_code && (
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg space-y-2">
                    <span className="text-xs font-bold text-purple-900 block">
                      🎟️ Cupom de desconto ativo:
                    </span>
                    <CopyCouponButton code={offer.coupon_code} />
                  </div>
                )}

                {/* Botão de Redirecionamento Seguro */}
                <div className="space-y-2">
                  <a
                    href={`/go/${offer.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-chamei-accent w-full text-center text-base font-extrabold justify-center py-4 rounded-lg shadow-md"
                  >
                    <span>Ir para a loja ({offer.merchant?.name || 'Parceiro'})</span>
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
                  <p className="text-[11px] text-[var(--color-neutral-500)] text-center">
                    Você será redirecionado para o site oficial da loja com segurança.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ofertas Relacionadas */}
        {relatedOffers.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[var(--color-neutral-900)]">
              Outras ofertas selecionadas para você
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
