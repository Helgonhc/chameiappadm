'use client';

import { useState, useEffect } from 'react';
import DemoSidebar from '@/frontend/components/demo/DemoSidebar';
import { Bell } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

export default function DemoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDemoAction = (action: string) => {
        toast(`🔒 "${action}" desabilitado no modo demonstração`, {
            icon: 'ℹ️',
            duration: 2000,
        });
    };

    if (!mounted) return null;

    return (
        <div className="h-full flex bg-gray-100 dark:bg-gray-950 transition-colors duration-300 relative overflow-hidden">
            {/* Sidebar - Precise logic for tablet/desktop */}
            <DemoSidebar
                onSearchClick={() => handleDemoAction('Busca')}
                onNotificationsClick={() => handleDemoAction('Notificações')}
                unreadCount={3}
                collapsed={collapsed}
                onToggle={setCollapsed}
            />

            <main className="flex-1 overflow-auto relative h-full">
                <div className="flex flex-col h-full overflow-hidden relative">

                    {/* Header - Fixed offset for both desktop and tablet simulation */}
                    <header className={`fixed top-0 right-0 left-0 ${collapsed ? 'md:left-16' : 'md:left-64'} z-30 bg-white/60 dark:bg-slate-950/60 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 transition-all duration-300 h-14`}>
                        <div className="max-w-[1600px] mx-auto px-4 h-full flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                                    Simulação Online
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleDemoAction('Notificações')}
                                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-all relative group"
                                    title="Notificações"
                                >
                                    <Bell size={20} className="group-hover:scale-110 transition-transform" />
                                    <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-950">
                                        3
                                    </span>
                                </button>
                                {/* Ensure ThemeToggle is visible in the demo for the user to test */}
                                <div className="flex items-center border-l dark:border-white/5 ml-2 pl-4">
                                    <ThemeToggle />
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 overflow-auto pt-14">
                        <div className="max-w-[1600px] mx-auto p-3 sm:p-4 lg:p-6 pb-20">
                            {children}
                        </div>
                    </div>
                </div>
            </main>

            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#1e293b',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    },
                }}
            />
        </div>
    );
}
