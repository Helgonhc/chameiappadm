'use client';

import React, { useState } from 'react';
import { SITE_CONFIG } from '../../../lib/config/site.config';
import { contactFormSchema, ContactFormInput } from '../../../lib/validators/offer.schema';

export default function ContatoPage() {
  const [formData, setFormData] = useState<ContactFormInput>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormInput, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormInput, string>> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof ContactFormInput;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="bg-white p-8 rounded-xl border border-[var(--color-neutral-200)] shadow-card space-y-6">
        <div className="space-y-2 border-b border-[var(--color-neutral-200)] pb-4">
          <span className="text-xs font-bold text-[var(--color-brand-primary-700)] uppercase tracking-wider">
            Atendimento
          </span>
          <h1 className="text-3xl font-black text-[var(--color-neutral-900)]">
            Fale Conosco
          </h1>
          <p className="text-sm text-[var(--color-neutral-700)]">
            Dúvidas ou sugestões? Envie uma mensagem para a equipe do {SITE_CONFIG.name}.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h3 className="font-bold text-lg text-emerald-900">Mensagem Enviada com Sucesso!</h3>
            <p className="text-xs text-emerald-700">
              Obrigado pelo contato. Responderemos o mais breve possível no e-mail informado.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="btn-chamei-primary text-xs"
            >
              Enviar outra mensagem
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--color-neutral-900)] mb-1">
                Seu Nome
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: João da Silva"
                className="w-full border border-neutral-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-[var(--color-brand-primary-700)] focus:outline-none"
              />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-neutral-900)] mb-1">
                E-mail para Contato
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seuemail@exemplo.com"
                className="w-full border border-neutral-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-[var(--color-brand-primary-700)] focus:outline-none"
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-neutral-900)] mb-1">
                Assunto
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Ex: Sugestão de oferta ou dúvida"
                className="w-full border border-neutral-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-[var(--color-brand-primary-700)] focus:outline-none"
              />
              {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-neutral-900)] mb-1">
                Mensagem
              </label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Escreva sua mensagem aqui..."
                className="w-full border border-neutral-300 rounded-md p-2.5 text-sm focus:ring-2 focus:ring-[var(--color-brand-primary-700)] focus:outline-none"
              />
              {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-chamei-accent w-full text-center justify-center font-bold"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
