import React from 'react';
import Link from 'next/link';
import { OfferService } from '../../lib/services/offer.service';
import { MerchantService } from '../../lib/services/merchant.service';
import { OfferCardFeatured } from '../../components/offers/OfferCardFeatured';
import { OfferGrid } from '../../components/offers/OfferGrid';
import { MarkerPrecim } from '../../components/ui/MarkerPrecim';

export const revalidate = 60; // SSR Cache Revalidation every 60 seconds

export default async function HomePage() {
  const [featuredOffer, allOffers, merchants] = await Promise.all([
    OfferService.getFeaturedOffer(),
    OfferService.getPublishedOffers(),
    MerchantService.getMerchants(),
  ]);

  // Remove o featured da lista geral para não duplicar no grid
  const standardOffers = featuredOffer
    ? allOffers.filter((o) => o.id !== featuredOffer.id)
    : allOffers;

  return (
    <div className="space-y-8">
      {/* Banner Editorial de Entrada */}
      <section className="bg-gradient-to-r from-[var(--color-brand-primary-900)] to-[var(--color-brand-primary-700)] text-white rounded-xl p-6 md:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[var(--color-brand-primary-600)]">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <MarkerPrecim size="sm" label="CURADORIA VERIFICADA" className="bg-[var(--color-brand-accent-500)]" />
            <span className="text-xs text-emerald-200 font-medium">Atualizado diariamente</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
            &quot;Uai, achamos um preço bão.&quot;
          </h1>
          <p className="text-sm md:text-base text-emerald-100/90 leading-relaxed">
            Oportunidades de compra reais selecionadas manualmente na Amazon, Mercado Livre e principais lojas. Sem pegadinhas nem descontos falsos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {merchants.map((m) => (
            <Link
              key={m.id}
              href={`/loja/${m.slug}`}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors border border-white/10"
            >
              Ofertas {m.name} →
            </Link>
          ))}
        </div>
      </section>

      {/* Oferta Destaque Principal */}
      {featuredOffer && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-[var(--color-neutral-900)] flex items-center gap-2">
              <span className="text-[var(--color-brand-accent-500)]">★</span> Destaque Principal
            </h2>
          </div>
          <OfferCardFeatured offer={featuredOffer} />
        </section>
      )}

      {/* Vitrine Geral de Ofertas */}
      <section>
        <div className="flex items-center justify-between mb-4 border-b border-[var(--color-neutral-200)] pb-3">
          <div>
            <h2 className="text-xl font-black text-[var(--color-neutral-900)]">
              Últimas Ofertas Publicadas
            </h2>
            <p className="text-xs text-[var(--color-neutral-500)]">
              Confira as oportunidades mais recentes com preços verificados
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
          emptyTitle="Nenhuma oferta cadastrada ainda"
          emptyDescription="Estamos buscando novas ofertas reais para você neste momento."
        />
      </section>

      {/* Bloco de Transparência e Explicação Didática */}
      <section className="bg-white rounded-xl p-6 md:p-8 border border-[var(--color-neutral-200)] shadow-subtle grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[var(--color-brand-primary-700)] flex items-center justify-center font-black text-lg">
            1
          </div>
          <h3 className="font-bold text-base text-[var(--color-neutral-900)]">
            Curadoria Manual
          </h3>
          <p className="text-xs text-[var(--color-neutral-700)] leading-relaxed">
            Monitoramos e verificamos os preços reais nas grandes lojas online para garantir que a oportunidade é de fato vantajosa.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-[var(--color-brand-accent-600)] flex items-center justify-center font-black text-lg">
            2
          </div>
          <h3 className="font-bold text-base text-[var(--color-neutral-900)]">
            Redirecionamento Seguro
          </h3>
          <p className="text-xs text-[var(--color-neutral-700)] leading-relaxed">
            Ao clicar em &quot;Ver oferta na loja&quot;, você é levado diretamente para o produto oficial na Amazon ou Mercado Livre.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-black text-lg">
            3
          </div>
          <h3 className="font-bold text-base text-[var(--color-neutral-900)]">
            Sem Custos Adicionais
          </h3>
          <p className="text-xs text-[var(--color-neutral-700)] leading-relaxed">
            Você paga exatamente o valor anunciado na loja oficial. Podemos receber uma pequena comissão sem que você pague um centavo a mais.
          </p>
        </div>
      </section>
    </div>
  );
}
