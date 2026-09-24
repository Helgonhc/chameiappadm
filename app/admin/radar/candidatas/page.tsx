'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CandidateOffer, CandidateStatus } from '../../../../lib/types/radar';

export default function CandidatasPage() {
  const [candidates, setCandidates] = useState<CandidateOffer[]>([]);
  const [statusFilter, setStatusFilter] = useState<CandidateStatus>('candidate');
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredCandidates = candidates.filter((c) => c.status === statusFilter);

  const handleUpdateStatus = (id: string, newStatus: CandidateStatus) => {
    setCandidates((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    setFeedback(`Status da candidata atualizado para "${newStatus}".`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-md border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">📋</span>
            <h1 className="text-2xl font-black text-slate-900">FILA DE CANDIDATAS DO RADAR</h1>
          </div>
          <p className="text-xs text-slate-500">
            Triagem e aprovação manual de ofertas capturadas antes da publicação oficial na Home.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/radar"
            className="px-4 py-2 rounded text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            ← Voltar ao Radar
          </Link>
        </div>
      </div>

      {/* Filtros de Status */}
      <div className="bg-white p-4 rounded-md border border-slate-200 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-2">Filtrar:</span>
        {(['candidate', 'analyzing', 'approved', 'published', 'rejected', 'expired'] as CandidateStatus[]).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded text-xs font-bold shrink-0 transition-colors capitalize ${
              statusFilter === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {st} ({candidates.filter((c) => c.status === st).length})
          </button>
        ))}
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded">
          {feedback}
        </div>
      )}

      {/* Lista de Candidatas */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-md border border-slate-200 space-y-3">
          <span className="text-3xl block">📭</span>
          <h3 className="text-base font-bold text-slate-900">Nenhuma candidata no status &quot;{statusFilter}&quot;</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Utilize o Radar Chamei para buscar e adicionar novos produtos à fila de triagem ou adicione ofertas via Link Especial.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/radar"
              className="inline-block px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded hover:bg-slate-800 transition-colors"
            >
              Buscar no Radar →
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCandidates.map((cand) => (
            <div key={cand.id} className="bg-white p-6 rounded-md border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <Image src={cand.image_url} alt={cand.title} width={64} height={64} className="w-16 h-16 object-contain p-1 border border-slate-100 rounded bg-slate-50" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{cand.provider} • ID: {cand.external_id}</span>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2">{cand.title}</h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-mono font-bold text-base text-slate-900">R$ {cand.current_price.toFixed(2)}</span>
                      {cand.previous_price && (
                        <span className="text-xs text-slate-400 line-through">R$ {cand.previous_price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Score Indicator */}
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded border border-slate-200 shrink-0">
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Offer Score</span>
                    <span className={`text-xl font-mono font-black ${cand.score >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {cand.score}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Botões de Triagem */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => handleUpdateStatus(cand.id, 'rejected')}
                  className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs rounded transition-colors"
                >
                  ✕ REJEITAR
                </button>
                <button
                  onClick={() => handleUpdateStatus(cand.id, 'published')}
                  className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs rounded transition-colors shadow-xs"
                >
                  ✓ APROVAR E PUBLICAR
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
