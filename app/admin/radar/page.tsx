'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AmazonProvider } from '../../../lib/services/connectors/amazon/amazon-provider';
import { MercadoLivreProvider } from '../../../lib/services/connectors/mercado-livre/mercado-livre-provider';
import { ExternalProduct, ProviderStatus } from '../../../lib/types/radar';
import { CandidateService } from '../../../lib/services/radar/candidate.service';
import { formatCurrencyBRL } from '../../../lib/utils/offer-helpers';

export default function RadarPage() {
  const [provider, setProvider] = useState<'amazon' | 'mercado-livre'>('mercado-livre');
  const [query, setQuery] = useState('');
  const [amazonStatus, setAmazonStatus] = useState<ProviderStatus>('NOT_CONFIGURED');
  const [mlStatus, setMlStatus] = useState<ProviderStatus>('READY');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ExternalProduct[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Estados do Robô de Automação
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [botPlatform, setBotPlatform] = useState<'all' | 'mercado-livre' | 'amazon'>('all');
  const [botLogs, setBotLogs] = useState<string[]>([]);
  const [botSummary, setBotSummary] = useState<string | null>(null);

  const candidateService = new CandidateService();

  useEffect(() => {
    async function checkHealth() {
      const amazon = new AmazonProvider();
      const ml = new MercadoLivreProvider();

      const amazonHealth = await amazon.healthCheck();
      const mlHealth = await ml.healthCheck();

      setAmazonStatus(amazonHealth.status);
      setMlStatus(mlHealth.status);
    }
    checkHealth();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsLoading(true);

    try {
      if (provider === 'amazon') {
        const amazon = new AmazonProvider();
        const res = await amazon.searchProducts(query);
        setResults(res);
      } else {
        const ml = new MercadoLivreProvider();
        const res = await ml.searchProducts(query || 'promocao');
        setResults(res);
      }
    } catch {
      setFeedback('Erro ao realizar busca no provedor de afiliados.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCandidate = async (product: ExternalProduct) => {
    try {
      const res = await candidateService.processDiscoveredProduct(product);
      if (res.isDuplicate) {
        setFeedback(`O produto "${product.title}" já está cadastrado na fila de candidatas.`);
      } else {
        setFeedback(`Produto "${product.title}" adicionado com sucesso à fila de candidatas! (Score: ${res.candidate?.score})`);
      }
    } catch {
      setFeedback('Erro ao adicionar produto à fila.');
    }
  };

  // Dispara a Varredura Autônoma do Robô com a Plataforma Selecionada
  const handleRunAutoBot = async () => {
    setIsBotRunning(true);
    const platformName =
      botPlatform === 'mercado-livre'
        ? 'Mercado Livre'
        : botPlatform === 'amazon'
        ? 'Amazon Brasil'
        : 'Ambas as Plataformas';

    setBotLogs([
      `[Robô Autônomo] Iniciando varredura direcionada em: ${platformName}...`,
      '[Robô] Varrendo termos em alta nas lojas e gerando copies persuasivas com IA da NVIDIA...',
    ]);
    setBotSummary(null);

    try {
      const response = await fetch('/api/admin/bot/auto-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: botPlatform }),
      });
      const data = await response.json();

      if (data.success && data.result) {
        setBotLogs(data.result.logs || []);
        setBotSummary(`✅ SUCESSO! ${data.result.publishedCount} ofertas foram extraídas, categorizadas e publicadas no site!`);
      } else {
        setBotLogs((prev) => [...prev, `❌ Erro: ${data.error || 'Falha na execução'}`]);
      }
    } catch (err: any) {
      setBotLogs((prev) => [...prev, `❌ Erro de conexão: ${err.message || String(err)}`]);
    } finally {
      setIsBotRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📡</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">RADAR DE OFERTAS & BOT AUTÔNOMO</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Motor de busca inteligente, varredura automática e publicação direta com IA da NVIDIA NIM
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/radar/candidatas"
            className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            📋 Ver Fila de Candidatas →
          </Link>
        </div>
      </div>

      {/* SEÇÃO PRINCIPAL — BOT AUTÔNOMO DE PUBLICAÇÃO DE OFERTAS */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#FF5500]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col space-y-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-[#FF5500]/30 text-[#FF5500] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping" />
                IA DA NVIDIA + DETECTOR DAS 24 CATEGORIAS
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                🤖 Robô Autônomo de Busca e Publicação Direta
              </h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Escolha abaixo qual plataforma o robô autônomo deve rastrear. Ele buscará promoções em alta, aplicará a IA de neuromarketing e **publicará automaticamente no ChameiApp**.
              </p>
            </div>
          </div>

          {/* SELETOR DE PLATAFORMA DE VARREDURA */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-white/10 space-y-3">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              🎯 Selecione a Loja / Plataforma para Varredura:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setBotPlatform('all')}
                className={`p-3.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  botPlatform === 'all'
                    ? 'bg-gradient-to-r from-[#FF5500] to-[#FF7700] text-slate-950 border-amber-400 font-black shadow-md scale-102'
                    : 'bg-slate-950/60 text-slate-300 border-white/10 hover:border-white/30'
                }`}
              >
                <span>⚡ Ambas as Lojas (ML + Amazon)</span>
              </button>

              <button
                type="button"
                onClick={() => setBotPlatform('mercado-livre')}
                className={`p-3.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  botPlatform === 'mercado-livre'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md scale-102'
                    : 'bg-slate-950/60 text-slate-300 border-white/10 hover:border-white/30'
                }`}
              >
                <span>🟡 Apenas Mercado Livre (API)</span>
              </button>

              <button
                type="button"
                onClick={() => setBotPlatform('amazon')}
                className={`p-3.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  botPlatform === 'amazon'
                    ? 'bg-orange-500 text-slate-950 border-orange-400 font-black shadow-md scale-102'
                    : 'bg-slate-950/60 text-slate-300 border-white/10 hover:border-white/30'
                }`}
              >
                <span>🟠 Apenas Amazon Brasil</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleRunAutoBot}
              disabled={isBotRunning}
              className="w-full md:w-auto bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] text-white font-black text-sm px-8 py-4 rounded-xl hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isBotRunning ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>VARRENDO {botPlatform === 'mercado-livre' ? 'MERCADO LIVRE' : botPlatform === 'amazon' ? 'AMAZON BRASIL' : 'TODAS AS LOJAS'}...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">🚀</span>
                  <span>EXECUTAR VARREDURA EM {botPlatform === 'mercado-livre' ? 'MERCADO LIVRE' : botPlatform === 'amazon' ? 'AMAZON BRASIL' : 'AMBAS AS LOJAS'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Console / Terminal de Logs do Robô */}
        {botLogs.length > 0 && (
          <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1 max-h-60 overflow-y-auto scrollbar-thin">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-500 font-bold uppercase text-[10px] tracking-wider mb-2">
              <span>Terminal de Execução do Robô</span>
              <span>NVIDIA NIM AI active</span>
            </div>
            {botLogs.map((log, index) => (
              <div
                key={index}
                className={log.includes('✅') ? 'text-emerald-400 font-bold' : log.includes('❌') ? 'text-rose-400 font-bold' : log.includes('Processando') ? 'text-amber-300' : 'text-slate-300'}
              >
                {log}
              </div>
            ))}
          </div>
        )}

        {botSummary && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold rounded-xl flex items-center justify-between">
            <span>{botSummary}</span>
            <Link
              href="/admin/ofertas"
              className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-black text-xs rounded-lg hover:bg-emerald-400 transition-colors"
            >
              Ver Ofertas no Gerenciador →
            </Link>
          </div>
        )}
      </div>

      {/* Cards de Status dos Provedores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Amazon Status */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Provedor Amazon Brasil</span>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${amazonStatus === 'READY' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="font-bold text-sm text-slate-900">
                {amazonStatus === 'READY' ? 'Conectado (PA-API / Tag Ativa)' : 'Tag Ativa (chameiapp-20)'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">Tracking ID: <strong>chameiapp-20</strong></span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-orange-100 text-orange-800">
            Ativo (tag)
          </span>
        </div>

        {/* Mercado Livre Status */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Provedor Mercado Livre</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-bold text-sm text-slate-900">API Oficial Conectada</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">Varredura direta na API do Mercado Livre</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800">
            READY
          </span>
        </div>
      </div>

      {/* Busca Manual do Radar */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          🔍 Busca Manual de Oportunidades
        </h2>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fonte / Provedor</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as 'amazon' | 'mercado-livre')}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#FF5500]"
              >
                <option value="mercado-livre">Mercado Livre (API Oficial)</option>
                <option value="amazon">Amazon Brasil (Tag: chameiapp-20)</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">Termo / Palavra-chave</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ex: Parafusadeira Bosch, Kindle, Air Fryer, PS5..."
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#FF5500]"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 bg-[#FF5500] hover:bg-[#E04B00] text-white font-bold text-xs rounded-lg disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isLoading ? 'Buscando...' : 'BUSCAR MANUAL'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {feedback && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold rounded-lg">
            {feedback}
          </div>
        )}
      </div>

      {/* Resultados Encontrados */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Resultados Encontrados ({results.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((product) => (
              <div key={product.external_id} className="bg-white p-4 rounded-xl border border-slate-200 flex gap-4 shadow-xs">
                <Image src={product.image_url} alt={product.title} width={80} height={80} className="w-20 h-20 object-contain p-1 border border-slate-100 rounded-lg shrink-0" />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-2">{product.title}</h4>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-mono font-black text-[#FF5500]">
                        {formatCurrencyBRL(product.current_price)}
                      </span>
                      {product.previous_price && product.previous_price > product.current_price && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatCurrencyBRL(product.previous_price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleAddCandidate(product)}
                      className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      + ADICIONAR À FILA
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
