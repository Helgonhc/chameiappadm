import React from 'react';
import Link from 'next/link';
import { OfferService } from '../../lib/services/offer.service';
import { MerchantService } from '../../lib/services/merchant.service';
import { OfferCardFeatured } from '../../components/offers/OfferCardFeatured';
import { OfferGrid } from '../../components/offers/OfferGrid';
import { ChameiMarker } from '../../components/ui/ChameiMarker';
import { SITE_CONFIG } from '../../lib/config/site.config';

export const revalidate = 60; // SSR Cache Revalidation em 60s

export default async function HomePage() {
  const [featuredOffer, allOffers, merchants] = await Promise.all([
    OfferService.getFeaturedOffer(),
    OfferService.getPublishedOffers(),
    MerchantService.getMerchants(),
  ]);

  const standardOffers = featuredOffer
    ? allOffers.filter((o) => o.id !== featuredOffer.id)
    : allOffers;

  return (
    <div className="space-y-8">
      {/* Top Banner da Vitrine de Ofertas */}
      <section className="bg-gradient-to-r from-[var(--color-brand-primary-900)] to-[var(--color-brand-primary-700)] text-white rounded-xl p-6 md:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[var(--color-brand-primary-600)]">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <ChameiMarker size="sm" label="CURADORIA DE OFERTAS" className="bg-[var(--color-brand-accent-500)]" />
            <span className="text-xs text-emerald-200 font-medium">Preços verificados diariamente</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
            Descontos e Oportunidades Verificadas
          </h1>
          <p className="text-xs md:text-sm text-emerald-100/90 leading-relaxed">
            Selecção de produtos com preços reais na Amazon Brasil, Mercado Livre e principais lojas. Sem ofertas maquiadas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {merchants.map((m) => (
            <Link
              key={m.id}
              href={`/loja/${m.slug}`}
              className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors border border-white/10"
            >
              Ofertas {m.name} →
            </Link>
          ))}
        </div>
      </section>

      {/* Oferta Destaque Principal (Se cadastrada no Supabase) */}
      {featuredOffer && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-[var(--color-neutral-900)] flex items-center gap-2">
              <span className="text-[var(--color-brand-accent-500)]">★</span> Oferta em Destaque
            </h2>
          </div>
          <OfferCardFeatured offer={featuredOffer} />
        </section>
      )}

      {/* Vitrine Principal de Produtos */}
      <section>
        <div className="flex items-center justify-between mb-4 border-b border-[var(--color-neutral-200)] pb-3">
          <div>
            <h2 className="text-xl font-black text-[var(--color-neutral-900)]">
              Últimas Ofertas Publicadas
            </h2>
            <p className="text-xs text-[var(--color-neutral-500)]">
              Produtos cadastrados com links diretos e seguros
            </p>
          </div>
          <Link
            href="/ofertas"
            className="text-xs font-bold text-[var(--color-brand-primary-700)] hover:underline flex items-center gap-1"
          >
            Ver catálogo completo ({allOffers.length}) →
          </Link>
        </div>

        <OfferGrid
          offers={standardOffers}
          emptyTitle="Nenhuma oferta cadastrada no momento"
          emptyDescription="Estamos buscando novas oportunidades verificadas para publicar em breve."
        />
      </section>

      {/* Nota de Isenção e Transparência */}
      <div className="bg-neutral-100 p-4 rounded-lg border border-neutral-200 text-xs text-[var(--color-neutral-700)] flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
        <p>
          <strong>Transparência {SITE_CONFIG.name}:</strong> Os valores e estoques exibidos são de responsabilidade das lojas oficiais e podem variar a qualquer momento.
        </p>
        <Link href="/divulgacao-de-afiliados" className="font-bold text-[var(--color-brand-primary-700)] hover:underline shrink-0">
          Leia nossa política de afiliados →
        </Link>
      </div>
    </div>
  );
}
