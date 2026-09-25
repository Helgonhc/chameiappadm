'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ensureMinimumThreeImages } from '../../lib/utils/image-helpers';

interface OfferImageGalleryProps {
  mainImageUrl: string;
  images?: string[];
  title: string;
  merchantName?: string;
  discountPercent?: number;
}

export const OfferImageGallery: React.FC<OfferImageGalleryProps> = ({
  mainImageUrl,
  images: rawImages,
  title,
  merchantName,
  discountPercent = 0,
}) => {
  const galleryImages = ensureMinimumThreeImages(mainImageUrl, rawImages, title, merchantName);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeImage = galleryImages[selectedIndex] || mainImageUrl;

  return (
    <div className="flex flex-col space-y-4 w-full">
      {/* Container Principal de Exibição de Imagem com Zoom */}
      <div className="relative w-full h-80 md:h-[400px] bg-slate-900/60 rounded-xl p-6 flex items-center justify-center border border-white/10 overflow-hidden group shadow-lg backdrop-blur-md">
        <Image
          src={activeImage}
          alt={`${title} - Foto ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          priority
        />

        {/* Badges no Canto Superior Esquerdo */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2">
          {merchantName && (
            <span className="bg-slate-950/90 text-amber-400 border border-amber-400/30 text-xs font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-md">
              {merchantName}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md">
              ↓ {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Contador de Fotos (Pelo menos 3 imagens) */}
        <div className="absolute bottom-3 right-3 z-10 bg-slate-950/80 text-slate-300 border border-white/10 text-[11px] font-mono px-2.5 py-1 rounded-md shadow-xs">
          📷 {selectedIndex + 1} / {galleryImages.length} fotos
        </div>
      </div>

      {/* Miniaturas Interativas da Galeria (Mínimo 3 Fotos Garantidas) */}
      <div className="grid grid-cols-3 gap-3">
        {galleryImages.slice(0, 6).map((imgUrl, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <button
              key={`${imgUrl}-${idx}`}
              onClick={() => setSelectedIndex(idx)}
              type="button"
              className={`relative h-20 bg-slate-900/40 rounded-lg border-2 p-1 transition-all overflow-hidden cursor-pointer ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500/30 scale-102'
                  : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={imgUrl}
                alt={`${title} - Foto miniatura ${idx + 1}`}
                fill
                sizes="120px"
                className="object-contain p-1"
              />
              <span className="absolute bottom-1 right-1 bg-slate-950/90 text-[10px] text-slate-300 font-mono px-1 rounded">
                #{idx + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
