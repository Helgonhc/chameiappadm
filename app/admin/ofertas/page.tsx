'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Offer } from '../../../lib/types/database';
import { PriceTag } from '../../../components/ui/PriceTag';
import { AffiliateService } from '../../../lib/services/affiliate.service';

export default function AdminOfertasPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal de edição rápida
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [generatingAiModal, setGeneratingAiModal] = useState(false);
  const [modalAiSocial, setModalAiSocial] = useState<string | null>(null);

  // Ferramenta de conversão rápida de link
  const [testUrl, setTestUrl] = useState('');
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [merchantDetected, setMerchantDetected] = useState<string | null>(null);

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/offers?status=${statusFilter}&query=${encodeURIComponent(searchQuery)}`);
      const json = await res.json();
      if (json.success) {
        setOffers(json.offers || []);
      }
    } catch {
      setFeedback({ message: 'Erro ao carregar ofertas.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleToggleStatus = async (offer: Offer, newStatus: 'published' | 'draft' | 'archived') => {
    try {
      const res = await fetch('/api/admin/offers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: offer.id, action: 'toggle-status', status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setFeedback({ message: `Status da oferta alterado para "${newStatus.toUpperCase()}".`, type: 'success' });
        fetchOffers();
      } else {
        setFeedback({ message: json.error || 'Erro ao alterar status.', type: 'error' });
      }
    } catch {
      setFeedback({ message: 'Erro de comunicação ao alterar status.', type: 'error' });
    }
  };

  const handleToggleFeatured = async (offer: Offer) => {
    try {
      const newFeatured = !offer.featured;
      const res = await fetch('/api/admin/offers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: offer.id, action: 'toggle-featured', featured: newFeatured }),
      });
      const json = await res.json();
      if (json.success) {
        setFeedback({
          message: newFeatured ? 'Oferta definida como Destaque Hero!' : 'Destaque removido.',
          type: 'success',
        });
        fetchOffers();
      }
    } catch {
      setFeedback({ message: 'Erro ao alterar destaque.', type: 'error' });
    }
  };

  const handleDeleteOffer = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir a oferta "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/offers?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setFeedback({ message: 'Oferta excluída com sucesso.', type: 'success' });
        fetchOffers();
      } else {
        setFeedback({ message: json.error || 'Erro ao excluir.', type: 'error' });
      }
    } catch {
      setFeedback({ message: 'Erro ao excluir oferta.', type: 'error' });
    }
  };

  const handleGenerateAiInModal = async () => {
    if (!editingOffer) return;
    setGeneratingAiModal(true);

    try {
      const res = await fetch('/api/admin/ai/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingOffer.title,
          currentPrice: editingOffer.current_price,
          previousPrice: editingOffer.previous_price,
          merchantName: editingOffer.merchant?.name,
          categoryName: editingOffer.category?.name,
          couponCode: editingOffer.coupon_code,
          freeShipping: editingOffer.free_shipping,
          rawDescription: editingOffer.description,
        }),
      });

      const json = await res.json();
      if (json.success && json.copy) {
        setEditingOffer({
          ...editingOffer,
          title: json.copy.optimizedTitle || editingOffer.title,
          description: json.copy.description || editingOffer.description,
        });
        setModalAiSocial(json.copy.socialMessage);
      }
    } catch {
      setFeedback({ message: 'Erro ao solicitar IA da NVIDIA.', type: 'error' });
    } finally {
      setGeneratingAiModal(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;

    setSavingEdit(true);
    try {
      const res = await fetch('/api/admin/offers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingOffer.id,
          title: editingOffer.title,
          description: editingOffer.description,
          current_price: editingOffer.current_price,
          previous_price: editingOffer.previous_price,
          coupon_code: editingOffer.coupon_code,
          free_shipping: editingOffer.free_shipping,
          destination_url: editingOffer.destination_url,
          affiliate_url: editingOffer.affiliate_url,
          status: editingOffer.status,
          featured: editingOffer.featured,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setFeedback({ message: 'Oferta atualizada com sucesso!', type: 'success' });
        setEditingOffer(null);
        setModalAiSocial(null);
        fetchOffers();
      } else {
        setFeedback({ message: json.error || 'Erro ao salvar alterações.', type: 'error' });
      }
    } catch {
      setFeedback({ message: 'Erro de comunicação ao salvar.', type: 'error' });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleConvertTestUrl = () => {
    if (!testUrl.trim()) return;
    const formatted = AffiliateService.formatAffiliateUrl(testUrl);
    const merchant = AffiliateService.detectMerchant(testUrl);
    setConvertedUrl(formatted);
    setMerchantDetected(merchant?.name || 'Loja Genérica');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setFeedback({ message: `${label} copiado para a área de transferência!`, type: 'success' });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-6 rounded-md border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🛍️</span>
            <h1 className="text-2xl font-black text-slate-900">GERENCIAMENTO DE OFERTAS & LINKS</h1>
          </div>
          <p className="text-xs text-slate-500">
            Controle total do catálogo, otimização com IA da NVIDIA (LLaMA 3.3 70B), links de afiliados e redirecionador `/go/`.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/radar"
            className="px-3.5 py-2 rounded text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            📡 Radar de Ofertas
          </Link>
          <Link
            href="/admin/ofertas/nova"
            className="px-4 py-2 rounded text-xs font-bold bg-[var(--color-signal-primary)] text-white hover:bg-[var(--color-signal-hover)] transition-colors shadow-xs"
          >
            + Cadastrar Nova Oferta
          </Link>
        </div>
      </div>

      {/* Caixa de Ferramenta: Conversor Rápido de Link */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-md shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <h3 className="font-extrabold text-sm uppercase tracking-wider">Conversor Inteligente de Link de Afiliado</h3>
          </div>
          <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded font-mono text-slate-300">Auto-Tag Amazon & ML</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            placeholder="Cole aqui qualquer link da Amazon ou Mercado Livre (ex: https://www.amazon.com.br/dp/...)"
            className="flex-1 bg-slate-950/80 border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[var(--color-signal-primary)]"
          />
          <button
            type="button"
            onClick={handleConvertTestUrl}
            className="px-4 py-2 bg-[var(--color-signal-primary)] text-white font-bold text-xs rounded hover:bg-[var(--color-signal-hover)] transition-colors shrink-0"
          >
            Converter & Injetar Tag
          </button>
        </div>

        {convertedUrl && (
          <div className="mt-3 p-3 bg-slate-950/90 border border-emerald-500/30 rounded space-y-2 text-xs">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span>Loja Detectada: {merchantDetected}</span>
              <span className="text-[10px] text-slate-400">Tag de Afiliado Injetada com Sucesso ✓</span>
            </div>
            <div className="bg-slate-900 p-2 rounded font-mono text-[11px] text-slate-300 break-all select-all">
              {convertedUrl}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => copyToClipboard(convertedUrl, 'Link de Afiliado')}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[11px] transition-colors"
              >
                📋 Copiar Link de Afiliado
              </button>
              <Link
                href={`/admin/ofertas/nova?url=${encodeURIComponent(convertedUrl)}`}
                className="px-3 py-1 bg-white text-slate-900 hover:bg-slate-100 rounded font-bold text-[11px] transition-colors"
              >
                + Criar Oferta com este Link
              </Link>
            </div>
          </div>
        )}
      </div>

      {feedback && (
        <div
          className={`p-3 rounded text-xs font-bold border flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-md border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filtros de Status */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {(['all', 'published', 'draft', 'archived'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors shrink-0 ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all'
                ? 'Todas as Ofertas'
                : st === 'published'
                ? 'Publicadas'
                : st === 'draft'
                ? 'Rascunhos'
                : 'Arquivadas'}
            </button>
          ))}
        </div>

        {/* Busca por Título */}
        <div className="w-full md:w-72 flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título..."
            className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400"
          />
        </div>
      </div>

      {/* Tabela de Ofertas */}
      <div className="bg-white rounded-md border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900">
            Resultados ({offers.length} ofertas encontradas)
          </h3>
          {loading && <span className="text-xs text-slate-400 animate-pulse">Carregando ofertas...</span>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Produto</th>
                <th className="p-3">Loja / Categoria</th>
                <th className="p-3">Preço Atual</th>
                <th className="p-3">Status</th>
                <th className="p-3">Destaque</th>
                <th className="p-3">Links & Redirecionador</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {offers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 font-medium">
                    Nenhuma oferta encontrada para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                offers.map((offer) => {
                  const internalGoUrl = `/go/${offer.id}`;
                  return (
                    <tr key={offer.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Produto */}
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          {offer.image_url ? (
                            <Image
                              src={offer.image_url}
                              alt={offer.title}
                              width={40}
                              height={40}
                              className="w-10 h-10 object-contain p-1 border border-slate-100 rounded bg-white shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs font-bold shrink-0">
                              IMG
                            </div>
                          )}
                          <div className="max-w-xs">
                            <span className="font-bold text-slate-900 line-clamp-1 block">{offer.title}</span>
                            {offer.coupon_code && (
                              <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-amber-100 text-amber-800 font-mono text-[10px] font-bold rounded">
                                Cupom: {offer.coupon_code}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Loja / Categoria */}
                      <td className="p-3">
                        <div className="space-y-0.5">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold text-[10px] block w-fit">
                            {offer.merchant?.name || 'Mercado Livre / Loja'}
                          </span>
                          <span className="text-slate-400 text-[10px] block">
                            {offer.category?.name || 'Geral'}
                          </span>
                        </div>
                      </td>

                      {/* Preço */}
                      <td className="p-3">
                        <PriceTag currentPrice={offer.current_price} previousPrice={offer.previous_price} size="sm" />
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        <select
                          value={offer.status}
                          onChange={(e) =>
                            handleToggleStatus(offer, e.target.value as 'published' | 'draft' | 'archived')
                          }
                          className={`text-[10px] font-bold px-2 py-1 rounded border border-transparent focus:outline-none cursor-pointer ${
                            offer.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 font-extrabold'
                              : offer.status === 'draft'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          <option value="published">PUBLICADA</option>
                          <option value="draft">RASCUNHO</option>
                          <option value="archived">ARQUIVADA</option>
                        </select>
                      </td>

                      {/* Destaque */}
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleFeatured(offer)}
                          title="Alternar Destaque Hero Banner"
                          className={`text-base transition-transform active:scale-95 ${
                            offer.featured ? 'text-amber-500 font-bold scale-110' : 'text-slate-300 hover:text-slate-400'
                          }`}
                        >
                          ★
                        </button>
                      </td>

                      {/* Links & Redirecionador */}
                      <td className="p-3">
                        <div className="flex flex-col gap-1 text-[11px]">
                          <button
                            onClick={() => copyToClipboard(window.location.origin + internalGoUrl, 'Link Interno /go/')}
                            className="text-left font-mono text-slate-600 hover:text-slate-900 hover:underline flex items-center gap-1"
                          >
                            <span>🔗 /go/{offer.id.substring(0, 8)}...</span>
                          </button>
                          <a
                            href={offer.affiliate_url || offer.destination_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-emerald-700 hover:underline truncate max-w-[140px] block"
                            title={offer.affiliate_url || offer.destination_url}
                          >
                            ↗ {offer.affiliate_url ? 'Com Tag de Afiliado' : 'URL Destino'}
                          </a>
                        </div>
                      </td>

                      {/* Ações */}
                      <td className="p-3 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setEditingOffer(offer);
                            setModalAiSocial(null);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded text-[11px] transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteOffer(offer.id, offer.title)}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded text-[11px] transition-colors"
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edição Rápida de Oferta */}
      {editingOffer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-lg text-slate-900">Editar Oferta</h3>
              <button
                onClick={() => {
                  setEditingOffer(null);
                  setModalAiSocial(null);
                }}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Gerador IA NVIDIA no Modal */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-3.5 rounded flex items-center justify-between gap-3 text-xs shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">✨</span>
                <span className="font-bold">IA NVIDIA (LLaMA 3.3 70B): Otimizar título e copy</span>
              </div>
              <button
                type="button"
                onClick={handleGenerateAiInModal}
                disabled={generatingAiModal}
                className="px-3 py-1 bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-[11px] rounded transition-colors disabled:opacity-50 shrink-0"
              >
                {generatingAiModal ? 'Gerando...' : '✨ Gerar Copy'}
              </button>
            </div>

            {modalAiSocial && (
              <div className="p-3 bg-slate-950 text-slate-100 rounded text-xs space-y-1 font-mono">
                <div className="flex items-center justify-between text-purple-300 font-bold font-sans">
                  <span>📱 Post Gerado para WhatsApp:</span>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(modalAiSocial)}
                    className="text-[10px] bg-purple-700 px-2 py-0.5 rounded"
                  >
                    📋 Copiar
                  </button>
                </div>
                <pre className="whitespace-pre-wrap text-[10px] font-sans text-slate-200">{modalAiSocial}</pre>
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título da Oferta</label>
                <input
                  type="text"
                  value={editingOffer.title}
                  onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-600"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição / Destaques</label>
                <textarea
                  rows={3}
                  value={editingOffer.description || ''}
                  onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-600 font-normal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preço Atual (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingOffer.current_price}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, current_price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-600"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preço Anterior (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingOffer.previous_price || ''}
                    onChange={(e) =>
                      setEditingOffer({
                        ...editingOffer,
                        previous_price: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Código de Cupom</label>
                  <input
                    type="text"
                    value={editingOffer.coupon_code || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, coupon_code: e.target.value || null })}
                    placeholder="Ex: SELECAO10"
                    className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status da Oferta</label>
                  <select
                    value={editingOffer.status}
                    onChange={(e) =>
                      setEditingOffer({ ...editingOffer, status: e.target.value as any })
                    }
                    className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-600 font-bold"
                  >
                    <option value="published">PUBLICADA</option>
                    <option value="draft">RASCUNHO</option>
                    <option value="archived">ARQUIVADA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL de Destino Original</label>
                <input
                  type="url"
                  value={editingOffer.destination_url}
                  onChange={(e) => setEditingOffer({ ...editingOffer, destination_url: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-600 font-mono text-[11px]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">URL com Tag de Afiliado (`affiliate_url`)</label>
                <input
                  type="url"
                  value={editingOffer.affiliate_url || ''}
                  onChange={(e) => setEditingOffer({ ...editingOffer, affiliate_url: e.target.value })}
                  placeholder="Gerado automaticamente se deixar em branco"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-600 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(editingOffer.free_shipping)}
                    onChange={(e) => setEditingOffer({ ...editingOffer, free_shipping: e.target.checked })}
                    className="rounded border-slate-300 text-slate-900 focus:ring-0"
                  />
                  <span>Frete Grátis</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-amber-700">
                  <input
                    type="checkbox"
                    checked={Boolean(editingOffer.featured)}
                    onChange={(e) => setEditingOffer({ ...editingOffer, featured: e.target.checked })}
                    className="rounded border-slate-300 text-amber-600 focus:ring-0"
                  />
                  <span>★ Destaque Hero Banner</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingOffer(null);
                    setModalAiSocial(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded transition-colors disabled:opacity-50"
                >
                  {savingEdit ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
