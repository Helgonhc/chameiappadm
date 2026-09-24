'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { offerSchema, OfferInput } from '../../../../lib/validators/offer.schema';
import { SEED_CATEGORIES, SEED_MERCHANTS } from '../../../../lib/services/seed-data';

export default function NovaOfertaPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<OfferInput>({
    title: '',
    slug: '',
    description: '',
    category_id: SEED_CATEGORIES[0]?.id || '',
    merchant_id: SEED_MERCHANTS[0]?.id || '',
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

  const handleSubmit = (e: React.FormEvent) => {
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

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('Oferta cadastrada com sucesso! Redirecionando...');
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1200);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-card space-y-6">
        <div className="border-b border-neutral-200 pb-4">
          <h1 className="text-2xl font-black text-neutral-900">
            Cadastrar Nova Oferta Real
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Preencha as informações da promoção obtida na Amazon Brasil ou Mercado Livre.
          </p>
        </div>

        {successMessage && (
          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg text-sm font-bold border border-emerald-200">
            ✓ {successMessage}
          </div>
        )}

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

          {/* Loja e Categoria */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Comerciante / Loja *</label>
              <select
                value={formData.merchant_id}
                onChange={(e) => setFormData({ ...formData, merchant_id: e.target.value })}
                className="w-full font-normal text-sm border border-neutral-300 rounded p-2.5 bg-white"
              >
                {SEED_MERCHANTS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Categoria *</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full font-normal text-sm border border-neutral-300 rounded p-2.5 bg-white"
              >
                {SEED_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
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
                className="w-full font-normal text-sm border border-neutral-300 rounded p-2.5 focus:ring-2 focus:ring-[var(--color-brand-primary-700)]"
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
                className="w-full font-normal text-sm border border-neutral-300 rounded p-2.5 focus:ring-2 focus:ring-[var(--color-brand-primary-700)]"
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
                placeholder="https://..."
                className="w-full font-normal text-sm border border-neutral-300 rounded p-2.5"
                required
              />
              {errors.image_url && <p className="text-red-600 font-normal mt-1">{errors.image_url}</p>}
            </div>

            <div>
              <label className="block mb-1">URL Direta de Destino do Produto (destination_url) *</label>
              <input
                type="url"
                value={formData.destination_url}
                onChange={(e) => setFormData({ ...formData, destination_url: e.target.value })}
                placeholder="https://www.amazon.com.br/dp/..."
                className="w-full font-normal text-sm border border-neutral-300 rounded p-2.5"
                required
              />
              {errors.destination_url && <p className="text-red-600 font-normal mt-1">{errors.destination_url}</p>}
            </div>

            <div>
              <label className="block mb-1">URL de Afiliado Aprovada (affiliate_url) (Opcional)</label>
              <input
                type="url"
                value={formData.affiliate_url || ''}
                onChange={(e) => setFormData({ ...formData, affiliate_url: e.target.value })}
                placeholder="https://amzn.to/..."
                className="w-full font-normal text-sm border border-neutral-300 rounded p-2.5"
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
              placeholder="Resumo das especificações..."
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
