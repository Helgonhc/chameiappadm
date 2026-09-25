import React from 'react';
import Link from 'next/link';
import { Category } from '../../lib/types/database';
import { SEED_CATEGORIES } from '../../lib/services/seed-data';

interface CategoryGridProps {
  categories?: Category[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  const displayCategories = (categories && categories.length > 0) ? categories : SEED_CATEGORIES;

  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5500] animate-pulse"></span>
            Navegue por Categoria
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-medium">
            Selecione uma das 24 categorias para encontrar as melhores ofertas
          </p>
        </div>
        <span className="hidden sm:inline-flex text-xs font-extrabold text-[#FF5500] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          24 Categorias Ativas
        </span>
      </div>

      {/* Grid de 24 Categorias — Réplica Fiel do Design de Capturar.JPG */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {displayCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/categoria/${cat.slug}`}
            className="category-card-orange group"
          >
            <div className="category-icon-box group-hover:scale-110 transition-transform duration-200">
              <span>{cat.icon || '🛍️'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-extrabold text-xs sm:text-sm text-white line-clamp-2 leading-snug tracking-tight block">
                {cat.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
