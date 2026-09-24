'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AmazonProvider } from '../../../lib/services/connectors/amazon/amazon-provider';
import { MercadoLivreProvider } from '../../../lib/services/connectors/mercado-livre/mercado-livre-provider';
import { ExternalProduct, ProviderStatus } from '../../../lib/types/radar';
import { CandidateService } from '../../../lib/services/radar/candidate.service';

export default function RadarPage() {
  const [provider, setProvider] = useState<'amazon' | 'mercado-livre'>('amazon');
  const [query, setQuery] = useState('');
  const [amazonStatus, setAmazonStatus] = useState<ProviderStatus>('NOT_CONFIGURED');
  const [mlStatus, setMlStatus] = useState<ProviderStatus>('NOT_CONFIGURED');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ExternalProduct[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const candidateService = new CandidateService();

  useEffect(() => {
    async function checkHealth() {
      const amazon = new AmazonProvider();
      const ml = new MercadoLivreProvider();

      const amazonHealth = await amazon.healthCheck();
      const mlHealth = await ml.healthCheck();

      setAmazonStatus(amazonHealth.status);
      setMlStatus(mlHealth.status);

      if (provider === 'amazon') {
        setStatusMessage(amazonHealth.message);
      } else {
        setStatusMessage(mlHealth.message);
      }
    }
    checkHealth();
  }, [provider]);

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
        const res = await ml.searchProducts(query);
        setResults(res);
      }
    } catch (err) {
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

  const currentStatus = provider === 'amazon' ? amazonStatus : mlStatus;

  return (
    <div className="space-y-6">
      {/* Header da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-md border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">📡</span>
            <h1 className="text-2xl font-black text-slate-900">RADAR CHAMEI</h1>
          </div>
          <p className="text-xs text-slate-500">
            Motor de descoberta e inteligência de oportunidades reais de produtos e preços.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/radar/candidatas"
            className="px-4 py-2 rounded text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            📋 Ver Fila de Candidatas →
          </Link>
        </div>
      </div>

      {/* Cards de Status dos Provedores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Amazon Status */}
        <div className="bg-white p-4 rounded-md border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Provedor Amazon Brasil</span>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${amazonStatus === 'READY' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="font-bold text-sm text-slate-900">
                {amazonStatus === 'READY' ? 'Conectado (Creators API / PA-API)' : 'Aguardando Credenciais'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">Tracking ID: <strong>chameiapp-20</strong></span>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded font-bold ${amazonStatus === 'READY' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
            {amazonStatus}
          </span>
        </div>

        {/* Mercado Livre Status */}
        <div className="bg-white p-4 rounded-md border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Provedor Mercado Livre</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span className="font-bold text-sm text-slate-900">Não Configurado</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">Aguardando definição de API</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded font-bold bg-slate-100 text-slate-600">
            {mlStatus}
          </span>
        </div>
      </div>

      {/* Formulário de Busca do Radar */}
      <div className="bg-white p-6 rounded-md border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          🔍 Busca Manual no Radar
        </h2>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fonte / Provedor</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as 'amazon' | 'mercado-livre')}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
              >
                <option value="amazon">Amazon Brasil (chameiapp-20)</option>
                <option value="mercado-livre">Mercado Livre (Futuro)</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">Termo / Palavra-chave</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ex: Parafusadeira Bosch, Kindle 11, Air Fryer..."
                  className="flex-1 bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded hover:bg-slate-800 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Buscando...' : 'BUSCAR NO RADAR'}
                </button>
              </div>
            </div>
          </div>
        </form>

        {feedback && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold rounded">
            {feedback}
          </div>
        )}
      </div>

      {/* Exibição Transparente quando NOT_CONFIGURED */}
      {currentStatus === 'NOT_CONFIGURED' && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-amber-900">Integração {provider === 'amazon' ? 'Amazon Brasil' : 'Mercado Livre'} em estado NOT_CONFIGURED</h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                {statusMessage}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-amber-200/80">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">Alternativas Reais de Operação no Painel:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/admin/ofertas/nova"
                className="p-3 bg-white border border-amber-300 rounded hover:border-amber-500 transition-colors block"
              >
                <strong className="text-xs text-slate-900 block mb-1">1. Cadastrar Link Especial</strong>
                <span className="text-[11px] text-slate-500 leading-tight block">Insira uma oferta real informando o link de afiliado oficial ou URL de produto.</span>
              </Link>

              <div className="p-3 bg-white border border-amber-300 rounded block opacity-80">
                <strong className="text-xs text-slate-900 block mb-1">2. Importar ASIN Real</strong>
                <span className="text-[11px] text-slate-500 leading-tight block">Disponível assim que as credenciais API da Amazon forem adicionadas no servidor.</span>
              </div>

              <Link
                href="/admin/ofertas/nova"
                className="p-3 bg-white border border-amber-300 rounded hover:border-amber-500 transition-colors block"
              >
                <strong className="text-xs text-slate-900 block mb-1">3. Cadastro Manual de Oferta</strong>
                <span className="text-[11px] text-slate-500 leading-tight block">Preencha título, imagem, preço e loja com dados verificados manualmente.</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Resultados da Busca (quando READY) */}
      {currentStatus === 'READY' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Resultados Encontrados ({results.length})
          </h3>

          {results.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-md border border-slate-200">
              <p className="text-xs text-slate-500">Nenhum produto encontrado para a busca informada.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((product) => (
                <div key={product.external_id} className="bg-white p-4 rounded-md border border-slate-200 flex gap-4">
                  <Image src={product.image_url} alt={product.title} width={80} height={80} className="w-20 h-20 object-contain p-1 border border-slate-100 rounded" />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-2">{product.title}</h4>
                      <span className="text-sm font-mono font-bold text-slate-900 block mt-1">
                        R$ {product.current_price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleAddCandidate(product)}
                        className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded hover:bg-slate-800 transition-colors"
                      >
                        + ADICIONAR À FILA
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
