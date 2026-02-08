'use client';

interface IPhoneMockupProps {
    children: React.ReactNode;
}

export function IPhoneMockup({ children }: IPhoneMockupProps) {
    return (
        <div className="relative inline-block">
            {/* Glow Effects */}
            <div className="absolute -inset-8 bg-gradient-to-br from-emerald-500/20 via-blue-500/10 to-purple-500/20 rounded-[4rem] blur-3xl opacity-60 animate-pulse" />

            {/* iPhone 15 Pro Frame */}
            <div className="relative">
                {/* Outer Frame - Titanium */}
                <div className="relative w-[340px] h-[690px] bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-[3.5rem] p-[3px] shadow-2xl ring-8 ring-emerald-500 ring-offset-4 ring-offset-slate-900">
                    {/* Inner Frame */}
                    <div className="relative w-full h-full bg-black rounded-[3.3rem] overflow-hidden">

                        {/* Dynamic Island */}
                        <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-full z-50 shadow-lg">
                            {/* Camera Lens */}
                            <div className="absolute top-1/2 left-[20px] -translate-y-1/2 w-[14px] h-[14px] bg-gradient-to-br from-slate-800 to-slate-950 rounded-full border border-slate-700" />
                            {/* Proximity Sensor */}
                            <div className="absolute top-1/2 right-[20px] -translate-y-1/2 w-[8px] h-[8px] bg-slate-900 rounded-full" />
                        </div>

                        {/* Screen Content Area */}
                        <div className="absolute inset-0 top-[60px] bottom-[20px] left-[3px] right-[3px] bg-slate-950 rounded-[3rem] overflow-hidden">
                            {children}
                        </div>

                        {/* Home Indicator */}
                        <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[140px] h-[5px] bg-white/30 rounded-full" />
                    </div>
                </div>

                {/* Side Buttons */}
                {/* Volume Up */}
                <div className="absolute left-[-3px] top-[120px] w-[3px] h-[30px] bg-gradient-to-r from-slate-600 to-slate-700 rounded-l-sm" />
                {/* Volume Down */}
                <div className="absolute left-[-3px] top-[165px] w-[3px] h-[30px] bg-gradient-to-r from-slate-600 to-slate-700 rounded-l-sm" />
                {/* Mute Switch */}
                <div className="absolute left-[-3px] top-[90px] w-[3px] h-[20px] bg-gradient-to-r from-slate-600 to-slate-700 rounded-l-sm" />
                {/* Power Button */}
                <div className="absolute right-[-3px] top-[140px] w-[3px] h-[60px] bg-gradient-to-l from-slate-600 to-slate-700 rounded-r-sm" />

                {/* Screen Reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-[3.5rem] pointer-events-none" />
            </div>
        </div>
    );
}
