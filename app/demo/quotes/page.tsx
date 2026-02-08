'use client';

import { Calculator, Plus, Search, FileText, CheckCircle, Clock, XCircle, DollarSign, Download, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const mockQuotes = [
    {
        id: 'ORC-2024-088',
        client: 'Indústria Têxtil Fenix',
        value: 12500.00,
        status: 'Aprovado',
        date: '2024-02-01',
        description: 'Reforma completa do barramento principal e troca de contatores.',
    },
    {
        id: 'ORC-2024-092',
        client: 'Condomínio Solar',
        value: 1850.00,
        status: 'Pendente',
        date: '2024-02-05',
        description: 'Substituição de bomba submersa e válvula de retenção.',
    },
    {
        id: 'ORC-2024-095',
        client: 'Shopping Plaza',
        value: 45200.00,
        status: 'Enviado',
        date: '2024-02-06',
        description: 'Manutenção preventiva em 12 chillers e substituição de filtros.',
    },
    {
        id: 'ORC-2024-085',
        client: 'Academia FitPlus',
        value: 980.00,
        status: 'Recusado',
        date: '2024-01-28',
        description: 'Reparo em esteira ergométrica Matrix.',
    },
];

export default function DemoQuotesPage() {
    const handleDemoAction = (action: string) => {
        toast(`🔒 "${action}" desabilitado no modo demonstração`, {
            icon: 'ℹ️',
            duration: 2000,
        });
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Aprovado': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'Pendente': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'Enviado': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'Recusado': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        <Calculator className="text-emerald-500" size={28} />
                        Orçamentos & Propostas
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Gerencie suas propostas comerciais e aprovações.</p>
                </div>
                <button
                    onClick={() => handleDemoAction('Novo Orçamento')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                >
                    <Plus size={20} />
                    Criar Orçamento
                </button>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-6 rounded-2xl shadow-sm">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Pendente</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">R$ 47.050,00</p>
                </div>
                <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-6 rounded-2xl shadow-sm border-l-4 border-l-emerald-500">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Aprovados (Mês)</p>
                    <p className="text-3xl font-black text-emerald-500">R$ 12.500,00</p>
                </div>
                <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-6 rounded-2xl shadow-sm">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Taxa de Conversão</p>
                    <p className="text-3xl font-black text-blue-500">72%</p>
                </div>
            </div>

            {/* Quotes List */}
            <div className="grid gap-4">
                {mockQuotes.map((quote) => (
                    <div key={quote.id} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 p-5 rounded-2xl hover:border-emerald-500/30 transition-all shadow-sm group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-black text-slate-900 dark:text-white text-base">{quote.id}</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getStatusStyles(quote.status)} uppercase tracking-wider`}>
                                        {quote.status}
                                    </span>
                                </div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-300 text-sm mb-1">{quote.client}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-1">{quote.description}</p>
                            </div>

                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
                                <div className="text-xl font-black text-slate-900 dark:text-white">
                                    {quote.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(quote.date).toLocaleDateString('pt-BR')}</div>
                            </div>

                            <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700/50 pt-4 md:pt-0 md:pl-6">
                                <button
                                    onClick={() => handleDemoAction(`WhatsApp p/ ${quote.client}`)}
                                    className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-all"
                                    title="Enviar via WhatsApp"
                                >
                                    <Send size={18} />
                                </button>
                                <button
                                    onClick={() => handleDemoAction(`Download PDF ${quote.id}`)}
                                    className="p-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                    title="Baixar PDF"
                                >
                                    <Download size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Note */}
            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-500">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <h3 className="text-emerald-600 dark:text-emerald-400 font-black text-sm uppercase tracking-widest mb-1">Faturamento Descomplicado</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Gere orçamentos profissionais em segundos, com base em tabelas de preços e horas técnicas.
                            Envie diretamente para o WhatsApp do cliente e receba aprovações digitais integradas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
