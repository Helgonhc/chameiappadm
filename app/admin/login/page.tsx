'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { SITE_CONFIG } from '../../../lib/config/site.config';
import { ChameiMarker } from '../../../components/ui/ChameiMarker';

function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get('redirect') || '/admin/dashboard';
  const paramError = searchParams.get('error');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }

    setIsLoading(true);

    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        setError('Supabase não está configurado neste ambiente.');
        setIsLoading(false);
        return;
      }

      const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

      let { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !data.user) {
        // Tentativa de auto-sincronização via API administrativa se a conta não estiver confirmada/sincronizada
        if (authError?.message?.includes('Invalid login credentials')) {
          try {
            const syncRes = await fetch('/api/auth/setup-admin', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            });

            const syncData = await syncRes.json();

            if (syncRes.ok && syncData.success) {
              const retryRes = await supabase.auth.signInWithPassword({
                email,
                password,
              });

              if (retryRes.data?.user) {
                window.location.href = redirectUrl;
                return;
              }
            } else if (syncData?.error) {
              setError(`Falha ao sincronizar conta com o Supabase: ${syncData.error}`);
              setIsLoading(false);
              return;
            }
          } catch (syncErr: any) {
            setError(`Erro ao tentar sincronizar no servidor: ${syncErr?.message || 'Erro de conexão'}`);
            setIsLoading(false);
            return;
          }
        }

        setError(authError?.message || 'E-mail ou senha inválidos.');
        setIsLoading(false);
        return;
      }

      // Redireciona via window.location.href para forçar o navegador a enviar todos os cookies no header HTTP para o middleware da Vercel
      window.location.href = redirectUrl;
    } catch (err: any) {
      setError(err?.message || 'Ocorreu um erro ao realizar o login.');
      setIsLoading(false);
    }
  };

  return (
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

      {paramError === 'sem-configuracao' && !error && (
        <div className="bg-red-50 text-red-700 p-3 rounded text-xs font-semibold border border-red-200">
          Atenção: As variáveis de ambiente do Supabase não estão cadastradas na Vercel. Adicione NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY nas configurações da Vercel.
        </div>
      )}

      {paramError === 'acesso-negado-sem-permissao' && !error && (
        <div className="bg-amber-50 text-amber-800 p-3 rounded text-xs font-semibold border border-amber-200">
          Sua conta precisa de permissão de Administrador na tabela profiles para acessar esta área.
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded text-xs font-semibold border border-red-200">
          {error}
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
        <Link
          href="/"
          className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
        >
          ← Voltar para o Portal CHAMEIAPP
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <Suspense fallback={
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-md text-center text-slate-500 text-sm font-semibold">
          Carregando formulário de acesso...
        </div>
      }>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}





