import React from 'react';

interface ChameiMarkerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ChameiMarker: React.FC<ChameiMarkerProps> = ({
  label = 'OFERTA VERIFICADA',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 18,
  };

  const iconSize = iconSizes[size];

  return (
    <span
      className={`inline-flex items-center font-black tracking-wider uppercase rounded-xs bg-[var(--color-signal-primary)] text-white shadow-xs ${sizeClasses[size]} ${className}`}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M3 17L9 7L13 13L17 7L21 17H3Z"
          fill="#F59E0B"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M12 12V21M12 21L9 18M12 21L15 18"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{label}</span>
    </span>
  );
};
