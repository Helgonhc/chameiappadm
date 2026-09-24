import React from 'react';
import Link from 'next/link';
import { OfferService } from '../../../lib/services/offer.service';
import { MerchantService } from '../../../lib/services/merchant.service';
import { PriceTag } from '../../../components/ui/PriceTag';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [offers, categories, merchants] = await Promise.all([
    OfferService.getPublishedOffers(),
    MerchantService.getCategories(),
    MerchantService.getMerchants(),
  ]);

  const activeCount = offers.filter((o) => o.status === 'published').length;
  const featuredCount = offers.filter((o) => o.featured).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-neutral-200 shadow-subtle">
        <div>
          <h1 className="text-2xl font-black text-neutral-900">
            Painel Geral de Ofertas
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Gestão do catálogo e verificação de preços
          </p>
        </div>

        <Link href="/admin/ofertas/nova" className="btn-chamei-accent text-xs font-bold">
          + Cadastrar Nova Oferta Real
        </Link>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-subtle space-y-1">
          <span className="text-xs font-bold text-neutral-500 uppercase">Ofertas Ativas</span>
          <p className="text-3xl font-black text-[var(--color-brand-primary-700)]">{activeCount}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">✓ Visíveis no portal</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-subtle space-y-1">
          <span className="text-xs font-bold text-neutral-500 uppercase">Ofertas em Destaque</span>
          <p className="text-3xl font-black text-[var(--color-brand-accent-600)]">{featuredCount}</p>
          <span className="text-[10px] text-amber-600 font-semibold">★ Banner Principal Hero</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-subtle space-y-1">
          <span className="text-xs font-bold text-neutral-500 uppercase">Categorias Ativas</span>
          <p className="text-3xl font-black text-neutral-900">{categories.length}</p>
          <span className="text-[10px] text-neutral-500">Mapeadas no menu</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-subtle space-y-1">
          <span className="text-xs font-bold text-neutral-500 uppercase">Lojas Parceiras</span>
          <p className="text-3xl font-black text-purple-700">{merchants.length}</p>
          <span className="text-[10px] text-purple-600 font-semibold">Amazon & Mercado Livre</span>
        </div>
      </div>

      {/* Tabela de Gestão de Ofertas */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-neutral-900">
            Ofertas Cadastradas ({offers.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-700">
            <thead className="bg-neutral-50 text-neutral-500 uppercase font-bold border-b border-neutral-200">
              <tr>
                <th className="p-3">Produto</th>
                <th className="p-3">Loja</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Preço</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {offers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500 font-medium">
                    Nenhuma oferta cadastrada no banco de dados.
                  </td>
                </tr>
              ) : (
                offers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-3 font-bold text-neutral-900 max-w-xs truncate">
                      {offer.title}
                    </td>
                    <td className="p-3">
                      <span className="bg-neutral-100 px-2 py-0.5 rounded font-semibold">
                        {offer.merchant?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="p-3">
                      {offer.category?.name || 'N/A'}
                    </td>
                    <td className="p-3">
                      <PriceTag currentPrice={offer.current_price} size="sm" showDiscountBadge={false} />
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          offer.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {offer.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <Link
                        href={`/ofertas/${offer.slug}`}
                        target="_blank"
                        className="text-xs font-bold text-[var(--color-brand-primary-700)] hover:underline"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
