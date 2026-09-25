import React from 'react';
import Link from 'next/link';
import { OfferService } from '../../../lib/services/offer.service';
import { MerchantService } from '../../../lib/services/merchant.service';
import { PriceTag } from '../../../components/ui/PriceTag';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [allOffers, categories, merchants] = await Promise.all([
    OfferService.getAllOffersForAdmin(),
    MerchantService.getCategories(),
    MerchantService.getMerchants(),
  ]);

  const activeCount = allOffers.filter((o) => o.status === 'published').length;
  const draftCount = allOffers.filter((o) => o.status === 'draft').length;
  const featuredCount = allOffers.filter((o) => o.featured).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-md border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            Painel Geral de Ofertas
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestão do catálogo, ofertas em destaque e verificação de preços
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/ofertas" className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded hover:bg-slate-800 transition-colors">
            🛍️ Gerenciar Ofertas & Links
          </Link>
          <Link href="/admin/ofertas/nova" className="px-4 py-2 bg-[var(--color-signal-primary)] text-white font-bold text-xs rounded hover:bg-[var(--color-signal-hover)] transition-colors">
            + Nova Oferta Real
          </Link>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-md border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ofertas Ativas</span>
          <p className="text-3xl font-black text-emerald-600">{activeCount}</p>
          <span className="text-[10px] text-emerald-700 font-semibold">✓ Visíveis no portal ({draftCount} rascunhos)</span>
        </div>

        <div className="bg-white p-5 rounded-md border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ofertas Destaque</span>
          <p className="text-3xl font-black text-amber-600">{featuredCount}</p>
          <span className="text-[10px] text-amber-700 font-semibold">★ Banner Principal Hero</span>
        </div>

        <div className="bg-white p-5 rounded-md border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Categorias Ativas</span>
          <p className="text-3xl font-black text-slate-900">{categories.length}</p>
          <span className="text-[10px] text-slate-500">Mapeadas no menu</span>
        </div>

        <div className="bg-white p-5 rounded-md border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Lojas Parceiras</span>
          <p className="text-3xl font-black text-purple-700">{merchants.length}</p>
          <span className="text-[10px] text-purple-600 font-semibold">Amazon & Mercado Livre</span>
        </div>
      </div>

      {/* Tabela Resumo */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900">
            Últimas Ofertas Cadastradas ({allOffers.length})
          </h3>
          <Link
            href="/admin/ofertas"
            className="text-xs font-bold text-slate-900 hover:text-[var(--color-signal-primary)] hover:underline"
          >
            Ver Todas e Editar Links →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Produto</th>
                <th className="p-3">Loja</th>
                <th className="p-3">Preço</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allOffers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                    Nenhuma oferta cadastrada no banco de dados.
                  </td>
                </tr>
              ) : (
                allOffers.slice(0, 10).map((offer) => (
                  <tr key={offer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-900 max-w-xs truncate">
                      {offer.title}
                    </td>
                    <td className="p-3">
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">
                        {offer.merchant?.name || 'Mercado Livre / Loja'}
                      </span>
                    </td>
                    <td className="p-3">
                      <PriceTag currentPrice={offer.current_price} size="sm" showDiscountBadge={false} />
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          offer.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {offer.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <Link
                        href="/admin/ofertas"
                        className="text-xs font-bold text-slate-900 hover:text-[var(--color-signal-primary)] hover:underline"
                      >
                        Gerenciar / Editar
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
