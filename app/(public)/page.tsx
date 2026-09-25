import React from 'react';
import Link from 'next/link';
import { OfferService } from '../../lib/services/offer.service';
import { MerchantService } from '../../lib/services/merchant.service';
import { OfferCardFeatured } from '../../components/offers/OfferCardFeatured';
import { OfferGrid } from '../../components/offers/OfferGrid';
import { HeroBanner } from '../../components/home/HeroBanner';
import { CategoryGrid } from '../../components/home/CategoryGrid';

export const revalidate = 60; // SSR Cache Revalidation em 60s

export default async function HomePage() {
  const [featuredOffer, allOffers, categories] = await Promise.all([
    OfferService.getFeaturedOffer(),
    OfferService.getPublishedOffers(),
    MerchantService.getCategories(),
  ]);

  const standardOffers = featuredOffer
    ? allOffers.filter((o) => o.id !== featuredOffer.id)
    : allOffers;

  return (
    <div className="space-y-8 py-4">

      {/* Hero Banner Vibrante com Busca em Tempo Real */}
      <HeroBanner />

      {/* Grid de 24 Categorias — Réplica Estilizada de Capturar.JPG */}
      <CategoryGrid categories={categories} />

      {/* Oferta Destaque Principal do Dia */}
      {featuredOffer && (
        <section className="my-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5500] animate-ping" />
              Super Destaque do Dia
            </h2>
            <span className="text-xs font-bold text-[#FF5500] bg-orange-100 px-2.5 py-1 rounded-full">
              Maior Desconto
            </span>
          </div>
          <OfferCardFeatured offer={featuredOffer} />
        </section>
      )}

      {/* Vitrine Direta de Ofertas */}
      <section className="my-8">
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>🔥</span>
              Ofertas em Alta no Brasil
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium">
              Links testados e atualizados com frete grátis e cupons ativos
            </p>
          </div>
          {allOffers.length > 0 && (
            <Link
              href="/ofertas"
              className="text-xs sm:text-sm font-extrabold text-[#FF5500] hover:text-[#E04B00] hover:underline flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200 transition-colors"
            >
              Ver todas ({allOffers.length}) →
            </Link>
          )}
        </div>

        <OfferGrid
          offers={standardOffers}
          emptyTitle="Nenhuma oferta publicada no momento"
          emptyDescription="As ofertas cadastradas no painel admin aparecerão aqui em tempo real."
        />
      </section>

    </div>
  );
}
