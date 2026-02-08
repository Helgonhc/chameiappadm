'use client';

import { Package, Search, Plus, AlertCircle, ShoppingCart, ArrowUpRight, ArrowDownLeft, MoreHorizontal, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const mockInventory = [
    {
        id: 'SKU-001',
        name: 'Sensor de Proximidade Indutivo M18',
        category: 'Sensores',
        stock: 12,
        minStock: 15,
        unit: 'Unid',
        price: 185.90,
    },
    {
        id: 'SKU-042',
        name: 'Óleo Hidráulico AW 68',
        category: 'Lubrificantes',
        stock: 200,
        minStock: 50,
        unit: 'Litros',
        price: 24.50,
    },
    {
        id: 'SKU-108',
        name: 'Contator Trifásico 32A 220V',
        category: 'Elétrica',
        stock: 3,
        minStock: 5,
        unit: 'Unid',
        price: 312.00,
    },
    {
        id: 'SKU-055',
        name: 'Filtro de Ar para Compressor GA37',
        category: 'Consumíveis',
        stock: 8,
        minStock: 10,
        unit: 'Unid',
        price: 450.00,
    },
];

export default function DemoInventoryPage() {
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
                        <Package className="text-amber-500" size={28} />
                        Gestão de Estoque
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Controle de peças, insumos e materiais técnicos.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleDemoAction('Entrada de Estoque')}
                        className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all shadow-sm"
                        title="Entrada"
                    >
                        <ArrowUpRight size={20} />
                    </button>
                    <button
                        onClick={() => handleDemoAction('Adicionar Item')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
                    >
                        <Plus size={20} />
                        Novo Item
                    </button>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Filtrar por Categoria</span>
                    </div>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Buscar no estoque..."
                            className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none"
                            readOnly
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700/50">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Item / SKU</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Quantidade</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Valor Unit.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                            {mockInventory.map((item) => {
                                const isLowStock = item.stock <= item.minStock;
                                return (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</div>
                                            <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">{item.id} • {item.category}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            {isLowStock ? (
                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 text-red-500 rounded-full text-[9px] font-black inline-flex uppercase">
                                                    <AlertCircle size={10} /> Estoque Baixo
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black inline-flex uppercase">
                                                    Ok
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="font-black text-slate-900 dark:text-white">{item.stock}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.unit}</div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="font-bold text-slate-900 dark:text-white">R$ {item.price.toFixed(2)}</div>
                                            <button
                                                onClick={() => handleDemoAction(`Ajustar preço de ${item.id}`)}
                                                className="text-[9px] text-blue-500 hover:underline font-bold uppercase mt-1"
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Strategic Highlight */}
            <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-amber-500/20 rounded-xl text-amber-500">
                        <ShoppingCart size={24} />
                    </div>
                    <div>
                        <h3 className="text-amber-600 dark:text-amber-400 font-black text-sm uppercase tracking-widest mb-1">Nunca fique sem peças</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Configure níveis mínimos de estoque para cada região ou técnico.
                            O sistema envia alertas automáticos quando um item precisa ser reposto, garantindo que suas visitas técnicas nunca parem por falta de material.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
