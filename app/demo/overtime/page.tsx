'use client';

import { Clock, TrendingUp, Calendar, ArrowUpRight, ArrowDownLeft, FileText, CheckCircle, Search, User, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const mockOvertime = [
    { id: 1, name: 'Carlos Silva', base: '160h', overtime: '12h 30m', total: '172h 30m', status: 'Verificado', rate: '85%' },
    { id: 2, name: 'Rafael Souza', base: '160h', overtime: '18h 45m', total: '178h 45m', status: 'Pendente', rate: '92%' },
    { id: 3, name: 'Fernanda Lima', base: '160h', overtime: '04h 15m', total: '164h 15m', status: 'Verificado', rate: '78%' },
    { id: 4, name: 'Marcos Oliveira', base: '160h', overtime: '25h 00m', total: '185h 00m', status: 'Alerta', rate: '95%' },
];

export default function DemoOvertimePage() {
    const handleDemoAction = (action: string) => {
        toast(`🔒 "${action}" desabilitado no modo demonstração`, {
            icon: 'ℹ️',
            duration: 2000,
        });
    };

    return (
        <div className="space-y-6 animate-fadeIn p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        <Clock className="text-blue-500" size={28} />
                        Banco de Horas Técnicas
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Controle de produtividade e horas extras da equipe de campo.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleDemoAction('Exportar Relatório')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                    >
                        <FileText size={18} />
                        Exportar PDF
                    </button>
                    <button
                        onClick={() => handleDemoAction('Ajustar Escala')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                    >
                        Ajustar Escala
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Horas Campo</span>
                        <ArrowUpRight size={16} className="text-emerald-500" />
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">684h 30m</p>
                    <p className="text-[10px] text-emerald-500 font-bold mt-1">+12% vs mês anterior</p>
                </div>
                <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Utilização Médio</span>
                        <TrendingUp size={16} className="text-blue-500" />
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">88%</p>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-blue-500 h-full w-[88%]"></div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Horas Extras Acum.</span>
                        <Clock size={16} className="text-amber-500" />
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">60h 30m</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Média de 15h por técnico</p>
                </div>
            </div>

            {/* Technicians List */}
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <h2 className="text-xs font-black uppercase tracking-[2px] text-slate-500">Métricas por Técnico</h2>
                    <div className="flex gap-2">
                        <Search size={16} className="text-slate-400" />
                        <Filter size={16} className="text-slate-400" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700/50">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Técnico</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Horas Base</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Horas Extras</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Uso</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                            {mockOvertime.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                                    <td className="px-6 py-5 flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xs font-black text-slate-500">{item.name.charAt(0)}</div>
                                        <span className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</span>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-500 font-bold">{item.base}</td>
                                    <td className="px-6 py-5 font-black text-slate-900 dark:text-white text-sm">{item.overtime}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-slate-100 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                                                <div className={`h-full ${parseInt(item.rate) > 90 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: item.rate }}></div>
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400">{item.rate}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase inline-flex items-center gap-1.5 ${item.status === 'Verificado' ? 'bg-emerald-500/10 text-emerald-500' :
                                                item.status === 'Alerta' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-blue-500/10 text-blue-500'
                                            }`}>
                                            {item.status === 'Verificado' && <CheckCircle size={10} />}
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Strategic Highlight */}
            <div className="bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-500/20 rounded-xl text-blue-500">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h3 className="text-blue-600 dark:text-blue-400 font-black text-sm uppercase tracking-widest mb-1">Visibilidade Total da Produtividade</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Compare o tempo planejado vs tempo executado em tempo real.
                            O sistema utiliza a localização via app mobile para validar a presença no cliente e calcular automaticamente as horas trabalhadas,
                            eliminando erros de digitação e fraudes em ordens de serviço.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
