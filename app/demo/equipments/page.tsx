'use client';

import { Wrench, Plus, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const mockEquipments = [
    { id: 1, name: 'Ar Condicionado Central', brand: 'Carrier', model: 'X-Power', client: 'Empresa Demo LTDA', status: 'Operacional' },
    { id: 2, name: 'Gerador 500kVA', brand: 'Caterpillar', model: 'C15', client: 'Tech Solutions Inc', status: 'Manutenção' },
    { id: 3, name: 'Elevador de Cargas', brand: 'Atlas Schindler', model: 'Pro-Lift', client: 'Indústrias Exemplo S.A.', status: 'Operacional' },
    { id: 4, name: 'Chiller 200 TR', brand: 'Trane', model: 'AquaStream', client: 'Empresa Demo LTDA', status: 'Crítico' },
];

export default function DemoEquipmentsPage() {
    const handleAction = (name: string) => {
        toast(`🔒 "${name}" desabilitado no modo demonstração`, { icon: 'ℹ️' });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <Wrench className="text-emerald-500" size={32} />
                        Equipamentos
                    </h1>
                    <p className="text-slate-400 mt-2">Gerenciamento de ativos e maquinário</p>
                </div>
                <button onClick={() => handleAction('Novo Equipamento')} className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-600 transition-all flex items-center gap-2">
                    <Plus size={20} />
                    Adicionar
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total', value: 156, color: 'text-white' },
                    { label: 'Operacionais', value: 132, color: 'text-emerald-500' },
                    { label: 'Em Manutenção', value: 18, color: 'text-yellow-500' },
                    { label: 'Críticos', value: 6, color: 'text-red-500' },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-800/50 border border-white/10 p-5 rounded-2xl">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                        <p className={`text-4xl font-black mt-2 ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-slate-900/50 border border-white/5 rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Equipamento</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Cliente</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {mockEquipments.map((eq) => (
                            <tr key={eq.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="text-white font-bold text-sm">{eq.name}</p>
                                    <p className="text-slate-500 text-xs">{eq.brand} • {eq.model}</p>
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-sm">{eq.client}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${eq.status === 'Operacional' ? 'bg-emerald-500/10 text-emerald-500' :
                                            eq.status === 'Manutenção' ? 'bg-yellow-500/10 text-yellow-500' :
                                                'bg-red-500/10 text-red-500'
                                        }`}>
                                        {eq.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => handleAction('Editar')} className="text-emerald-500 hover:text-emerald-400 font-bold text-xs uppercase tracking-widest">Ver Detalhes</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
