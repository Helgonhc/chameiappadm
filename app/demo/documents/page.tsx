'use client';

import { FolderOpen, FileText, Image as ImageIcon, File, Search, Plus, FolderPlus, Download, ExternalLink, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';

const mockFolders = [
    { name: 'Manuais de Máquinas', files: 12, size: '45 MB' },
    { name: 'Certificados ISO', files: 5, size: '8 MB' },
    { name: 'Fotos de Instalação', files: 28, size: '156 MB' },
    { name: 'Relatórios Mensais', files: 24, size: '12 MB' },
];

const mockFiles = [
    { name: 'manual_haiti_v3.pdf', type: 'pdf', size: '4.2 MB', date: '2024-02-01', folder: 'Manuais de Máquinas' },
    { name: 'certificado_calibracao_2024.pdf', type: 'pdf', size: '1.1 MB', date: '2024-01-15', folder: 'Certificados ISO' },
    { name: 'painel_frontal_detalhe.jpg', type: 'image', size: '2.8 MB', date: '2024-02-05', folder: 'Fotos de Instalação' },
    { name: 'checklist_preventiva_jan.xlsx', type: 'excel', size: '0.5 MB', date: '2024-01-31', folder: 'Relatórios Mensais' },
];

export default function DemoDocumentsPage() {
    const handleDemoAction = (action: string) => {
        toast(`🔒 "${action}" desabilitado no modo demonstração`, {
            icon: 'ℹ️',
            duration: 2000,
        });
    };

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText size={20} className="text-red-500" />;
            case 'image': return <ImageIcon size={20} className="text-blue-500" />;
            case 'excel': return <FileText size={20} className="text-emerald-500" />;
            default: return <File size={20} className="text-slate-400" />;
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        <FolderOpen className="text-amber-500" size={28} />
                        Centro de Documentos
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Armazenamento centralizado de manuais e registros.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleDemoAction('Nova Pasta')}
                        className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                        title="Nova Pasta"
                    >
                        <FolderPlus size={20} />
                    </button>
                    <button
                        onClick={() => handleDemoAction('Enviar Arquivo')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                    >
                        <Plus size={20} />
                        Carregar Arquivo
                    </button>
                </div>
            </div>

            {/* Folders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockFolders.map((folder) => (
                    <button
                        key={folder.name}
                        onClick={() => handleDemoAction(`Abrir pasta ${folder.name}`)}
                        className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 p-4 rounded-2xl hover:border-amber-500/50 transition-all text-left group shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 group-hover:bg-amber-500/20 transition-colors">
                                <FolderOpen size={24} />
                            </div>
                            <MoreVertical size={16} className="text-slate-400" />
                        </div>
                        <h3 className="font-black text-slate-900 dark:text-white text-sm truncate">{folder.name}</h3>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">{folder.files} Arquivos • {folder.size}</p>
                    </button>
                ))}
            </div>

            {/* Files List */}
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                    <h2 className="text-xs font-black uppercase tracking-[2px] text-slate-500">Arquivos Recentes</h2>
                    <div className="relative w-64 hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Buscar arquivos..."
                            className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none"
                            readOnly
                        />
                    </div>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-700/50">
                    {mockFiles.map((file) => (
                        <div key={file.name} className="p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                    {getFileIcon(file.type)}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">{file.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{file.folder} • {file.size} • {new Date(file.date).toLocaleDateString('pt-BR')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleDemoAction(`Visualizar ${file.name}`)}
                                    className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                                    title="Visualizar"
                                >
                                    <ExternalLink size={18} />
                                </button>
                                <button
                                    onClick={() => handleDemoAction(`Baixar ${file.name}`)}
                                    className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"
                                    title="Baixar"
                                >
                                    <Download size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tech Specs Note */}
            <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-amber-500/20 rounded-xl text-amber-500">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="text-amber-600 dark:text-amber-400 font-black text-sm uppercase tracking-widest mb-1">Base de Conhecimento</h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            Vincule manuais, diagramas elétricos e procedimentos operacionais diretamente aos equipamentos ou ordens de serviço.
                            Seus técnicos terão tudo na palma da mão, mesmo offline via app.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
