'use client';

import { useState, useEffect, useRef } from 'react';
// import { supabase } from '@/lib/supabase'; // Decoupled
import { useAuthStore } from '@/store/authStore';
import { Send, Loader2, MessageSquare, Users, Phone, Video, MoreVertical, Search, Paperclip, Smile, Check, CheckCheck, Circle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface ChatMessage {
  id: string;
  channel_id: string;
  user_id: string;
  content: string;
  created_at: string;
  status: 'sent' | 'delivered' | 'read';
  profiles?: { full_name: string; avatar_url?: string; is_online?: boolean };
}

interface ChatChannel {
  id: string;
  name: string;
  type: 'general' | 'direct' | 'group';
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
  avatar_url?: string;
  is_online?: boolean; // For direct messages
}

export default function ChatPage() {
  const { profile } = useAuthStore();
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<ChatChannel | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false); // Simulator for "Other user is typing..."
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMockChannels();
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      loadMockMessages(selectedChannel.id);
    }
  }, [selectedChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  async function loadMockChannels() {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    const mockChannels: ChatChannel[] = [
      { id: 'c1', name: 'Geral', type: 'general', last_message: 'Bom dia equipe!', last_message_time: '09:00', unread_count: 0, avatar_url: 'https://ui-avatars.com/api/?name=Geral&background=6366f1&color=fff' },
      { id: 'c2', name: 'Suporte Técnico', type: 'group', last_message: 'Chamado #1234 resolvido', last_message_time: '10:30', unread_count: 2, avatar_url: 'https://ui-avatars.com/api/?name=Suporte&background=10b981&color=fff' },
      { id: 'c3', name: 'Carlos Técnico', type: 'direct', last_message: 'Estou on-line?', last_message_time: '11:15', unread_count: 0, is_online: true, avatar_url: 'https://i.pravatar.cc/150?u=carlos' },
      { id: 'c4', name: 'Ana Gerente', type: 'direct', last_message: 'Precisamos ver o relatório', last_message_time: 'Ontem', unread_count: 0, is_online: false, avatar_url: 'https://i.pravatar.cc/150?u=ana' },
    ];
    setChannels(mockChannels);

    // Auto-select first channel
    if (!selectedChannel) setSelectedChannel(mockChannels[0]);

    setLoading(false);
  }

  async function loadMockMessages(channelId: string) {
    // Generate chat history based on channel
    const history: ChatMessage[] = Array.from({ length: 8 }).map((_, i) => ({
      id: `msg-${channelId}-${i}`,
      channel_id: channelId,
      user_id: i % 2 === 0 ? 'other-user' : (profile?.id || 'me'),
      content: [
        'Olá, tudo bem?', 'Como estão as manutenções hoje?', 'Tudo certo por aqui.', 'Preciso de ajuda no chamado 404.',
        'Estou verificando...', 'Okay, me avise.', 'Resolvido!', 'Ótimo trabalho.'
      ][i % 8],
      created_at: new Date(Date.now() - (1000 * 60 * 60 * (8 - i))).toISOString(),
      status: 'read',
      profiles: {
        full_name: i % 2 === 0 ? (channels.find(c => c.id === channelId)?.name || 'Usuário') : 'Eu',
        avatar_url: i % 2 === 0 ? channels.find(c => c.id === channelId)?.avatar_url : undefined
      }
    }));
    setMessages(history);
  }

  function scrollToBottom() {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  async function handleSend() {
    if (!newMessage.trim() || !selectedChannel) return;

    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      channel_id: selectedChannel.id,
      user_id: profile?.id || 'me',
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
      status: 'sent',
      profiles: { full_name: 'Eu' }
    };

    setMessages(prev => [...prev, msg]);
    setNewMessage('');

    // Simulate Delay and "Delivered/Read" status update
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'delivered' } : m));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: 'read' } : m));
    }, 2000);

    // Simulate Auto-Reply
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const reply: ChatMessage = {
          id: `reply-${Date.now()}`,
          channel_id: selectedChannel.id,
          user_id: 'other-user',
          content: 'Recebido! Vou analisar e te retorno em breve. 🤖 (Auto-reply)',
          created_at: new Date().toISOString(),
          status: 'sent',
          profiles: {
            full_name: selectedChannel.type === 'direct' ? selectedChannel.name : 'Bot do Canal',
            avatar_url: selectedChannel.avatar_url
          }
        };
        setMessages(prev => [...prev, reply]);
        toast.success('Nova mensagem recebida!');
      }, 2500);
    }, 1500);
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex gap-0 bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 animate-fadeIn">
      {/* Sidebar - Channels */}
      <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
          <h2 className="font-bold text-lg text-slate-800">Mensagens</h2>
          <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Buscar conversas..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Channel List */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1 custom-scrollbar">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setSelectedChannel(channel)}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 group ${selectedChannel?.id === channel.id
                ? 'bg-white shadow-md ring-1 ring-slate-100'
                : 'hover:bg-white hover:shadow-sm'
                }`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-indigo-100 overflow-hidden flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm">
                  {channel.avatar_url ? <img src={channel.avatar_url} alt="" className="w-full h-full object-cover" /> : channel.name[0]}
                </div>
                {channel.is_online && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className={`font-semibold truncate ${selectedChannel?.id === channel.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {channel.name}
                  </h3>
                  <span className="text-[10px] text-slate-400">{channel.last_message_time}</span>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <p className="text-xs text-slate-500 truncate max-w-[140px]">{channel.last_message}</p>
                  {channel.unread_count && channel.unread_count > 0 ? (
                    <span className="w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                      {channel.unread_count}
                    </span>
                  ) : null}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#f0f2f5] relative">
        {selectedChannel ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-6 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden flex items-center justify-center text-indigo-600 font-bold">
                    {selectedChannel.avatar_url ? <img src={selectedChannel.avatar_url} alt="" className="w-full h-full object-cover" /> : selectedChannel.name[0]}
                  </div>
                </div>
                <div>
                  <h2 className="font-bold text-slate-800">{selectedChannel.name}</h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    {selectedChannel.is_online ? <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span> : null}
                    {selectedChannel.type === 'direct' ? (selectedChannel.is_online ? 'Online' : 'Visto por último hoje às 10:00') : `${selectedChannel.type === 'general' ? 'Canal Geral' : 'Grupo de Equipe'}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                  <Phone size={20} />
                </button>
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                  <Video size={20} />
                </button>
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area - with chat background pattern opacity */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-100 custom-scrollbar relative">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

              {messages.map((message, index) => {
                const isOwn = message.user_id === (profile?.id || 'me');
                const showAvatar = !isOwn && (index === 0 || messages[index - 1].user_id !== message.user_id);

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 relative z-10 ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isOwn && (
                      <div className="w-8 flex-shrink-0 flex flex-col justify-end">
                        {showAvatar ? (
                          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-white shadow-sm">
                            {message.profiles?.avatar_url ? <img src={message.profiles.avatar_url} alt="" className="w-full h-full object-cover" /> : null}
                          </div>
                        ) : <div className="w-8" />}
                      </div>
                    )}

                    <div className={`max-w-[65%] shadow-sm ${isOwn
                      ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm'
                      : 'bg-white text-slate-800 rounded-2xl rounded-tl-sm border border-slate-100'
                      }`}>
                      {!isOwn && showAvatar && (
                        <p className="px-3 pt-2 text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                          {message.profiles?.full_name}
                        </p>
                      )}
                      <div className="px-3 py-2">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <div className={`px-3 pb-1.5 flex items-center justify-end gap-1 text-[10px] ${isOwn ? 'text-indigo-200' : 'text-slate-400'}`}>
                        <span>{new Date(message.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        {isOwn && (
                          <span>
                            {message.status === 'sent' && <Check size={12} />}
                            {message.status === 'delivered' && <CheckCheck size={12} />}
                            {message.status === 'read' && <CheckCheck size={12} className="text-blue-300" />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex gap-3 relative z-10 justify-start animate-fadeIn">
                  <div className="w-8 flex-shrink-0 flex flex-col justify-end">
                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-white shadow-sm">
                      {selectedChannel.avatar_url ? <img src={selectedChannel.avatar_url} alt="" className="w-full h-full object-cover" /> : null}
                    </div>
                  </div>
                  <div className="bg-white text-slate-800 rounded-2xl rounded-tl-sm border border-slate-100 px-4 py-3 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}

              <div />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 p-2 rounded-xl focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all shadow-inner">
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors">
                  <Smile size={20} />
                </button>
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors">
                  <Paperclip size={20} />
                </button>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-transparent border-none outline-none text-slate-700 resize-none max-h-32 py-2 px-2 custom-scrollbar"
                  rows={1}
                  style={{ minHeight: '40px' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim()}
                  className={`p-2 rounded-lg transition-all shadow-md ${newMessage.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  <Send size={20} />
                </button>
              </div>
              <div className="text-center mt-2">
                <p className="text-[10px] text-slate-400">Pressione Enter para enviar</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 opacity-0 animate-fadeIn" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
              <MessageSquare className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700">Bem-vindo ao Chat do Chamei</h2>
            <p className="text-slate-500 mt-2 max-w-xs text-center">Selecione uma conversa ao lado para começar a colaborar com sua equipe.</p>
          </div>
        )}
      </div>
    </div>
  );
}
