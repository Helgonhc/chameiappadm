import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-black text-slate-900 mb-2">404</h1>
      <h2 className="text-lg font-bold text-slate-800 mb-2">Página não encontrada</h2>
      <p className="text-xs text-slate-500 mb-6 max-w-sm">
        A oferta ou página solicitada não foi encontrada ou expirou.
      </p>
      <Link href="/ofertas" className="btn-offer-cta max-w-xs">
        Ver catálogo de ofertas
      </Link>
    </div>
  );
}
