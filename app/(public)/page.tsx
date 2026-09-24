import React from 'react';
import Link from 'next/link';
import { OfferService } from '../../lib/services/offer.service';
import { OfferCardFeatured } from '../../components/offers/OfferCardFeatured';
import { OfferGrid } from '../../components/offers/OfferGrid';

export const revalidate = 60; // SSR Cache Revalidation em 60s

export default async function HomePage() {
  const [featuredOffer, allOffers] = await Promise.all([
    OfferService.getFeaturedOffer(),
    OfferService.getPublishedOffers(),
  ]);

  const standardOffers = featuredOffer
    ? allOffers.filter((o) => o.id !== featuredOffer.id)
    : allOffers;

  return (
    <div className="space-y-6 py-2">

      {/* Bar de Atalhos por Categoria */}
      <section className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Filtrar:</span>
        <Link
          href="/ofertas"
          className="px-3 py-1.5 rounded bg-slate-900 text-white text-xs font-bold shrink-0 hover:bg-slate-800 transition-colors"
        >
          🔥 Todas as Ofertas ({allOffers.length})
        </Link>
        <Link
          href="/categoria/tecnologia"
          className="px-3 py-1.5 rounded bg-white border border-slate-200 text-slate-800 text-xs font-bold shrink-0 hover:border-slate-400 transition-colors"
        >
          💻 Tecnologia
        </Link>
        <Link
          href="/categoria/ferramentas"
          className="px-3 py-1.5 rounded bg-white border border-slate-200 text-slate-800 text-xs font-bold shrink-0 hover:border-slate-400 transition-colors"
        >
          🛠️ Ferramentas
        </Link>
        <Link
          href="/categoria/casa-e-cozinha"
          className="px-3 py-1.5 rounded bg-white border border-slate-200 text-slate-800 text-xs font-bold shrink-0 hover:border-slate-400 transition-colors"
        >
          🏠 Casa & Cozinha
        </Link>
      </section>

      {/* Oferta Destaque Principal (Se cadastrada) */}
      {featuredOffer && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--color-signal-primary)]"></span>
              Destaque de Hoje
            </h2>
          </div>
          <OfferCardFeatured offer={featuredOffer} />
        </section>
      )}

      {/* Vitrine Direta de Ofertas */}
      <section>
        <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Ofertas em Destaque
            </h2>
          </div>
          {allOffers.length > 0 && (
            <Link
              href="/ofertas"
              className="text-xs font-bold text-[var(--color-signal-primary)] hover:underline flex items-center gap-1"
            >
              Ver todas ({allOffers.length}) →
            </Link>
          )}
        </div>

        <OfferGrid
          offers={standardOffers}
          emptyTitle="Nenhuma oferta publicada no momento"
          emptyDescription="As ofertas aparecerão aqui assim que forem publicadas."
        />
      </section>

    </div>
  );
}
