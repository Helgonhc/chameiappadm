'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AmazonProvider } from '../../../lib/services/connectors/amazon/amazon-provider';
import { MercadoLivreProvider } from '../../../lib/services/connectors/mercado-livre/mercado-livre-provider';
import { ProviderStatus } from '../../../lib/types/radar';

export default function IntegracoesPage() {
  const [amazonHealth, setAmazonHealth] = useState<{ status: ProviderStatus; message: string; lastCheckedAt: string }>({
    status: 'NOT_CONFIGURED',
    message: 'Verificando...',
    lastCheckedAt: '',
  });

  const [mlHealth, setMlHealth] = useState<{ status: ProviderStatus; message: string; lastCheckedAt: string }>({
    status: 'NOT_CONFIGURED',
    message: 'Verificando...',
    lastCheckedAt: '',
  });

  useEffect(() => {
    async function loadHealth() {
      const amazon = new AmazonProvider();
      const ml = new MercadoLivreProvider();

      const aHealth = await amazon.healthCheck();
      const mHealth = await ml.healthCheck();

      setAmazonHealth(aHealth);
      setMlHealth(mHealth);
    }
    loadHealth();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-md border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">INTEGRAÇÕES E CONECTORES DE AFILIADOS</h1>
          <p className="text-xs text-slate-500 mt-1">
            Status dos conectores oficiais de API e validação de chaves no servidor.
          </p>
        </div>
        <Link
          href="/admin/radar"
          className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded hover:bg-slate-800 transition-colors"
        >
          📡 Abrir Radar Chamei →
        </Link>
      </div>

      {/* Grid de Conectores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Amazon Brasil */}
        <div className="bg-white p-6 rounded-md border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📦</span>
              <div>
                <h3 className="font-black text-base text-slate-900">Amazon Brasil</h3>
                <span className="text-xs text-slate-500 font-mono">Tracking ID: chameiapp-20</span>
              </div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded font-bold ${amazonHealth.status === 'READY' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
              {amazonHealth.status}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Credenciais API (`AMAZON_API_CLIENT_ID`):</span>
              <span className="font-bold text-slate-700">{amazonHealth.status === 'READY' ? 'Configuradas (Server)' : 'Não Configuradas'}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Marketplace:</span>
              <span className="font-bold text-slate-700">www.amazon.com.br</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Formato de Integração:</span>
              <span className="font-bold text-slate-700">Creators API / PA-API 5.0 (Sem Scraping)</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Última Checagem:</span>
              <span className="font-mono text-slate-600">{amazonHealth.lastCheckedAt ? new Date(amazonHealth.lastCheckedAt).toLocaleTimeString() : 'Agora'}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 leading-relaxed">
            {amazonHealth.message}
          </div>
        </div>

        {/* Mercado Livre */}
        <div className="bg-white p-6 rounded-md border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤝</span>
              <div>
                <h3 className="font-black text-base text-slate-900">Mercado Livre</h3>
                <span className="text-xs text-slate-500 font-mono">Provedor Secundário</span>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded font-bold bg-slate-100 text-slate-600">
              {mlHealth.status}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Credenciais API:</span>
              <span className="font-bold text-slate-700">Aguardando Configuração</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Adapter Class:</span>
              <span className="font-mono text-slate-700">MercadoLivreProvider</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Última Checagem:</span>
              <span className="font-mono text-slate-600">{mlHealth.lastCheckedAt ? new Date(mlHealth.lastCheckedAt).toLocaleTimeString() : 'Agora'}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 leading-relaxed">
            {mlHealth.message}
          </div>
        </div>

      </div>
    </div>
  );
}
