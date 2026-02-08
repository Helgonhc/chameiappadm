'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageSquare, Users, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const mockChannels = [
    { id: '1', name: 'Geral', type: 'general' },
    { id: '2', name: 'Técnicos', type: 'group' },
    { id: '3', name: 'Suporte ChameiApp', type: 'direct' },
];

const mockMessages = [
    { id: '1', user_name: 'Carlos Técnico', content: 'Finalizei a troca dos filtros no Bloco A.', created_at: new Date(Date.now() - 3600000).toISOString(), is_own: false },
    { id: '2', user_name: 'Você (Demo)', content: 'Perfeito Carlos. Pode anexar o relatório?', created_at: new Date(Date.now() - 3000000).toISOString(), is_own: true },
    { id: '3', user_name: 'Carlos Técnico', content: 'Vou enviar agora mesmo!', created_at: new Date(Date.now() - 2400000).toISOString(), is_own: false },
];

export default function DemoChatPage() {
    const [selectedChannel, setSelectedChannel] = useState(mockChannels[0]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 300);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [loading]);

    const handleDemoAction = (action: string) => {
        toast(`🔒 "${action}" desabilitado no modo demonstração`, {
            icon: 'ℹ️',
            duration: 2000,
        });
    };

    const handleSend = () => {
        if (!newMessage.trim()) return;
        handleDemoAction('Enviar Mensagem');
        setNewMessage('');
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
    );

    return (
        <div className="h-[calc(100vh-160px)] flex gap-6 animate-fadeIn pb-10">
            {/* Channels Sidebar (Visual Clone) */}
            <div className="w-64 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col overflow-hidden">
                <div className="p-4 border-b dark:border-white/5 bg-gray-50/50 dark:bg-slate-800/50">
                    <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Users size={16} className="text-indigo-600" />
                        Canais
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {mockChannels.map((channel) => (
                        <button
                            key={channel.id}
                            onClick={() => setSelectedChannel(channel)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl transition-all text-xs font-medium ${selectedChannel.id === channel.id
                                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shadow-sm'
                                : 'hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-400 border border-transparent'
                                }`}
                        >
                            <span className="mr-2">
                                {channel.type === 'general' ? '📢' : channel.type === 'group' ? '👥' : '💬'}
                            </span>
                            {channel.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area (Visual Clone) */}
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col overflow-hidden">
                {/* Header Chat */}
                <div className="p-4 border-b dark:border-white/5 flex items-center justify-between bg-gray-50/30 dark:bg-slate-800/30">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-indigo-200 shadow-lg">
                            {selectedChannel.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-tight">#{selectedChannel.name}</h3>
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                SISTEMA ONLINE • MODO DEMO
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
                    {mockMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.is_own ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${msg.is_own
                                    ? 'bg-indigo-600 text-white rounded-br-md border border-indigo-500'
                                    : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-white rounded-bl-md border border-gray-100 dark:border-white/5'
                                    }`}
                            >
                                {!msg.is_own && (
                                    <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 mb-1 uppercase tracking-widest">
                                        {msg.user_name}
                                    </p>
                                )}
                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                <p className={`text-[9px] mt-2 font-bold opacity-60 ${msg.is_own ? 'text-right' : ''}`}>
                                    {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t dark:border-white/5 bg-white dark:bg-slate-900">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Digite sua mensagem simulada..."
                            className="flex-1 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-indigo-600 text-white px-5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Send size={18} />
                            <span>Enviar</span>
                        </button>
                    </div>
                    <p className="text-[9px] text-gray-400 dark:text-gray-500 text-center mt-3 uppercase tracking-[2px] font-bold">
                        Interface de Demonstração • Dados Fictícios
                    </p>
                </div>
            </div>
        </div>
    );
}
