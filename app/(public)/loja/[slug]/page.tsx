import React from 'react';
import { notFound } from 'next/navigation';
import { OfferService } from '../../../../lib/services/offer.service';
import { MerchantService } from '../../../../lib/services/merchant.service';
import { OfferGrid } from '../../../../components/offers/OfferGrid';

export const revalidate = 60;

interface MerchantPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function MerchantPage({ params }: MerchantPageProps) {
  const { slug } = await params;
  const merchants = await MerchantService.getMerchants();
  const merchant = merchants.find((m) => m.slug === slug);

  if (!merchant) {
    notFound();
  }

  const offers = await OfferService.getPublishedOffers({
    merchantSlug: slug,
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-[var(--color-neutral-200)] shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[var(--color-neutral-500)] uppercase tracking-wider">
            Comerciante Oficial
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-[var(--color-neutral-900)]">
            Ofertas {merchant.name}
          </h1>
          <p className="text-xs text-[var(--color-neutral-500)] mt-1">
            Preços verificados direcionando diretamente para {merchant.website_url}
          </p>
        </div>

        <a
          href={merchant.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-chamei-primary text-xs font-bold shrink-0"
        >
          Visitar {merchant.name} →
        </a>
      </div>

      <OfferGrid
        offers={offers}
        emptyTitle={`Nenhuma oferta encontrada para ${merchant.name}`}
        emptyDescription="No momento não temos cupons ativos para esta loja parceira."
      />
    </div>
  );
}
