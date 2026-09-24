'use client';

import React, { useState } from 'react';

interface CopyCouponButtonProps {
  code: string;
}

export const CopyCouponButton: React.FC<CopyCouponButtonProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    navigator.clipboard.writeText(code);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded border border-dashed border-[var(--color-offer-coupon)] text-[var(--color-offer-coupon)] bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
      title="Clique para copiar o cupom de desconto"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {copied ? (
          <path d="M20 6L9 17l-5-5" />
        ) : (
          <>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </>
        )}
      </svg>
      <span>{copied ? 'CUPOM COPIADO!' : `CUPOM: ${code}`}</span>
    </button>
  );
};
