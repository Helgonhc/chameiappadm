'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { SITE_CONFIG } from '../../../lib/config/site.config';
import { ChameiMarker } from '../../../components/ui/ChameiMarker';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sqlInstruction, setSqlInstruction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get('redirect') || '/admin/dashboard';
  const paramError = searchParams.get('error');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSqlInstruction(null);

    if (!email || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }

    setIsLoading(true);

    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        if (process.env.NODE_ENV !== 'production') {
          router.push(redirectUrl);
          return;
        }
        setError('Supabase não está configurado neste ambiente.');
        setIsLoading(false);
        return;
      }

      const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !data.user) {
        setError(authError?.message || 'E-mail ou senha inválidos.');
        setIsLoading(false);
        return;
      }

      // Redireciona para a rota protegida. O middleware do servidor validará a role com Service Role Key
      router.push(redirectUrl);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Ocorreu um erro ao realizar o login.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-md space-y-6">
        <div className="text-center space-y-2">
          <ChameiMarker size="sm" label="ÁREA RESTRITA" className="mx-auto" />
          <h1 className="text-2xl font-black text-slate-900">
            Acesso Administrativo
          </h1>
          <p className="text-xs text-slate-500">
            Painel de Gestão e Radar do {SITE_CONFIG.name}
          </p>
        </div>

        {paramError === 'acesso-negado-sem-permissao' && !error && (
          <div className="bg-amber-50 text-amber-800 p-3 rounded text-xs font-semibold border border-amber-200">
            Sua conta precisa de permissão de Administrador para acessar esta área.
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded text-xs font-semibold border border-red-200 space-y-2">
            <p>{error}</p>
            {sqlInstruction && (
              <div className="mt-2 pt-2 border-t border-red-200 text-[11px] text-slate-800 font-mono">
                <span className="font-bold text-red-900 block font-sans mb-1">
                  💡 Execute o SQL no SQL Editor do Supabase para liberar:
                </span>
                <pre className="bg-slate-900 text-emerald-400 p-2 rounded overflow-x-auto text-[10px]">
                  {sqlInstruction}
                </pre>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              E-mail do Administrador
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="w-full border border-slate-300 rounded p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-[var(--color-signal-primary)] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Senha de Acesso
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-slate-300 rounded p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-[var(--color-signal-primary)] focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[var(--color-signal-primary)] hover:bg-[var(--color-signal-hover)] text-white font-bold py-3 px-4 rounded transition-colors text-sm disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Autenticando...' : 'Entrar no Painel'}
          </button>
        </form>

        <div className="text-center pt-2">
          <a
            href="/"
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← Voltar para o Portal CHAMEIAPP
          </a>
        </div>
      </div>
    </div>
  );
}


