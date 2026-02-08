'use client';

import { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface SessionTimerProps {
    durationMinutes?: number;
}

export function SessionTimer({ durationMinutes = 5 }: SessionTimerProps) {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60); // in seconds
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsExpired(true);
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isExpired) {
            toast.error('Sessão de demonstração expirada!');
            setTimeout(() => {
                router.push('/#product-demo');
            }, 2000);
        }
    }, [isExpired, router]);

    // Show warning at 1 minute
    useEffect(() => {
        if (timeLeft === 60) {
            toast('⏰ Restam apenas 60 segundos de demonstração!', {
                icon: '⚠️',
                duration: 5000,
            });
        }
    }, [timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const percentage = (timeLeft / (durationMinutes * 60)) * 100;

    const handleExtend = () => {
        setTimeLeft(durationMinutes * 60);
        setIsExpired(false);
        toast.success('Sessão estendida por mais 5 minutos!');
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold">Modo Demonstração</p>
                            <p className="text-xs text-emerald-100">
                                Tempo restante: {minutes}:{seconds.toString().padStart(2, '0')}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleExtend}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors backdrop-blur-sm"
                    >
                        Estender +5min
                    </button>
                </div>

                {/* Progress bar */}
                <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white transition-all duration-1000 ease-linear"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            {timeLeft <= 60 && (
                <div className="bg-yellow-500/20 border-t border-yellow-400/30 px-4 py-2">
                    <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
                        <AlertCircle size={16} />
                        <span className="font-medium">Sua sessão está prestes a expirar!</span>
                    </div>
                </div>
            )}
        </div>
    );
}
