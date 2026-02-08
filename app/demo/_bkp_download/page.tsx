'use client';

import { useState } from 'react';
import { Download, FileText, Layout, Smartphone, Terminal, Cpu, Globe, Cloud, Search, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const downloadCategories = [
    {
        title: 'App Técnico',
        description: 'Gestão de campo, offline first e assinatura digital.',
        icon: <Smartphone className="text-indigo-600" />,
        platforms: [
            { id: 'android', name: 'Android (APK)', size: '24 MB', version: '2.4.1' },
            { id: 'ios', name: 'iOS (App Store)', size: '18 MB', version: '2.4.0' },
        ],
        active: true
    },
    {
        title: 'Dashboard Desktop',
        description: 'Versão instalável para Windows e macOS.',
        icon: <Layout className="text-blue-600" />,
        platforms: [
            { id: 'win', name: 'Windows EXE', size: '64 MB', version: '1.2.0' },
            { id: 'mac', name: 'macOS DMG', size: '68 MB', version: '1.2.0' },
        ],
        active: false
    },
    {
        title: 'Módulo de Integração',
        description: 'SDK para integração com sistemas legados/ERPs.',
        icon: <Terminal className="text-slate-600" />,
        platforms: [
            { id: 'sdk', name: 'SDK Node.js', size: '4.2 MB', version: '3.1.5' },
            { id: 'api', name: 'Postman Collection', size: '1.5 MB', version: '2.0' },
        ],
        active: true
    }
];

export default function DemoDownloadPage() {
    const handleDemoAction = (action: string) => {
        toast(`🔒 "${action}" desabilitado no modo demonstração`, {
            icon: 'ℹ️',
            duration: 2000,
        });
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3 tracking-tight">
                        Downloads & Apps <span className="text-indigo-600 text-sm font-black opacity-50 uppercase tracking-widest">Demo</span>
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">Sua operação em qualquer dispositivo, online ou offline.</p>
                </div>
            </div>

            {/* Main Downloads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {downloadCategories.map((cat) => (
                    <div key={cat.title} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm flex flex-col group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                {cat.icon}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${cat.active ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-400'}`}>
                                {cat.active ? 'Estável' : 'Breve'}
                            </div>
                        </div>
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight mb-2">{cat.title}</h2>
                        <p className="text-gray-400 text-xs font-medium leading-relaxed mb-8 flex-1">
                            {cat.description}
                        </p>

                        <div className="space-y-3">
                            {cat.platforms.map((plat) => (
                                <button
                                    key={plat.id}
                                    onClick={() => handleDemoAction(`Download ${plat.name}`)}
                                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl group/btn hover:bg-indigo-600 transition-all active:scale-95"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover/btn:bg-white/20">
                                            <Download size={14} className="group-hover/btn:text-white transition-colors" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black text-gray-800 uppercase tracking-tight group-hover/btn:text-white transition-colors">{plat.name}</p>
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest group-hover/btn:text-indigo-200 transition-colors">v{plat.version} • {plat.size}</p>
                                        </div>
                                    </div>
                                    <ArrowRight size={14} className="text-gray-300 group-hover/btn:text-white transition-all transform group-hover/btn:translate-x-1" />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* ecosystem Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-indigo-50 border border-indigo-100 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 group">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-indigo-200 transform group-hover:rotate-6 transition-transform">
                        <Cpu size={40} />
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-black text-indigo-900 uppercase tracking-tight mb-2">Ecossistema Conectado</h3>
                        <p className="text-indigo-600/70 text-sm font-medium leading-relaxed">
                            Integramos dados de hardware IoT via Modbus e MQTT diretamente no seu dashboard operacional.
                        </p>
                    </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 group">
                    <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-emerald-200 transform group-hover:-rotate-6 transition-transform">
                        <CheckCircle2 size={40} />
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-black text-emerald-900 uppercase tracking-tight mb-2">Garantia Multi-Platform</h3>
                        <p className="text-emerald-600/70 text-sm font-medium leading-relaxed">
                            Sincronização em tempo real entre web, tablet e mobile. Sua equipe sempre com o mesmo dado.
                        </p>
                    </div>
                </div>
            </div>

            {/* Web Access View */}
            <div className="bg-indigo-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20 text-center">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-40 -mt-40"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -ml-40 -mb-40"></div>

                <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 mb-8">
                        <Globe size={32} />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Acesso via Web</h2>
                    <p className="text-indigo-100/70 text-sm font-medium leading-relaxed mb-10">
                        Não quer instalar nada? O ChameiApp é 100% responsivo e funciona perfeitamente em qualquer navegador moderno. Acesse de onde estiver, sem complicação.
                    </p>
                    <button
                        onClick={() => handleDemoAction('Ir para Dashboard Web')}
                        className="bg-white text-indigo-900 px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[2px] hover:bg-indigo-50 transition-all active:scale-95 shadow-xl"
                    >
                        Abrir Web Player
                    </button>
                </div>
            </div>
        </div>
    );
}
