'use client';

import { useState, useMemo, useEffect } from 'react';
import {
    Zap,
    Plus,
    Trash2,
    Search,
    Info,
    ChevronRight,
    Minus,
    FileText,
    User,
    Users,
    ChevronDown,
    Loader2,
    UserPlus,
    Save
} from 'lucide-react';
import { COMMON_EQUIPMENTS } from '@/lib/loadSurveyConstants';
import { LoadSurveyItem, ElectricalEquipment } from '@/types/load-survey';
import toast from 'react-hot-toast';
import { generateLoadSurveyPDF } from '@/utils/pdfGenerator';
import { useAuthStore } from '@/store/authStore';

// Mock Interfaces
interface Client {
    id: string;
    name: string;
    cnpj_cpf: string;
    email: string;
    phone: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
}

interface SavedSurvey {
    id: string;
    client_id: string;
    title: string;
    created_at: string;
    items: LoadSurveyItem[];
    total_watts: number;
}

export default function LoadSurveyPage() {
    // --- State ---
    const [items, setItems] = useState<LoadSurveyItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [surveyTitle, setSurveyTitle] = useState('Novo Levantamento');

    // Clients
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [clientSearch, setClientSearch] = useState('');
    const [showClientList, setShowClientList] = useState(false);

    // Saving/History
    const [savedSurveys, setSavedSurveys] = useState<SavedSurvey[]>([]);
    const [showSavedModal, setShowSavedModal] = useState(false);
    const [savingSurvey, setSavingSurvey] = useState(false);
    const [currentSurveyId, setCurrentSurveyId] = useState<string | null>(null);

    // Mock Data Loading
    useEffect(() => {
        loadMockClients();
        loadMockSavedSurveys();
    }, []);

    // --- Mock Data Functions ---
    const loadMockClients = () => {
        const mockClients: Client[] = [
            { id: '1', name: 'Tech Solutions Ltda', cnpj_cpf: '12.345.678/0001-90', email: 'contato@tech.com', phone: '(11) 98765-4321', street: 'Av. Paulista', number: '1000', neighborhood: 'Bela Vista', city: 'São Paulo', state: 'SP' },
            { id: '2', name: 'Indústria ABC S.A.', cnpj_cpf: '98.765.432/0001-10', email: 'eng@abc.com', phone: '(11) 3333-4444', street: 'Rua das Indústrias', number: '500', neighborhood: 'Industrial', city: 'Barueri', state: 'SP' },
            { id: '3', name: 'Condomínio Solar', cnpj_cpf: '55.555.555/0001-55', email: 'adm@solar.com', phone: '(21) 99999-8888', street: 'Rua do Sol', number: '123', neighborhood: 'Copacabana', city: 'Rio de Janeiro', state: 'RJ' },
            { id: '4', name: 'Fazenda Boa Esperança', cnpj_cpf: '11.111.111/0001-11', email: 'contato@fazenda.com', phone: '(62) 97777-6666', street: 'Rodovia BR-153', number: 'KM 45', neighborhood: 'Rural', city: 'Anápolis', state: 'GO' },
        ];
        setClients(mockClients);
    };

    const loadMockSavedSurveys = () => {
        const mockSurveys: SavedSurvey[] = [
            {
                id: '101',
                client_id: '1',
                title: 'Ampliação Servidores',
                created_at: new Date(Date.now() - 86400000).toISOString(),
                total_watts: 15500,
                items: [
                    { id: 'item-1', equipmentId: 'ups-1', name: 'Nobreak 3kVA', quantity: 2, power: 3000, totalPower: 6000, voltage: 220 },
                    { id: 'item-2', equipmentId: 'ac-1', name: 'Ar Condicionado 12000 BTUs', quantity: 3, power: 1500, totalPower: 4500, voltage: 220 },
                ]
            },
            {
                id: '102',
                client_id: '2',
                title: 'Galpão Principal',
                created_at: new Date(Date.now() - 172800000).toISOString(),
                total_watts: 45000,
                items: [
                    { id: 'item-3', equipmentId: 'motor-1', name: 'Motor Trifásico 10CV', quantity: 4, power: 7500, totalPower: 30000, voltage: 380 },
                    { id: 'item-4', equipmentId: 'light-1', name: 'Refletor LED 200W', quantity: 20, power: 200, totalPower: 4000, voltage: 220 },
                ]
            }
        ];
        setSavedSurveys(mockSurveys);
    };


    // --- Actions ---
    const handleSaveSurvey = async () => {
        if (!selectedClient) {
            toast.error('Selecione um cliente para salvar');
            return;
        }
        if (items.length === 0) {
            toast.error('O levantamento está vazio');
            return;
        }

        setSavingSurvey(true);
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 800));

        const newSurvey: SavedSurvey = {
            id: currentSurveyId || crypto.randomUUID(),
            client_id: selectedClient.id,
            title: surveyTitle,
            created_at: new Date().toISOString(),
            items: [...items],
            total_watts: totals.watts
        };

        if (currentSurveyId) {
            setSavedSurveys(prev => prev.map(s => s.id === currentSurveyId ? newSurvey : s));
            toast.success('Levantamento atualizado!');
        } else {
            setSavedSurveys(prev => [newSurvey, ...prev]);
            setCurrentSurveyId(newSurvey.id);
            toast.success('Levantamento salvo!');
        }
        setSavingSurvey(false);
    };

    const loadSurvey = (survey: SavedSurvey) => {
        setCurrentSurveyId(survey.id);
        setSurveyTitle(survey.title);
        setItems(JSON.parse(JSON.stringify(survey.items))); // Deep copy
        const client = clients.find(c => c.id === survey.client_id);
        if (client) setSelectedClient(client);
        setShowSavedModal(false);
        toast.success(`Levantamento "${survey.title}" carregado`);
    };

    // --- Calculation Logic ---
    const addItem = (equip: ElectricalEquipment) => {
        const newItem: LoadSurveyItem = {
            id: crypto.randomUUID(),
            equipmentId: equip.id,
            name: equip.name,
            quantity: 1,
            power: equip.defaultPower,
            totalPower: equip.defaultPower,
            voltage: 220, // Default to 220V
        };
        setItems(prev => [newItem, ...prev]); // Add to top
        toast.success(`${equip.name} adicionado`);
    };

    const removeItem = (id: string) => setItems(prev => prev.filter(item => item.id !== id));

    const updateQuantity = (id: string, delta: number) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty, totalPower: newQty * item.power };
            }
            return item;
        }));
    };

    const updatePower = (id: string, newPower: number) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) return { ...item, power: newPower, totalPower: item.quantity * newPower };
            return item;
        }));
    };

    const updateCustomName = (id: string, newName: string) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) return { ...item, customName: newName };
            return item;
        }));
    };

    const updateVoltage = (id: string, newVoltage: 127 | 220 | 380) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) return { ...item, voltage: newVoltage };
            return item;
        }));
    };

    // Totals Memo
    const totals = useMemo(() => {
        const totalWatts = items.reduce((sum, item) => sum + item.totalPower, 0);
        let watts127 = 0, watts220 = 0, watts380 = 0;

        items.forEach(item => {
            const subtotal = item.totalPower;
            const v = Number(item.voltage);
            if (v === 127) watts127 += subtotal;
            else if (v === 380) watts380 += subtotal;
            else watts220 += subtotal;
        });

        const amps127 = watts127 > 0 ? (watts127 / 127) : 0;
        const amps220 = watts220 > 0 ? (watts220 / 220) : 0;
        const amps380 = watts380 > 0 ? (watts380 / (380 * 1.73205)) : 0;

        return {
            watts: totalWatts,
            kw: totalWatts / 1000,
            amperes: amps127 + amps220 + amps380,
            breakdown: {
                v127: { watts: watts127, amps: amps127 },
                v220: { watts: watts220, amps: amps220 },
                v380: { watts: watts380, amps: amps380 }
            }
        };
    }, [items]);

    // Filtering
    const filteredEquipments = useMemo(() => {
        return COMMON_EQUIPMENTS.filter(e =>
            e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const filteredClients = clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()));

    // PDF Export
    const handleExportPDF = async () => {
        if (!selectedClient) {
            toast.error('Selecione um cliente para gerar o PDF');
            return;
        }
        if (items.length === 0) {
            toast.error('Adicione equipamentos primeiro');
            return;
        }

        try {
            const surveyData = {
                id: currentSurveyId || 'PROVISORIO',
                created_at: new Date().toISOString(),
                clients: { ...selectedClient, document: selectedClient.cnpj_cpf }, // Map for PDF generator compatibility
                items: items.map(item => ({
                    ...item,
                    name: item.equipmentId === 'custom' ? (item.customName || 'Item Customizado') : item.name
                })),
                totals: totals
            };

            await generateLoadSurveyPDF(surveyData);
            toast.success('PDF Gerado com sucesso!');
        } catch (error) {
            console.error(error);
            toast.error('Erro na geração do PDF');
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn pb-20 max-w-[1600px] mx-auto">
            {/* --- Header --- */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-100 rotate-3 transition-transform hover:rotate-0 duration-300">
                        <Zap className="text-white -rotate-3 transition-transform group-hover:rotate-0" size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                            Levantamento de Cargas
                        </h1>
                        <input
                            type="text"
                            value={surveyTitle}
                            onChange={(e) => setSurveyTitle(e.target.value)}
                            className="mt-1 bg-transparent border-b border-dashed border-slate-300 focus:border-indigo-500 outline-none text-xs font-bold uppercase tracking-widest text-slate-500 w-64 block"
                            placeholder="NOME DO PROJETO"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSaveSurvey}
                        disabled={savingSurvey}
                        className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {savingSurvey ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {currentSurveyId ? 'Atualizar' : 'Salvar'}
                    </button>

                    <button
                        onClick={() => setShowSavedModal(true)}
                        className="flex items-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:shadow-lg"
                    >
                        <Search size={16} />
                        Histórico
                    </button>

                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all hover:shadow-lg shadow-red-100"
                    >
                        <FileText size={16} />
                        PDF
                    </button>

                    <button
                        onClick={() => {
                            if (confirm("Limpar todo o levantamento atual?")) {
                                setItems([]);
                                setSelectedClient(null);
                                setCurrentSurveyId(null);
                                setSurveyTitle('Novo Levantamento');
                            }
                        }}
                        className="p-3.5 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 rounded-xl transition-all"
                        title="Limpar tudo"
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>

            {/* --- Client Selection --- */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
                <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Cliente</p>
                        <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">Identificação</p>
                    </div>
                </div>

                <div className="flex-1 w-full relative">
                    <button
                        onClick={() => setShowClientList(!showClientList)}
                        className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-transparent hover:border-indigo-200 transition-all text-left group"
                    >
                        <span className={`font-bold text-sm ${selectedClient ? 'text-indigo-900' : 'text-slate-400'}`}>
                            {selectedClient ? selectedClient.name : 'Selecionar Cliente da Base...'}
                        </span>
                        <ChevronDown size={20} className={`text-slate-400 transition-transform ${showClientList ? 'rotate-180' : ''}`} />
                    </button>

                    {showClientList && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-2 animate-slideDown max-h-80 overflow-hidden flex flex-col">
                            <div className="p-2">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Filtrar clientes..."
                                    className="w-full p-3 bg-slate-50 rounded-xl text-sm font-semibold outline-none border border-transparent focus:border-indigo-200"
                                    value={clientSearch}
                                    onChange={e => setClientSearch(e.target.value)}
                                />
                            </div>
                            <div className="overflow-y-auto custom-scrollbar p-2 space-y-1">
                                {filteredClients.map(client => (
                                    <button
                                        key={client.id}
                                        onClick={() => {
                                            setSelectedClient(client);
                                            setShowClientList(false);
                                            setClientSearch('');
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-indigo-50 rounded-xl text-sm font-bold text-slate-600 hover:text-indigo-700 transition-colors flex justify-between items-center"
                                    >
                                        <span>{client.name}</span>
                                        {selectedClient?.id === client.id && <CheckIcon size={16} />}
                                    </button>
                                ))}
                                {filteredClients.length === 0 && (
                                    <p className="text-center py-4 text-xs font-bold text-slate-400 uppercase">Nenhum cliente encontrado</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="hidden md:block w-px h-12 bg-slate-100"></div>
                <div className="w-full md:w-auto">
                    <p className="text-xs text-slate-400 mb-1 font-semibold">Status do Projeto</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-sm font-bold text-slate-700">Em Andamento</span>
                    </div>
                </div>
            </div>

            {/* --- Dashboard Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 127V */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 font-black text-xs">127V</div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Fase-Neutro</span>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-800">{totals.breakdown.v127.watts.toLocaleString()} W</p>
                        <p className="text-sm font-bold text-red-500">{totals.breakdown.v127.amps.toFixed(1)} A</p>
                    </div>
                </div>

                {/* 220V */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 font-black text-xs">220V</div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Fase-Fase</span>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-800">{totals.breakdown.v220.watts.toLocaleString()} W</p>
                        <p className="text-sm font-bold text-blue-500">{totals.breakdown.v220.amps.toFixed(1)} A</p>
                    </div>
                </div>

                {/* 380V */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 font-black text-xs">380V</div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Trifásico</span>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-slate-800">{totals.breakdown.v380.watts.toLocaleString()} W</p>
                        <p className="text-sm font-bold text-amber-500">{totals.breakdown.v380.amps.toFixed(1)} A</p>
                    </div>
                </div>

                {/* Total */}
                <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white"><Zap size={18} /></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Geral</span>
                        </div>
                        <div>
                            <p className="text-3xl font-black">{totals.watts.toLocaleString()} W</p>
                            <p className="text-sm font-bold text-indigo-300">{totals.kw.toFixed(2)} kW</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Main Content Grid --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Items List */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Itens Adicionados</h2>
                            <span className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-black text-slate-500 uppercase">{items.length} COMPONENTES</span>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[800px] custom-scrollbar p-2">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-50">
                                    <Zap size={64} className="text-slate-200 mb-4" />
                                    <p className="text-lg font-bold text-slate-400">Nenhum equipamento adicionado</p>
                                    <p className="text-sm text-slate-300">Selecione itens no catálogo ao lado para começar o cálculo.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {items.map(item => (
                                        <div key={item.id} className="group p-6 rounded-[2.5rem] bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl transition-all duration-300">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 group-hover:text-indigo-500 transition-colors">
                                                    <Zap size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    {item.equipmentId === 'custom' ? (
                                                        <input
                                                            type="text"
                                                            value={item.customName || ''}
                                                            placeholder="Nome do Equipamento"
                                                            onChange={(e) => updateCustomName(item.id, e.target.value)}
                                                            className="w-full bg-transparent border-b border-transparent focus:border-indigo-300 outline-none text-lg font-black text-slate-800 uppercase tracking-tight"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight pt-1">{item.name}</h3>
                                                    )}
                                                </div>
                                                <button onClick={() => removeItem(item.id)} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white rounded-2xl p-2 border border-slate-100">
                                                {/* Power */}
                                                <div className="md:col-span-3 px-3">
                                                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Potência</label>
                                                    <div className="flex items-center gap-1">
                                                        <input
                                                            type="number"
                                                            value={item.power}
                                                            onChange={(e) => updatePower(item.id, Number(e.target.value))}
                                                            className="w-full font-black text-indigo-600 bg-transparent outline-none"
                                                        />
                                                        <span className="text-xs font-bold text-slate-400">W</span>
                                                    </div>
                                                </div>

                                                {/* Voltage */}
                                                <div className="md:col-span-4 flex bg-slate-50 rounded-xl p-1">
                                                    {[127, 220, 380].map((v) => (
                                                        <button
                                                            key={v}
                                                            onClick={() => updateVoltage(item.id, v as any)}
                                                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${item.voltage === v ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                                        >
                                                            {v}V
                                                        </button>
                                                    ))}
                                                </div>

                                                {/* Qty */}
                                                <div className="md:col-span-3 flex items-center justify-center gap-3">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500">-</button>
                                                    <span className="font-black text-slate-800">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-500">+</button>
                                                </div>

                                                {/* Subtotal */}
                                                <div className="md:col-span-2 text-right px-4">
                                                    <span className="block text-[10px] font-black text-slate-300 uppercase tracking-widest">Total</span>
                                                    <span className="font-black text-slate-800">{item.totalPower} W</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Catalog */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden h-[800px] flex flex-col">
                        <div className="p-8 border-b border-slate-50">
                            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-4">Catálogo</h2>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar equipamento..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl text-sm font-bold border border-transparent focus:border-indigo-100 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                            {filteredEquipments.map(equip => (
                                <button
                                    key={equip.id}
                                    onClick={() => addItem(equip)}
                                    className="w-full text-left p-4 rounded-[1.5rem] hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all group flex items-start gap-4"
                                >
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors shrink-0">
                                        <Zap size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-700 group-hover:text-indigo-900 text-xs uppercase tracking-tight">{equip.name}</p>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded group-hover:bg-white">{equip.defaultPower} W</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">{equip.category}</span>
                                        </div>
                                    </div>
                                    <div className="ml-auto opacity-0 group-hover:opacity-100 text-indigo-500 transition-opacity">
                                        <Plus size={20} />
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="p-6 border-t border-slate-50 bg-slate-50/50">
                            <button
                                onClick={() => {
                                    const custom = COMMON_EQUIPMENTS.find(e => e.id === 'custom');
                                    if (custom) addItem(custom);
                                }}
                                className="w-full py-4 bg-slate-800 hover:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={16} />
                                Item Personalizado
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Saved Modal */}
            {showSavedModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoomIn">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Histórico</h2>
                            <button onClick={() => setShowSavedModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors">
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-2">
                            {savedSurveys.map(survey => {
                                const clientName = clients.find(c => c.id === survey.client_id)?.name || 'Cliente Desconhecido';
                                return (
                                    <button
                                        key={survey.id}
                                        onClick={() => loadSurvey(survey)}
                                        className="w-full text-left p-6 rounded-[2rem] bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-black text-slate-800 text-lg">{survey.title}</h3>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{clientName}</p>
                                            </div>
                                            <span className="px-3 py-1 bg-white rounded-lg text-xs font-black text-indigo-600 shadow-sm">{survey.total_watts.toLocaleString()} W</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mt-4">
                                            <div className="flex items-center gap-1">
                                                <User size={14} />
                                                <span>{new Date(survey.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Zap size={14} />
                                                <span>{survey.items.length} itens</span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Simple Icon Component (CheckIcon is missing in imports, adding locally)
const CheckIcon = ({ size }: { size: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-indigo-600"
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
