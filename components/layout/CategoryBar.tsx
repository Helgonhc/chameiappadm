import React from 'react';
import Link from 'next/link';
import { Category } from '../../lib/types/database';
import { SEED_CATEGORIES } from '../../lib/services/seed-data';

interface CategoryBarProps {
  categories?: Category[];
  activeCategorySlug?: string;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  activeCategorySlug,
}) => {
  const displayCategories = (categories && categories.length > 0) ? categories : SEED_CATEGORIES;

  return (
    <div className="bg-slate-900 border-b border-slate-800 sticky top-16 md:top-20 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-2.5 overflow-x-auto no-scrollbar scroll-smooth">
          <Link
            href="/ofertas"
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-black transition-all ${
              !activeCategorySlug
                ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] text-white shadow-md shadow-orange-500/20 scale-105'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            🔥 Todas as Ofertas
          </Link>

          {displayCategories.map((cat) => {
            const isActive = activeCategorySlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] text-white shadow-md shadow-orange-500/20 scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{cat.icon || '🛍️'}</span>
                <span>{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
