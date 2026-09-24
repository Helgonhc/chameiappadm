import React from 'react';
import { notFound } from 'next/navigation';
import { OfferService } from '../../../../lib/services/offer.service';
import { MerchantService } from '../../../../lib/services/merchant.service';
import { OfferGrid } from '../../../../components/offers/OfferGrid';

export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = await MerchantService.getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const offers = await OfferService.getPublishedOffers({
    categorySlug: slug,
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-[var(--color-neutral-200)] shadow-subtle space-y-2">
        <span className="text-xs font-bold text-[var(--color-brand-primary-700)] uppercase tracking-wider">
          Categoria
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-[var(--color-neutral-900)]">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-sm text-[var(--color-neutral-700)] max-w-2xl">
            {category.description}
          </p>
        )}
      </div>

      <OfferGrid
        offers={offers}
        emptyTitle={`Nenhuma oferta na categoria ${category.name}`}
        emptyDescription="Estamos monitorando novas ofertas para esta categoria. Volte em breve!"
      />
    </div>
  );
}
