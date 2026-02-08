'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, LogIn, Loader2, ShieldCheck, Globe, Zap, Cpu, Lock, Activity, Server } from 'lucide-react';
import toast from 'react-hot-toast';
import { ChameiLogo } from '@/components/Logo';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, checkAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, []);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      console.log('🚀 [LoginPage] Redirecionando para dashboard - Já autenticado');
      router.push('/dashboard');
    }
  }, [isAuthenticated, router, mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#020617] selection:bg-emerald-500/20 selection:text-white font-sans overflow-hidden">

      {/* Background Cinético Animado */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2%_2%,rgba(16,185,129,0.05)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_98%_98%,rgba(59,130,246,0.05)_0%,transparent_50%)]" />
        {/* Grid de Fundo */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Lado Esquerdo: Imersão Tech (Serious) */}
      <div className="hidden lg:flex lg:w-3/5 relative flex-col justify-between p-20 z-10 border-r border-white/5 bg-[#020617]/50 backdrop-blur-3xl overflow-hidden">

        {/* Elementos Decorativos de Tecnologia */}
        <div className="absolute top-0 right-0 p-20 space-y-4 opacity-20">
          <div className="w-1 h-32 bg-gradient-to-b from-emerald-500 to-transparent rounded-full ml-auto" />
          <div className="w-1 h-16 bg-gradient-to-b from-emerald-500 to-transparent rounded-full ml-auto" />
        </div>

        {/* Logo superior */}
        <div
          className="flex items-center gap-3 animate-fadeIn cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.replace('/')}
        >
          <ChameiLogo className="h-12" color="#10B981" textColor="white" />
        </div>

        {/* Conteúdo Central: Foco Honestidade & Apresentação */}
        <div className="space-y-12 py-12">
          <div className="space-y-6">
            <h2 className="text-8xl font-black text-white tracking-tighter leading-[0.85] italic uppercase animate-slideLeft">
              GESTÃO <br />
              <span className="text-emerald-500">TÉCNICA.</span>
            </h2>
            <div className="space-y-4 animate-fadeIn delay-300">
              <p className="text-2xl text-slate-400 font-medium leading-relaxed max-w-xl">
                O ChameiApp é o cérebro da sua empresa de manutenção.
                Abandone o papel e controle tudo em um só lugar.
              </p>
              <div className="flex flex-col gap-3 pt-4">
                <div className="flex items-center gap-3 text-emerald-400 font-bold text-xs uppercase tracking-widest">
                  <ShieldCheck size={18} /> OS Ilimitadas & Gestão de Ativos
                </div>
                <div className="flex items-center gap-3 text-blue-400 font-bold text-xs uppercase tracking-widest">
                  <Activity size={18} /> Relatórios Financeiros & Produtividade
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 animate-fadeInUp delay-500">
            <button
              onClick={() => router.replace('/?showDemo=true')}
              className="px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-white font-black uppercase text-xs tracking-[4px] transition-all flex items-center gap-4 group"
            >
              <Zap size={18} className="text-emerald-500 group-hover:animate-bounce" />
              Quero Iniciar Teste Demo de 7 Dias
            </button>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[2px] mt-4 ml-2">Configuração em 60 Segundos • Sem Cartão</p>
          </div>
        </div>
      </div>

      {/* Lado Direito: Formulário de Login (Modern / Tech) */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-24 lg:p-32 z-10 relative">
        <div className="max-w-md w-full mx-auto space-y-12">

          <div className="space-y-6">
            <div className="lg:hidden flex justify-center mb-16">
              <ChameiLogo className="h-10" color="#10B981" textColor="white" />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase tracking-[3px]">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Autenticação Segura
              </div>
              <h1 className="text-5xl font-black text-white tracking-tighter leading-none italic">Login.</h1>
              <p className="text-slate-500 font-medium">Insira suas credenciais para acessar o painel administrativo.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[3px] text-slate-500 ml-1">Seu E-mail</label>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-16 px-6 bg-white/[0.03] border border-white/10 rounded-[1.5rem] text-white font-bold outline-none focus:border-emerald-500 focus:bg-white/5 focus:ring-4 focus:ring-emerald-500/5 transition-all text-lg tracking-tight"
                    placeholder="exemplo@chameiapp.com.br"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black uppercase tracking-[3px] text-slate-500">Sua Senha</label>
                </div>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-16 px-6 bg-white/[0.03] border border-white/10 rounded-[1.5rem] text-white font-bold outline-none focus:border-emerald-500 focus:bg-white/5 focus:ring-4 focus:ring-emerald-500/5 transition-all text-lg tracking-tight"
                    placeholder="••••••••••••"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-emerald-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-20 bg-emerald-500 hover:bg-emerald-400 text-[#020617] rounded-[2rem] font-black text-sm uppercase tracking-[5px] shadow-[0_0_50px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-4 group"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Sincronizando...</span>
                </>
              ) : (
                <>
                  <LogIn size={24} className="group-hover:translate-x-1 transition-transform" />
                  <span>Iniciar Sessão</span>
                </>
              )}
            </button>
          </form>

          {/* Versão & Copyright */}
          <div className="text-center pt-8 border-t border-white/10">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[3px]">
              © 2026 ChameiApp - TODOS OS DIREITOS RESERVADOS <br />
              <span className="mt-2 block text-emerald-500 tracking-[1px]">DESENVOLVIDO POR HELGON HENRIQUE</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
