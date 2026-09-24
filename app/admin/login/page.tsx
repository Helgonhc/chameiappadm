'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SITE_CONFIG } from '../../../lib/config/site.config';
import { ChameiMarker } from '../../../components/ui/ChameiMarker';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin/dashboard');
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white p-8 rounded-xl border border-neutral-200 shadow-card space-y-6">
        <div className="text-center space-y-2">
          <ChameiMarker size="sm" label="ÁREA RESTRITA" className="mx-auto" />
          <h1 className="text-2xl font-black text-neutral-900">
            Acesso Administrativo
          </h1>
          <p className="text-xs text-neutral-500">
            Gerenciamento de ofertas do {SITE_CONFIG.name}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded text-xs font-semibold border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              E-mail do Administrador
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@chameiapp.com.br"
              className="w-full border border-neutral-300 rounded p-2.5 text-sm focus:ring-2 focus:ring-[var(--color-brand-primary-700)] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Senha de Acesso
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-neutral-300 rounded p-2.5 text-sm focus:ring-2 focus:ring-[var(--color-brand-primary-700)] focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-chamei-primary w-full text-center justify-center font-bold py-3"
          >
            {isLoading ? 'Autenticando...' : 'Entrar no Painel'}
          </button>
        </form>
      </div>
    </div>
  );
}
