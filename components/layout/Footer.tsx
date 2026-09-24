import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 pt-10 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Coluna 1: Marca & Visão */}
          <div className="md:col-span-2 space-y-3">
            <span className="font-black text-2xl tracking-tight text-white block">
              CHAMEI<span className="text-[var(--color-signal-primary)]">APP</span>
            </span>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Portal agregador de ofertas e comparação de preços reais das principais lojas online.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Participamos de programas de afiliados. Ao clicar nos links de produtos e concluir uma compra, podemos receber comissão de afiliados sem custo adicional para o comprador.
            </p>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div>
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">
              Ofertas
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/ofertas" className="text-slate-300 hover:text-white transition-colors">
                  Todas as Ofertas
                </Link>
              </li>
              <li>
                <Link href="/categoria/tecnologia" className="text-slate-300 hover:text-white transition-colors">
                  Tecnologia
                </Link>
              </li>
              <li>
                <Link href="/categoria/ferramentas" className="text-slate-300 hover:text-white transition-colors">
                  Ferramentas
                </Link>
              </li>
              <li>
                <Link href="/categoria/casa-e-cozinha" className="text-slate-300 hover:text-white transition-colors">
                  Casa & Cozinha
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Links Legais & Institucional */}
          <div>
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-3">
              Informações
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/divulgacao-de-afiliados" className="text-slate-300 hover:text-white transition-colors">
                  Divulgação de Afiliados
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className="text-slate-300 hover:text-white transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/termos-de-uso" className="text-slate-300 hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-slate-300 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Rodapé Inferior */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} CHAMEIAPP. Agregador de Ofertas.
          </p>
        </div>
      </div>
    </footer>
  );
};
