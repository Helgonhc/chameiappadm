import React from 'react';

interface LogoProps {
    className?: string;
    variant?: 'full' | 'icon';
    color?: string;
    textColor?: string;
}

export const ChameiLogo: React.FC<LogoProps> = ({
    className = "h-8",
    variant = 'full',
    color = "#10B981", // Default Emerald 500
    textColor = "currentColor"
}) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Símbolo Vetorial: O "C" da Eficiência Técnica */}
            <svg
                viewBox="0 0 100 100"
                className="h-full aspect-square group"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Camas de Profundidade Geométrica */}
                <path
                    d="M80 20C88.2843 28.2843 93 38.7157 93 50C93 73.7482 73.7482 93 50 93C26.2518 93 7 73.7482 7 50C7 26.2518 26.2518 7 50 7C61.2843 7 71.7157 11.7157 80 20"
                    stroke={color}
                    strokeWidth="14"
                    strokeLinecap="round"
                    className="opacity-20"
                />
                <path
                    d="M80 20C88.2843 28.2843 93 38.7157 93 50C93 73.7482 73.7482 93 50 93C26.2518 93 7 73.7482 7 50C7 26.2518 26.2518 7 50 7"
                    stroke={color}
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray="200 400"
                />
                {/* O 'Check' de Aprovação / Finalização de OS */}
                <path
                    d="M35 50L45 60L65 40"
                    stroke={color}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {variant === 'full' && (
                <div className="flex flex-col select-none">
                    <span className="font-black italic uppercase tracking-tighter text-2xl leading-none" style={{ color: textColor }}>
                        ChameiApp
                    </span>
                    <span className="text-[5px] font-black tracking-[4px] uppercase opacity-50 text-center" style={{ color: textColor }}>
                        Industrial Intelligence
                    </span>
                </div>
            )}
        </div>
    );
};
