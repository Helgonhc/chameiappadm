'use client';

import { useState } from 'react';
import { UploadCloud, FileText, Search, Plus, Filter, CheckCircle2, AlertCircle, Clock, ArrowRight, Table, Settings, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const mockBatches = [
    { id: 'BATCH-001', type: 'Clientes', date: '2024-02-05', count: 120, status: 'Processado', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'BATCH-002', type: 'Equipamentos', date: '2024-02-06', count: 450, status: 'Erro Parcial', color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'BATCH-003', type: 'Locais', date: '2024-02-07', count: 85, status: 'Processando', color: 'text-blue-500', bg: 'bg-blue-50' },
];

export default function DemoLoadSurveyPage() {
    const [dragging, setDragging] = useState(false);

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
                        Carga de Dados <span className="text-indigo-600 text-sm font-black opacity-50 uppercase tracking-widest">Demo</span>
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">Importação massiva de ativos para implantação rápida.</p>
                </div>
                <button
                    onClick={() => handleDemoAction('Baixar Template')}
                    className="btn bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                    <Table size={18} /> Baixar Planilha Modelo
                </button>
            </div>

            {/* Upload Area */}
            <div
                className={`bg-white rounded-[3rem] border-2 border-dashed p-16 transition-all flex flex-col items-center text-center group cursor-pointer ${dragging ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]' : 'border-gray-100 bg-gray-50/30'
                    }`}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onClick={() => handleDemoAction('Upload Arquivo')}
            >
                <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 transition-transform group-hover:scale-110 shadow-2xl ${dragging ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'
                    }`}>
                    <UploadCloud size={40} />
                </div>
                <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tighter mb-4">Arraste seu arquivo aqui</h2>
                <p className="text-gray-400 text-sm font-medium mb-10 max-w-sm">
                    Suporta arquivos CSV, XLSX e JSON. Tamanho máximo de 50MB por carga.
                </p>
                <button className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[2px] shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95">
                    Selecionar Arquivo
                </button>
            </div>

            {/* Quick Tips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { title: 'Passo 1', desc: 'Baixe o modelo e preencha as colunas.', icon: <Table size={20} className="text-amber-500" /> },
                    { title: 'Passo 2', desc: 'Suba o arquivo para validação prévia.', icon: <Zap size={20} className="text-indigo-500" /> },
                    { title: 'Passo 3', desc: 'Inicie a importação final para o banco.', icon: <CheckCircle2 size={20} className="text-emerald-500" /> },
                ].map((step, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0">
                            {step.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{step.title}</p>
                            <p className="text-xs font-bold text-gray-600">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* History Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={18} className="text-indigo-600" />
                        Histórico de Cargas
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID / Tipo</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Data</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Registros</th>
                                <th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {mockBatches.map((batch) => (
                                <tr key={batch.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                                                <FileText size={18} className="text-indigo-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-800 uppercase tracking-tight">{batch.id}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{batch.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{new Date(batch.date).toLocaleDateString('pt-BR')}</span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="text-sm font-black text-gray-700">{batch.count}</span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${batch.bg} ${batch.color} border-current opacity-70`}>
                                            {batch.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => handleDemoAction(`Ver log ${batch.id}`)}
                                            className="p-2 text-gray-300 hover:text-indigo-600 transition-colors"
                                        >
                                            <ArrowRight size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pro Advice Section */}
            <div className="bg-amber-50 border border-amber-100 rounded-[3rem] p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl -mr-32 -mt-32 transform group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-20 h-20 bg-amber-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-amber-200 shrink-0">
                        <Settings size={40} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl font-black text-amber-900 uppercase tracking-tighter mb-4">Migração Facilitada</h3>
                        <p className="text-amber-800/60 text-sm font-medium leading-relaxed max-w-lg">
                            Está vindo de outro software ou planilhas antigas? Nossa equipe de suporte realiza a higienização e importação dos seus dados sem custo adicional na implantação.
                        </p>
                    </div>
                    <button
                        onClick={() => handleDemoAction('Agendar Migração')}
                        className="bg-amber-500 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[2px] hover:bg-amber-600 transition-all active:scale-95 shadow-xl shadow-amber-100"
                    >
                        Solicitar Apoio
                    </button>
                </div>
            </div>
        </div>
    );
}
