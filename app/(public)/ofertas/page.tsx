import React from 'react';
import { OfferService } from '../../../lib/services/offer.service';
import { MerchantService } from '../../../lib/services/merchant.service';
import { OfferGrid } from '../../../components/offers/OfferGrid';
import Link from 'next/link';

export const revalidate = 30;

interface CatalogPageProps {
  searchParams: Promise<{
    q?: string;
    cat?: string;
    loja?: string;
    sort?: 'recent' | 'price_asc' | 'price_desc';
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.q || '';
  const categorySlug = resolvedParams.cat || '';
  const merchantSlug = resolvedParams.loja || '';
  const sortBy = resolvedParams.sort || 'recent';

  const [offers, categories, merchants] = await Promise.all([
    OfferService.getPublishedOffers({
      searchQuery,
      categorySlug,
      merchantSlug,
      sortBy,
    }),
    MerchantService.getCategories(),
    MerchantService.getMerchants(),
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página de Ofertas */}
      <div className="bg-white p-6 rounded-xl border border-[var(--color-neutral-200)] shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-neutral-200)] pb-4">
          <div>
            <h1 className="text-2xl font-black text-[var(--color-neutral-900)]">
              {searchQuery
                ? `Resultados para "${searchQuery}"`
                : 'Catálogo Geral de Ofertas'}
            </h1>
            <p className="text-xs text-[var(--color-neutral-500)] mt-1">
              {offers.length} {offers.length === 1 ? 'oferta encontrada' : 'ofertas encontradas'} com preço verificado
            </p>
          </div>

          {/* Filtro de Ordenação */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--color-neutral-700)]">Ordenar por:</span>
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg text-xs font-semibold">
              <Link
                href={`/ofertas?${new URLSearchParams({ ...resolvedParams, sort: 'recent' })}`}
                className={`px-2.5 py-1 rounded transition-colors ${
                  sortBy === 'recent'
                    ? 'bg-white text-[var(--color-brand-primary-700)] shadow-xs font-bold'
                    : 'text-[var(--color-neutral-700)] hover:text-black'
                }`}
              >
                Mais Recentes
              </Link>
              <Link
                href={`/ofertas?${new URLSearchParams({ ...resolvedParams, sort: 'price_asc' })}`}
                className={`px-2.5 py-1 rounded transition-colors ${
                  sortBy === 'price_asc'
                    ? 'bg-white text-[var(--color-brand-primary-700)] shadow-xs font-bold'
                    : 'text-[var(--color-neutral-700)] hover:text-black'
                }`}
              >
                Menor Preço
              </Link>
              <Link
                href={`/ofertas?${new URLSearchParams({ ...resolvedParams, sort: 'price_desc' })}`}
                className={`px-2.5 py-1 rounded transition-colors ${
                  sortBy === 'price_desc'
                    ? 'bg-white text-[var(--color-brand-primary-700)] shadow-xs font-bold'
                    : 'text-[var(--color-neutral-700)] hover:text-black'
                }`}
              >
                Maior Preço
              </Link>
            </div>
          </div>
        </div>

        {/* Filtros Ativos e Limpeza */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-[var(--color-neutral-700)]">Filtrar por loja:</span>
          <Link
            href="/ofertas"
            className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
              !merchantSlug
                ? 'bg-[var(--color-brand-primary-700)] text-white'
                : 'bg-neutral-100 text-[var(--color-neutral-700)] hover:bg-neutral-200'
            }`}
          >
            Todas as Lojas
          </Link>
          {merchants.map((m) => (
            <Link
              key={m.id}
              href={`/ofertas?${new URLSearchParams({ ...resolvedParams, loja: m.slug })}`}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                merchantSlug === m.slug
                  ? 'bg-[var(--color-brand-primary-700)] text-white'
                  : 'bg-neutral-100 text-[var(--color-neutral-700)] hover:bg-neutral-200'
              }`}
            >
              {m.name}
            </Link>
          ))}

          {(searchQuery || categorySlug || merchantSlug) && (
            <Link
              href="/ofertas"
              className="ml-auto text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
            >
              ✕ Limpar filtros
            </Link>
          )}
        </div>
      </div>

      {/* Grade de Ofertas */}
      <OfferGrid
        offers={offers}
        emptyTitle={searchQuery ? `Nenhuma oferta para "${searchQuery}"` : 'Nenhuma oferta encontrada'}
        emptyDescription="Tente buscar por termos mais genéricos ou selecionar outra categoria."
      />
    </div>
  );
}
