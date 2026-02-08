'use client';

import { useState } from 'react';
import {
    CreditCard, CheckCircle2, AlertCircle, Calendar, ExternalLink, ShieldCheck,
    ArrowUpRight, Zap, Download, FileText, Check, AlertTriangle, TrendingUp,
    Users, Database, Activity, Star
} from 'lucide-react';

// --- MOCK DATA ---

const MOCK_CURRENT_PLAN = {
    name: 'Magnata Pro',
    price: 'R$ 297,00',
    cycle: 'mensal',
    status: 'active',
    next_billing: '2026-03-01',
    features: [
        'Ordens de Serviço Ilimitadas',
        'Gestão de Técnicos (até 20)',
        'BI Magnata Completo',
        'Personalização de PDF Avançada',
        'Suporte Prioritário WhatsApp',
        'API de Integração',
    ],
    usage: {
        users: { used: 12, total: 20 },
        storage: { used: 45, total: 100, unit: 'GB' },
        api_calls: { used: 8540, total: 50000 }
    }
};

const MOCK_INVOICES = [
    { id: 'INV-001', date: '01/02/2026', amount: 'R$ 297,00', status: 'paid', pdf_url: '#' },
    { id: 'INV-002', date: '01/01/2026', amount: 'R$ 297,00', status: 'paid', pdf_url: '#' },
    { id: 'INV-003', date: '01/12/2025', amount: 'R$ 197,00', status: 'paid', pdf_url: '#' }, // Old price check
    { id: 'INV-004', date: '01/11/2025', amount: 'R$ 197,00', status: 'paid', pdf_url: '#' },
];

const MOCK_PAYMENT_METHOD = {
    brand: 'mastercard',
    last4: '8842',
    expiry: '08/29',
    holder: 'HELGON CHAMEI'
};

const UPGRADE_PLANS = [
    {
        name: 'Start',
        price: 'R$ 97',
        period: '/mês',
        features: ['Até 2 Técnicos', 'OS Ilimitadas', 'Gestão Básica'],
        current: false,
        recommended: false
    },
    {
        name: 'Magnata Pro',
        price: 'R$ 297',
        period: '/mês',
        features: ['Até 20 Técnicos', 'BI Avançado', 'Suporte Prioritário'],
        current: true,
        recommended: true
    },
    {
        name: 'Enterprise',
        price: 'Sob Consulta',
        period: '',
        features: ['Técnicos Ilimitados', 'API Dedicada', 'Gerente de Conta'],
        current: false,
        recommended: false
    }
];

