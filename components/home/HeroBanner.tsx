'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export const HeroBanner: React.FC = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/ofertas?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 md:p-10 shadow-2xl border border-slate-800 mb-8">
      {/* Glow Orbs Background */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF5500]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        {/* Ticker Badge */}
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-[#FF5500]/30 text-[#FF5500] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4">
          <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping" />
          OFERTAS VERIFICADAS EM TEMPO REAL
        </div>

        {/* Headline Principal */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.15] mb-4 text-white">
          As Melhores Ofertas do Brasil com <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FF3D00]">Menor Preço Real</span>
        </h1>

        <p className="text-sm md:text-base text-slate-300 font-medium mb-6 leading-relaxed max-w-2xl">
          Monitore o histórico de preços da Amazon, Mercado Livre e principais lojas. Cupons ativos e links diretos testados minuto a minuto!
        </p>

        {/* Busca Protagonista no Hero */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Qual produto você quer pagar mais barato hoje? Ex: PS5, Air Fryer, iPhone..."
            className="w-full bg-slate-900/90 text-white placeholder-slate-400 border-2 border-slate-700/80 rounded-xl py-3.5 pl-4 pr-32 text-sm md:text-base focus:outline-none focus:border-[#FF5500] focus:ring-4 focus:ring-[#FF5500]/20 shadow-lg backdrop-blur-md transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] text-white font-extrabold text-xs md:text-sm px-4 py-2.5 rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
          >
            <span>BUSCAR</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>

        {/* Quick Highlights Pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-semibold">
          <span className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-lg">
            ⚡ Links Seguros & Diretos
          </span>
          <span className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-lg">
            🏷️ Cupons Testados
          </span>
          <span className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/50 px-3 py-1.5 rounded-lg">
            🔥 Descontos de até 70%
          </span>
        </div>
      </div>
    </div>
  );
};
