import React from 'react';
import Link from 'next/link';
import { Category } from '../../lib/types/database';

interface CategoryBarProps {
  categories: Category[];
  activeCategorySlug?: string;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  activeCategorySlug,
}) => {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-16 md:top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-2.5 overflow-x-auto no-scrollbar scroll-smooth">
          <Link
            href="/ofertas"
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              !activeCategorySlug
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            🔥 Todas as Ofertas
          </Link>

          {categories.map((cat) => {
            const isActive = activeCategorySlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