export default function BillingPage() {
    const [plan] = useState(MOCK_CURRENT_PLAN);
    const [invoices] = useState(MOCK_INVOICES);
    const [card] = useState(MOCK_PAYMENT_METHOD);
    const [loading, setLoading] = useState(false);

    // --- Helpers ---
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'trialing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'past_due': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'canceled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Assinatura Ativa';
            case 'trialing': return 'Período de Teste';
            case 'past_due': return 'Pagamento Pendente';
            case 'canceled': return 'Cancelada';
            default: return status || 'Desconhecido';
        }
    };

    const getUsagePercentage = (used: number, total: number) => Math.min(100, (used / total) * 100);

    return (
        <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-24">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase flex items-center gap-3">
                        <CreditCard className="text-emerald-500" /> Faturamento & Plano
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
                        Gerencie sua assinatura, métodos de pagamento e visualize seu histórico.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-primary shadow-lg shadow-indigo-200/50">
                        <ArrowUpRight size={18} /> Fazer Upgrade
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column - Main Plan Info */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Current Plan Card - Premium Design */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-2xl shadow-indigo-900/20 group">
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-[15deg] group-hover:scale-[1.6] transition-all duration-700">
                            <ShieldCheck size={300} />
                        </div>
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl"></div>
                        <div className="absolute top-20 right-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>

                        <div className="relative z-10 p-8 md:p-10">
                            <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
                                <div>
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 bg-white/10 backdrop-blur-md mb-4`}>
                                        <CheckCircle2 size={12} className="text-emerald-400" />
                                        {getStatusLabel(plan.status)}
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-200 mb-2">
                                        {plan.name}
                                    </h2>
                                    <p className="text-indigo-200 font-medium flex items-center gap-2">
                                        <span className="text-2xl font-bold text-white">{plan.price}</span>
                                        <span className="opacity-70">/{plan.cycle}</span>
                                    </p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 min-w-[180px] text-center flex flex-col items-center justify-center">
                                    <p className="text-[10px] uppercase tracking-widest text-indigo-200 mb-1 font-bold">Próxima Fatura</p>
                                    <div className="text-xl font-bold flex items-center gap-2">
                                        <Calendar size={18} className="text-emerald-400" />
                                        {new Date(plan.next_billing).toLocaleDateString()}
                                    </div>
                                    <p className="text-xs text-indigo-300 mt-1">Renovação Automática</p>
                                </div>
                            </div>

                            {/* Usage Stats Bars */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/10">
                                <div>
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                                        <span className="text-indigo-200 flex items-center gap-1"><Users size={12} /> Usuários</span>
                                        <span>{plan.usage.users.used}/{plan.usage.users.total}</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-400 to-purple-400"
                                            style={{ width: `${getUsagePercentage(plan.usage.users.used, plan.usage.users.total)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                                        <span className="text-indigo-200 flex items-center gap-1"><Database size={12} /> Armazenamento</span>
                                        <span>{plan.usage.storage.used}GB</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400"
                                            style={{ width: `${getUsagePercentage(plan.usage.storage.used, plan.usage.storage.total)}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                                        <span className="text-indigo-200 flex items-center gap-1"><Activity size={12} /> API Requests</span>
                                        <span>{Math.round(getUsagePercentage(plan.usage.api_calls.used, plan.usage.api_calls.total))}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-orange-400 to-amber-400"
                                            style={{ width: `${getUsagePercentage(plan.usage.api_calls.used, plan.usage.api_calls.total)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invoices History */}
                    <div className="card border-none bg-white shadow-sm p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <FileText className="text-indigo-600" size={20} />
                                Histórico de Faturas
                            </h3>
                            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                                Ver todas
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                                    <tr>
                                        <th className="px-4 py-3 rounded-l-lg">Data</th>
                                        <th className="px-4 py-3">Valor</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 rounded-r-lg text-right">Download</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {invoices.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-4 font-medium text-gray-700">{inv.date}</td>
                                            <td className="px-4 py-4 text-gray-600">{inv.amount}</td>
                                            <td className="px-4 py-4">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                    <Check size={10} /> Pago
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                                    <Download size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                {/* Right Column - Secondary Info */}
                <div className="space-y-6">

                    {/* Payment Method Card */}
                    <div className="card shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full opacity-50 blur-2xl"></div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            Método de Pagamento
                        </h3>

                        {/* Mock Credit Card Visual */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white shadow-lg mb-4 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-10 h-7 bg-white/20 rounded flex items-center justify-center backdrop-blur-sm">
                                        <div className="w-6 h-4 border border-white/30 rounded sm-chip"></div>
                                    </div>
                                    <span className="font-bold italic text-lg tracking-widest">Mastercard</span>
                                </div>
                                <div className="font-mono text-xl tracking-widest mb-4 drop-shadow-md">
                                    •••• •••• •••• {card.last4}
                                </div>
                                <div className="flex justify-between items-end text-xs opacity-80 font-mono">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] uppercase">Titular</span>
                                        <span className="font-bold">{card.holder}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] uppercase">Validade</span>
                                        <span className="font-bold">{card.expiry}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
                            <CreditCard size={16} /> Alterar Cartão
                        </button>
                    </div>

                    {/* Features List */}
                    <div className="card border-none bg-indigo-50/50 p-6 rounded-2xl">
                        <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Star className="text-indigo-500" size={16} /> Incluso no seu plano
                        </h3>
                        <ul className="space-y-3">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-indigo-900/80">
                                    <CheckCircle2 size={16} className="text-indigo-500 shrink-0 mt-0.5" />
                                    <span className="leading-snug">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Upgrade Callout */}
                    <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Zap size={80} className="rotate-12" />
                        </div>
                        <h4 className="font-black italic uppercase text-lg mb-2 relative z-10">Plano Enterprise</h4>
                        <p className="text-white/90 text-sm font-medium mb-4 relative z-10 leading-relaxed">
                            Precisa de mais poder? Conheça nosso plano ilimitado para grandes operações.
                        </p>
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-bold hover:bg-white hover:text-orange-600 transition-colors">
                            Falar com Consultor <ExternalLink size={14} />
                        </div>
                    </div>

                </div>
            </div>

            {/* Upgrade Plans Section (Bottom) */}
            <div className="mt-12 pt-12 border-t border-gray-100">
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter">Comparativo de Planos</h2>
                    <p className="text-gray-500">Escolha o plano ideal para o tamanho da sua operação.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {UPGRADE_PLANS.map((p) => (
                        <div
                            key={p.name}
                            className={`
                                relative rounded-2xl p-6 border transition-all duration-300
                                ${p.current
                                    ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-xl scale-[1.02] z-10 bg-white'
                                    : 'border-gray-200 bg-gray-50 hover:bg-white hover:shadow-lg hover:border-indigo-200'
                                }
                            `}
                        >
                            {p.recommended && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-lg">
                                    Recomendado
                                </div>
                            )}
                            <h3 className="text-lg font-bold text-gray-800">{p.name}</h3>
                            <div className="my-4">
                                <span className="text-3xl font-black text-gray-900 tracking-tight">{p.price}</span>
                                <span className="text-sm text-gray-500">{p.period}</span>
                            </div>
                            <ul className="space-y-3 mb-6">
                                {p.features.map(f => (
                                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                                        <Check size={14} className={p.current ? "text-indigo-500" : "text-gray-400"} />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button
                                className={`
                                    w-full py-2.5 rounded-xl font-bold text-sm transition-all
                                    ${p.current
                                        ? 'bg-indigo-50 text-indigo-700 cursor-default'
                                        : 'bg-gray-800 text-white hover:bg-gray-900'
                                    }
                                `}
                                disabled={p.current}
                            >
                                {p.current ? 'Seu Plano Atual' : 'Selecionar Plano'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
