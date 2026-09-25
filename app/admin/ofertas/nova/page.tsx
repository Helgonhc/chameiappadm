'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { offerSchema, OfferInput } from '../../../../lib/validators/offer.schema';
import { OfferService } from '../../../../lib/services/offer.service';
import { MerchantService } from '../../../../lib/services/merchant.service';
import { Category, Merchant } from '../../../../lib/types/database';

export default function NovaOfertaPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);

  const [formData, setFormData] = useState<OfferInput>({
    title: '',
    slug: '',
    description: '',
    category_id: '',
    merchant_id: '',
    current_price: 0,
    previous_price: null,
    coupon_code: '',
    image_url: '',
    destination_url: '',
    affiliate_url: '',
    featured: false,
    free_shipping: true,
    status: 'published',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Estados da IA NVIDIA
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSocialMessage, setAiSocialMessage] = useState<string | null>(null);
  const [aiVerdict, setAiVerdict] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const [cats, merchs] = await Promise.all([
        MerchantService.getCategories(),
        MerchantService.getMerchants(),
      ]);
      setCategories(cats);
      setMerchants(merchs);

      if (cats.length > 0) {
        setFormData((prev) => ({ ...prev, category_id: cats[0].id }));
      }
      if (merchs.length > 0) {
        setFormData((prev) => ({ ...prev, merchant_id: merchs[0].id }));
      }
    }
    loadData();
  }, []);

  const handleDestinationUrlChange = (url: string) => {
    let autoAffiliate = formData.affiliate_url;

    if (url.includes('amazon.com.br') && (!autoAffiliate || autoAffiliate.includes('amazon.com.br'))) {
      try {
        const parsed = new URL(url);
        parsed.searchParams.set('tag', 'chameiapp-20');
        autoAffiliate = parsed.toString();
      } catch {
        autoAffiliate = url;
      }
    }

    setFormData((prev) => ({
      ...prev,
      destination_url: url,
      affiliate_url: autoAffiliate,
    }));
  };

  const handleGenerateAiCopy = async () => {
    if (!formData.title.trim()) {
      setErrors({ title: 'Insira um título inicial antes de gerar o texto com a IA.' });
      return;
    }

    setIsGeneratingAi(true);
    setErrors({});

    try {
      const selectedMerchant = merchants.find((m) => m.id === formData.merchant_id)?.name;
      const selectedCategory = categories.find((c) => c.id === formData.category_id)?.name;

      const response = await fetch('/api/admin/ai/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          currentPrice: formData.current_price,
          previousPrice: formData.previous_price,
          merchantName: selectedMerchant,
          categoryName: selectedCategory,
          couponCode: formData.coupon_code,
          freeShipping: formData.free_shipping,
          rawDescription: formData.description,
        }),
      });

      const json = await response.json();

      if (json.success && json.copy) {
        setFormData((prev) => ({
          ...prev,
          title: json.copy.optimizedTitle || prev.title,
          description: json.copy.description || prev.description,
        }));

        setAiSocialMessage(json.copy.socialMessage);
        setAiVerdict(json.copy.verdict);
      } else {
        setErrors({ general: json.error || 'Erro ao gerar copy com a IA.' });
      }
    } catch {
      setErrors({ general: 'Erro de conexão ao solicitar IA da NVIDIA.' });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    const autoSlug = formData.slug?.trim()
      ? formData.slug.trim()
      : formData.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

    const dataToValidate = {
      ...formData,
      slug: autoSlug,
      current_price: Number(formData.current_price),
      previous_price: formData.previous_price ? Number(formData.previous_price) : null,
    };

    const validation = offerSchema.safeParse(dataToValidate);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await OfferService.createOffer(dataToValidate);

      if (!result.success) {
        setErrors({ general: result.error || 'Erro ao salvar oferta.' });
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage('Oferta cadastrada e publicada no portal com sucesso!');
      setTimeout(() => {
        router.push('/admin/dashboard');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setErrors({ general: err?.message || 'Erro inesperado ao salvar oferta.' });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-card space-y-6">
        <div className="border-b border-neutral-200 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-neutral-900">
              Cadastrar Nova Oferta Real
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Preencha as informações da promoção e utilize a IA da NVIDIA para gerar textos de alta conversão.
            </p>
          </div>
          <span className="bg-purple-100 text-purple-800 font-bold text-[10px] px-2.5 py-1 rounded font-mono">
            LLaMA 3.3 70B (NVIDIA API)
          </span>
        </div>

        {successMessage && (
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg text-sm font-bold border border-emerald-200">
            ✓ {successMessage}
          </div>
        )}

        {/* Caixa de IA NVIDIA */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-5 rounded-lg space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <div>
                <h3 className="font-extrabold text-sm uppercase tracking-wider">Agente Copywriter NVIDIA NIM</h3>
                <p className="text-[10px] text-purple-200">Gere títulos persuasivos, descrições ricas e texto para grupos de WhatsApp com 1 clique.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGenerateAiCopy}
              disabled={isGeneratingAi}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-xs rounded shadow transition-all active:scale-95 disabled:opacity-50 shrink-0"
            >
              {isGeneratingAi ? '🧠 Processando IA NVIDIA...' : '✨ Gerar Copy com IA'}
            </button>
          </div>

          {aiVerdict && (
            <div className="p-3 bg-purple-950/80 border border-purple-400/30 rounded text-xs space-y-1">
              <span className="text-purple-300 font-bold uppercase text-[10px] block">Veredicto da Promoção pela IA:</span>
              <p className="text-slate-100 font-medium italic">{aiVerdict}</p>
            </div>
          )}

          {aiSocialMessage && (
            <div className="p-3 bg-slate-950 rounded border border-purple-400/20 space-y-2 text-xs">
              <div className="flex items-center justify-between text-purple-300 font-bold">
                <span>📱 Texto Gerado para Disparo (WhatsApp / Telegram):</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(aiSocialMessage)}
                  className="text-[10px] bg-purple-700 hover:bg-purple-600 text-white px-2 py-0.5 rounded font-mono"
                >
                  📋 Copiar Texto
                </button>
              </div>
              <pre className="font-sans text-[11px] text-slate-200 bg-slate-900 p-2.5 rounded whitespace-pre-wrap leading-relaxed select-all">
                {aiSocialMessage}
              </pre>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-bold text-neutral-800">
          
          {/* Título do Produto */}
          <div>
            <label className="block mb-1">Título Completo da Oferta *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Smart TV 50 4K UHD LED Samsung"
              className="w-full font-normal text-sm border border-neutral-300 rounded p-2.5 focus:ring-2 focus:ring-[var(--color-brand-primary-700)] focus:outline-none"
              required
            />
            {errors.title && <p className="text-red-600 font-normal mt-1">{errors.title}</p>}
          </div>

          {errors.general && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-xs font-semibold border border-red-200">
              {errors.general}
            </div>
          )}

          {/* Loja e Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Comerciante / Loja *</label>
              <select
                value={formData.merchant_id}
                onChange={(e) => setFormData({ ...formData, merchant_id: e.target.value })}
                className="w-full font-normal text-sm border border-neutral-300 rounded p-2.5 bg-white text-slate-900"
              >
                {merchants.length > 0 ? (
                  merchants.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))
                ) : (
                  <option value="">Nenhuma loja cadastrada</option>
                )}
              </select>
            </div>

            <div>
              <label className="block mb-1">Categoria *</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full font-normal text-sm border border-neutral-300 rounded p-2.5 bg-white text-slate-900"
              >
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <option value="">Nenhuma categoria cadastrada</option>
                )}
              </select>
            </div>
          </div>

          {/* Preços */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Preço Atual (R$) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.current_price || ''}
                onChange={(e) => setFormData({ ...formData, current_price: parseFloat(e.target.value) || 0 })}
                placeholder="2199.00"
                className="w-full font-normal text-sm border border-neutral-300 rounded p-2.5 text-slate-900 focus:ring-2 focus:ring-[var(--color-brand-primary-700)]"
                required
              />
              {errors.current_price && <p className="text-red-600 font-normal mt-1">{errors.current_price}</p>}
            </div>

            <div>
              <label className="block mb-1">Preço Anterior Riscar (R$) (Opcional)</label>
              <input
                type="number"
                step="0.01"
                value={formData.previous_price || ''}
                onChange={(e) => setFormData({ ...formData, previous_price: parseFloat(e.target.value) || null })}
                placeholder="2799.00"
                className="w-full font-normal text-sm border border-neutral-300 rounded p-2.5 text-slate-900 focus:ring-2 focus:ring-[var(--color-brand-primary-700)]"
              />
            </div>
          </div>

          {/* URLs */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1">URL da Imagem Oficial do Produto *</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://m.media-amazon.com/images/..."
                className="w-full font-normal text-sm border border-neutral-300 rounded p-2.5 text-slate-900"
                required
              />
              {errors.image_url && <p className="text-red-600 font-normal mt-1">{errors.image_url}</p>}
            </div>

            <div>
              <label className="block mb-1">URL Direta de Destino do Produto (destination_url) *</label>
              <input
                type="url"
                value={formData.destination_url}
                onChange={(e) => handleDestinationUrlChange(e.target.value)}
                placeholder="https://www.amazon.com.br/dp/B08X..."
                className="w-full font-normal text-sm border border-neutral-300 rounded p-2.5 text-slate-900"
                required
              />
              {errors.destination_url && <p className="text-red-600 font-normal mt-1">{errors.destination_url}</p>}
            </div>

            <div>
              <label className="block mb-1">
                URL de Afiliado (affiliate_url) — Injetado Tag chameiapp-20 automaticamente
              </label>
              <input
                type="url"
                value={formData.affiliate_url || ''}
                onChange={(e) => setFormData({ ...formData, affiliate_url: e.target.value })}
                placeholder="https://www.amazon.com.br/dp/...Tag=chameiapp-20"
                className="w-full font-normal text-sm border border-neutral-300 rounded p-2.5 text-slate-900 bg-slate-50"
              />
            </div>

            <div>
              <label className="block mb-1">Cupom de Desconto (Opcional)</label>
              <input
                type="text"
                value={formData.coupon_code || ''}
                onChange={(e) => setFormData({ ...formData, coupon_code: e.target.value })}
                placeholder="Ex: CHAMEI10"
                className="w-full font-normal text-sm border border-neutral-300 rounded p-2.5"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block mb-1">Descrição do Produto (Opcional)</label>
            <textarea
              rows={4}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Resumo das especificações ou texto gerado pela IA..."
              className="w-full font-normal text-sm border border-neutral-300 rounded p-2.5"
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-[var(--color-brand-primary-700)] rounded"
              />
              <span>Marcar como Destaque Principal</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.free_shipping}
                onChange={(e) => setFormData({ ...formData, free_shipping: e.target.checked })}
                className="w-4 h-4 text-[var(--color-brand-primary-700)] rounded"
              />
              <span>Frete Grátis Disponível</span>
            </label>
          </div>

          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-chamei-primary text-xs font-bold"
            >
              {isSubmitting ? 'Cadastrando...' : 'Salvar e Publicar Oferta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
