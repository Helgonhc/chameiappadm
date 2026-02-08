'use client';

import Image from 'next/image';

interface PhoneMockupProps {
    children: React.ReactNode;
}

export function PhoneMockup({ children }: PhoneMockupProps) {
    return (
        <div className="relative inline-block">
            {/* Ambient Glow */}
            <div className="absolute -inset-12 bg-gradient-to-br from-emerald-500/30 via-blue-500/20 to-purple-500/30 rounded-[5rem] blur-3xl opacity-70 animate-pulse" />

            {/* iPhone Frame Container - Better proportions */}
            <div className="relative" style={{ width: '280px', height: '600px' }}>
                {/* SVG iPhone Frame - Professional Design */}
                <svg
                    viewBox="0 0 280 600"
                    className="absolute inset-0 w-full h-full drop-shadow-2xl"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Phone Body - Titanium Gradient */}
                    <defs>
                        <linearGradient id="titaniumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1e293b" />
                            <stop offset="50%" stopColor="#334155" />
                            <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>
                        <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#020617" />
                            <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>

                        {/* Screen Mask for Rounded Corners */}
                        <mask id="screenMask">
                            <rect x="8" y="15" width="264" height="570" rx="35" fill="white" />
                        </mask>
                    </defs>

                    {/* Outer Frame */}
                    <rect
                        x="0"
                        y="0"
                        width="280"
                        height="600"
                        rx="40"
                        fill="url(#titaniumGrad)"
                        stroke="#475569"
                        strokeWidth="2"
                    />

                    {/* Inner Bezel */}
                    <rect
                        x="6"
                        y="6"
                        width="268"
                        height="588"
                        rx="37"
                        fill="#000000"
                        stroke="#1e293b"
                        strokeWidth="1"
                    />

                    {/* Screen Background */}
                    <rect
                        x="8"
                        y="14"
                        width="264"
                        height="572"
                        rx="33"
                        fill="url(#screenGrad)"
                    />

                    {/* Dynamic Island */}
                    <ellipse
                        cx="140"
                        cy="26"
                        rx="45"
                        ry="13"
                        fill="#000000"
                    />

                    {/* Camera Lens inside Dynamic Island */}
                    <circle cx="122" cy="26" r="4.5" fill="#1e293b" stroke="#374151" strokeWidth="0.5" />

                    {/* Proximity Sensor */}
                    <circle cx="158" cy="26" r="2" fill="#0f172a" />

                    {/* Side Buttons */}
                    {/* Mute Switch */}
                    <rect x="0" y="105" width="2.5" height="20" rx="1.2" fill="#334155" />
                    {/* Volume Up */}
                    <rect x="0" y="135" width="2.5" height="28" rx="1.2" fill="#334155" />
                    {/* Volume Down */}
                    <rect x="0" y="172" width="2.5" height="28" rx="1.2" fill="#334155" />
                    {/* Power Button */}
                    <rect x="277.5" y="150" width="2.5" height="55" rx="1.2" fill="#334155" />

                    {/* Screen Reflection Overlay */}
                    <rect
                        x="8"
                        y="14"
                        width="264"
                        height="572"
                        rx="33"
                        fill="url(#reflection)"
                        opacity="0.05"
                    />

                    <defs>
                        <linearGradient id="reflection" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Content Overlay Area - Positioned exactly over the screen */}
                <div
                    className="absolute overflow-hidden"
                    style={{
                        top: '15px',
                        left: '8px',
                        width: '264px',
                        height: '570px',
                        borderRadius: '35px'
                    }}
                >
                    {children}
                </div>

                {/* Home Indicator */}
                <div
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full"
                    style={{ bottom: '10px' }}
                />
            </div>
        </div>
    );
}
