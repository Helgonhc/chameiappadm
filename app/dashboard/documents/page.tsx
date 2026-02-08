'use client';

import { useState, useEffect } from 'react';
import {
    File, Download, Search, Folder, Calendar, HardDrive,
    ChevronRight, Home, ArrowLeft, Users, Building2, Trash2,
    Plus, MoreVertical, Grid, List as ListIcon, Star, Clock,
    Cloud, FileText, Image as ImageIcon, FileSpreadsheet,
    Upload, X, Check, Share2, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

// --- MOCK DATA TYPES ---
type DocFile = {
    id: string;
    title: string;
    type: 'pdf' | 'doc' | 'xls' | 'img' | 'other';
    size: string;
    date: string;
    starred?: boolean;
    shared?: boolean;
    author: string;
};

type DocFolder = {
    id: string;
    name: string;
    count: number;
    color: string;
    updated: string;
};

type Client = {
    id: string;
    name: string;
    logo?: string;
    storageUsed: string;
    totalFiles: number;
};

// --- MOCK DATA GENERATION ---
const MOCK_CLIENTS: Client[] = [
    { id: '1', name: 'Condomínio Solar das Américas', storageUsed: '4.2 GB', totalFiles: 128 },
    { id: '2', name: 'Indústria Metalúrgica ABC', storageUsed: '12.5 GB', totalFiles: 432 },
    { id: '3', name: 'Hospital Santa Clara', storageUsed: '8.1 GB', totalFiles: 256 },
    { id: '4', name: 'Escola Internacional', storageUsed: '2.3 GB', totalFiles: 89 },
    { id: '5', name: 'Shopping Center Norte', storageUsed: '15.2 GB', totalFiles: 512 },
];

const MOCK_FOLDERS: DocFolder[] = [
    { id: 'f1', name: 'Contratos e Propostas', count: 12, color: 'text-blue-500 bg-blue-50', updated: 'Hoje' },
    { id: 'f2', name: 'Manuais Técnicos', count: 45, color: 'text-orange-500 bg-orange-50', updated: 'Ontem' },
    { id: 'f3', name: 'Relatórios de Manutenção', count: 89, color: 'text-emerald-500 bg-emerald-50', updated: '3 dias atrás' },
    { id: 'f4', name: 'Notas Fiscais', count: 156, color: 'text-purple-500 bg-purple-50', updated: 'Semana passada' },
    { id: 'f5', name: 'Projetos e Plantas', count: 8, color: 'text-pink-500 bg-pink-50', updated: 'Mês passado' },
];

const MOCK_FILES: DocFile[] = [
    { id: '1', title: 'Contrato de Prestação de Serviços 2024.pdf', type: 'pdf', size: '2.4 MB', date: '10/02/2024', author: 'Ana Silva', starred: true },
    { id: '2', title: 'Manual do Ar Condicionado Split.pdf', type: 'pdf', size: '5.1 MB', date: '08/02/2024', author: 'Carlos Souza' },
    { id: '3', title: 'Relatório Fotográfico Visita Técnica.docx', type: 'doc', size: '12.4 MB', date: '05/02/2024', author: 'Roberto Tech', shared: true },
    { id: '4', title: 'Planilha de Custos Manutenção.xlsx', type: 'xls', size: '45 KB', date: '01/02/2024', author: 'Financeiro', starred: true },
    { id: '5', title: 'Foto Quadro Elétrico Antes.jpg', type: 'img', size: '3.2 MB', date: '28/01/2024', author: 'Tech Mobile' },
    { id: '6', title: 'Foto Quadro Elétrico Depois.jpg', type: 'img', size: '3.1 MB', date: '28/01/2024', author: 'Tech Mobile' },
    { id: '7', title: 'Aditivo Contratual 01.pdf', type: 'pdf', size: '1.2 MB', date: '15/01/2024', author: 'Ana Silva' },
    { id: '8', title: 'Cronograma 2024.xlsx', type: 'xls', size: '22 KB', date: '10/01/2024', author: 'Gestão' },
];

export default function GlobalDocumentsPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentSection, setCurrentSection] = useState<'all' | 'recent' | 'trash'>('all');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Simulate navigation
    const [currentPath, setCurrentPath] = useState<string[]>([]);

    // Derived state
    const filteredFiles = MOCK_FILES.filter(f => f.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const FileIcon = ({ type, className }: { type: string, className?: string }) => {
        switch (type) {
            case 'pdf': return <FileText className={`text-red-500 ${className}`} />;
            case 'doc': return <FileText className={`text-blue-500 ${className}`} />;
            case 'xls': return <FileSpreadsheet className={`text-emerald-500 ${className}`} />;
            case 'img': return <ImageIcon className={`text-purple-500 ${className}`} />;
            default: return <File className={`text-gray-500 ${className}`} />;
        }
    };

    const handleUpload = () => {
        setIsUploading(true);
        setTimeout(() => {
            setIsUploading(false);
            toast.success('Arquivo enviado com sucesso!');
        }, 2000);
    };

    return (
        <div className="flex h-[calc(100vh-100px)] animate-fadeIn gap-6">
            {/* --- SIDEBAR --- */}
            <div className="w-64 flex-shrink-0 hidden md:flex flex-col gap-6">
                <button
                    onClick={handleUpload}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-4 rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus size={20} /> Novo Upload
                </button>

                <div className="space-y-1">
                    <button
                        onClick={() => { setCurrentSection('all'); setSelectedClient(null); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentSection === 'all' && !selectedClient ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                    >
                        <HardDrive size={18} /> Todos os Arquivos
                    </button>
                    <button
                        onClick={() => setCurrentSection('recent')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentSection === 'recent' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                    >
                        <Clock size={18} /> Recentes
                    </button>
                    <button
                        onClick={() => setCurrentSection('trash')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentSection === 'trash' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                    >
                        <Trash2 size={18} /> Lixeira
                    </button>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-white/10">
                    <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Clientes</h3>
                    <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {MOCK_CLIENTS.map(client => (
                            <button
                                key={client.id}
                                onClick={() => { setSelectedClient(client); setCurrentSection('all'); }}
                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${selectedClient?.id === client.id ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                            >
                                <Building2 size={16} className="text-gray-400" />
                                <span className="truncate text-left">{client.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Storage Widget */}
                <div className="mt-auto bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-gray-700 dark:text-white font-bold text-sm">
                        <Cloud size={16} className="text-indigo-500" />
                        Armazenamento
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-indigo-500 w-[65%] rounded-full"></div>
                    </div>
                    <p className="text-xs text-gray-500">65 GB de 100 GB usados</p>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="md:hidden">
                            {/* Mobile Menu Trigger (Mock) */}
                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><ListIcon size={20} /></button>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            {selectedClient ? selectedClient.name :
                                currentSection === 'recent' ? 'Arquivos Recentes' :
                                    currentSection === 'trash' ? 'Lixeira' : 'Todos os Documentos'}
                        </h2>
                    </div>

                    <div className="flex-1 max-w-md relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar arquivos, pastas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-950 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 text-sm outline-none transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-1 border border-gray-100 dark:border-white/10 rounded-lg p-1 bg-gray-50 dark:bg-slate-950">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <ListIcon size={18} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
                    {isUploading && (
                        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 z-50 flex flex-col items-center justify-center animate-fadeIn backdrop-blur-sm">
                            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Enviando arquivos...</h3>
                        </div>
                    )}

                    {/* Breadcrumbs (Mock) */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 pb-2 border-b border-gray-100 dark:border-white/5">
                        <span className="hover:text-indigo-600 cursor-pointer flex items-center gap-1"><Home size={14} /> Home</span>
                        {selectedClient && (
                            <>
                                <ChevronRight size={14} className="text-gray-300" />
                                <span className="font-bold text-gray-800 dark:text-white">{selectedClient.name}</span>
                            </>
                        )}
                    </div>

                    {/* Folders Section */}
                    {(!currentSection || currentSection === 'all') && (
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Folder size={14} /> Pastas
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {MOCK_FOLDERS.map(folder => (
                                    <div key={folder.id} className="group cursor-pointer bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/5 rounded-2xl p-4 hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className={`p-2.5 rounded-xl ${folder.color}`}>
                                                <Folder size={24} />
                                            </div>
                                            <button className="text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                        <h4 className="font-bold text-gray-800 dark:text-white text-sm truncate" title={folder.name}>{folder.name}</h4>
                                        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                                            <span>{folder.count} arquivos</span>
                                            <span>{folder.updated}</span>
                                        </div>
                                    </div>
                                ))}
                                <button className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all">
                                    <Plus size={24} />
                                    <span className="text-xs font-bold">Nova Pasta</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Files Section */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <File size={14} /> Arquivos Recentes
                        </h3>

                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredFiles.map(file => (
                                    <div key={file.id} className="group bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/5 rounded-2xl p-4 hover:shadow-lg transition-all relative">
                                        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500" title="Visualizar"><Eye size={16} /></button>
                                            <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500" title="Baixar"><Download size={16} /></button>
                                        </div>

                                        <div className="h-32 bg-gray-50 dark:bg-white/5 rounded-xl mb-4 flex items-center justify-center group-hover:scale-[1.02] transition-transform origin-bottom">
                                            <FileIcon type={file.type} className="w-16 h-16 opacity-80" />
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg shrink-0">
                                                <FileIcon type={file.type} className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-800 dark:text-white text-sm truncate mb-0.5" title={file.title}>
                                                    {file.title}
                                                </h4>
                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    <span>{file.size}</span>
                                                    <span>•</span>
                                                    <span>{file.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 dark:bg-white/5 text-gray-500">
                                        <tr>
                                            <th className="p-4 font-bold">Nome</th>
                                            <th className="p-4 font-bold hidden sm:table-cell">Autor</th>
                                            <th className="p-4 font-bold hidden md:table-cell">Data</th>
                                            <th className="p-4 font-bold">Tamanho</th>
                                            <th className="p-4 font-bold text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                        {filteredFiles.map(file => (
                                            <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <FileIcon type={file.type} className="w-5 h-5" />
                                                        <span className="font-medium text-gray-800 dark:text-white truncate max-w-[200px]">{file.title}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-gray-500 hidden sm:table-cell">{file.author}</td>
                                                <td className="p-4 text-gray-500 hidden md:table-cell">{file.date}</td>
                                                <td className="p-4 text-gray-500">{file.size}</td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-lg"><Eye size={16} /></button>
                                                        <button className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg"><Download size={16} /></button>
                                                        <button className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg"><Trash2 size={16} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Drag Drop Overlay Hint */}
                    <div className="mt-12 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all cursor-pointer">
                        <Upload size={32} className="mb-2" />
                        <p className="font-medium">Arraste arquivos aqui para fazer upload</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
