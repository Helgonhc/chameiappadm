'use client';

import {
    FileText,
    Zap,
    Wind,
    ShieldAlert,
    ClipboardCheck,
    Calculator,
    FileSignature,
    Activity,
    ArrowUpRight,
    Search
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function DemoReportsPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const handleDemoAction = (name: string) => {
        toast(`🔒 "${name}" desabilitado no modo demonstração`, {
            icon: 'ℹ️',
            duration: 2000,
        });
    };

    const reportCategories = [
        {
            title: 'Elétrica & Inspeção de Campo',
            reports: [
                {
                    name: 'Termografia Infravermelha',
                    desc: 'Análise de calor em sistemas sob carga.',
                    icon: Activity,
                    color: 'text-red-500',
                    badge: 'NR-10'
                },
                {
                    name: 'Cabine Primária',
                    desc: 'Checklist de manutenção em subestações.',
                    icon: Zap,
                    color: 'text-orange-500',
                    badge: 'Alta Tensão'
                },
                {
                    name: 'Laudo de SPDA',
                    desc: 'Inspeção de para-raios e aterramento.',
                    icon: ShieldAlert,
                    color: 'text-sky-500',
                    badge: 'NBR 5419'
                },
                {
                    name: 'Quadros Elétricos',
                    desc: 'Inspeção e checklist de painéis.',
                    icon: ClipboardCheck,
                    color: 'text-amber-500',
                    badge: 'Painéis'
                },
            ]
        },
        {
            title: 'Climatização & Engenharia',
            reports: [
                {
                    name: 'PMOC',
                    desc: 'Plano de Manutenção, Operação e Controle.',
                    icon: Wind,
                    color: 'text-blue-500',
                    badge: 'Lei 13.589/18'
                },
                {
                    name: 'Parecer de Engenharia',
                    desc: 'Diagnósticos e avaliações técnicas.',
                    icon: FileSignature,
                    color: 'text-purple-500',
                    badge: 'Laudo'
                },
                {
                    name: 'Coleta de Óleo',
                    desc: 'Amostragem para transformadores.',
                    icon: ClipboardCheck,
                    color: 'text-yellow-500',
                    badge: 'Transf.'
                },
                {
                    name: 'Relatório de Manutenção',
                    desc: 'Registro técnico de intervenções.',
                    icon: FileText,
                    color: 'text-emerald-500',
                    badge: 'Técnico'
                },
            ]
        },
        {
            title: 'Gestão & Comercial',
            reports: [
                {
                    name: 'Gerador de Orçamentos',
                    desc: 'Propostas comerciais com cálculo automático.',
                    icon: Calculator,
                    color: 'text-emerald-600',
                    badge: 'Vendas'
                },
                {
                    name: 'Relatórios Técnicos Geral',
                    desc: 'Template multifuncional de engenharia.',
                    icon: FileText,
                    color: 'text-indigo-500',
                    badge: 'Padrão'
                },
                {
                    name: 'Caixas de Passagem',
                    desc: 'Checklist de infraestrutura.',
                    icon: ClipboardCheck,
                    color: 'text-slate-500',
                    badge: 'Civil'
                },
            ]
        }
    ];

    const filteredCategories = reportCategories.map(cat => ({
        ...cat,
        reports: cat.reports.filter(r =>
            r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.badge.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(cat => cat.reports.length > 0);

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest mb-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                        Demo Real-Time
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none italic">
                        Central de Geradores
                    </h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">
                        Interface de emissão técnica profissional.
                    </p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar gerador ou norma..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold placeholder:font-normal"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="space-y-12 pb-20">
                {filteredCategories.map((category, idx) => (
                    <div key={idx} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <h3 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.3em]">
                                {category.title}
                            </h3>
                            <div className="h-px flex-1 bg-gradient-to-r from-gray-200 dark:from-slate-800 to-transparent" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {category.reports.map((report, rIdx) => (
                                <div
                                    key={rIdx}
                                    onClick={() => handleDemoAction(`Gerador: ${report.name}`)}
                                    className="group p-5 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-white/5 rounded-2xl hover:border-emerald-500/50 dark:hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all hover:-translate-y-1 flex flex-col gap-4 cursor-pointer"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className={`w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center ${report.color} group-hover:scale-110 transition-transform shadow-sm`}>
                                            <report.icon size={24} />
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-slate-500 group-hover:text-emerald-400 transition-colors">
                                                {report.badge}
                                            </span>
                                            <div className="text-[10px] font-black italic text-emerald-500 animate-pulse flex items-center gap-1">
                                                <Zap size={8} /> PREMIUM
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white leading-tight flex items-center gap-1 group-hover:text-emerald-500 transition-colors">
                                            {report.name}
                                            <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1 translate-x-1" />
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-slate-500 mt-1 leading-relaxed">
                                            {report.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {filteredCategories.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <Search size={48} className="mb-4 opacity-20" />
                        <p>Nenhum gerador encontrado para "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </div>
    );
}
