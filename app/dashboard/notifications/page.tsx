'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore'; // Keep for profile data if needed, or remove if unused
import {
  Bell, Check, CheckCheck, Loader2, Trash2,
  MessageSquare, Calendar, Wrench, FileText,
  AlertTriangle, Info, Clock, CheckCircle2,
  Filter, X
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock Notification Interface
interface Notification {
  id: string;
  user_id: string;
  type: 'ticket' | 'order' | 'quote' | 'overtime' | 'chat' | 'system' | 'alert';
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
  link?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadMockNotifications();
  }, []);

  async function loadMockNotifications() {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 3);

    const mockData: Notification[] = [
      {
        id: '1',
        user_id: 'me',
        type: 'alert',
        title: 'Estoque Crítico: Cabo de Rede CAT6',
        body: 'O item atingiu o nível mínimo de 15 unidades. Reposição recomendada.',
        is_read: false,
        created_at: new Date(today.setHours(10, 30)).toISOString(),
      },
      {
        id: '2',
        user_id: 'me',
        type: 'ticket',
        title: 'Novo Chamado #4092',
        body: 'Cliente "Empresa ABC" abriu um chamado de "Sem Internet". Prioridade: Alta.',
        is_read: false,
        created_at: new Date(today.setHours(9, 15)).toISOString(),
      },
      {
        id: '3',
        user_id: 'me',
        type: 'chat',
        title: 'Mensagem de Carlos Técnico',
        body: 'Preciso da aprovação para o orçamento #1029.',
        is_read: true,
        created_at: new Date(yesterday.setHours(16, 45)).toISOString(),
      },
      {
        id: '4',
        user_id: 'me',
        type: 'quote',
        title: 'Orçamento Aprovado',
        body: 'O orçamento #1028 foi aprovado pelo cliente Silva Indústria.',
        is_read: true,
        created_at: new Date(yesterday.setHours(14, 20)).toISOString(),
      },
      {
        id: '5',
        user_id: 'me',
        type: 'system',
        title: 'Backup Realizado',
        body: 'Backup diário do sistema concluído com sucesso.',
        is_read: true,
        created_at: new Date(yesterday.setHours(3, 0)).toISOString(),
      },
      {
        id: '6',
        user_id: 'me',
        type: 'overtime',
        title: 'Hora Extra Pendente',
        body: 'Solicitação de hora extra de "Ana Souza" aguardando aprovação.',
        is_read: true,
        created_at: new Date(lastWeek.setHours(18, 0)).toISOString(),
      },
      {
        id: '7',
        user_id: 'me',
        type: 'order',
        title: 'OS #2023 Finalizada',
        body: 'O técnico finalizou a OS no cliente "Shopping Center".',
        is_read: true,
        created_at: new Date(lastWeek.setHours(11, 0)).toISOString(),
      },
    ];

    setNotifications(mockData);
    setLoading(false);
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    toast.success('Marcada como lida'); // Optional, might be too noisy
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    toast.success('Todas marcadas como lidas');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notificação removida');
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'ticket': return { icon: Wrench, color: 'text-orange-500', bg: 'bg-orange-100' };
      case 'order': return { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-100' };
      case 'quote': return { icon: FileText, color: 'text-emerald-500', bg: 'bg-emerald-100' }; // Reusing FileText for simplicity
      case 'overtime': return { icon: Clock, color: 'text-violet-500', bg: 'bg-violet-100' };
      case 'chat': return { icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-100' };
      case 'alert': return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-100' };
      case 'system': return { icon: Info, color: 'text-slate-500', bg: 'bg-slate-100' };
      default: return { icon: Bell, color: 'text-gray-500', bg: 'bg-gray-100' };
    }
  };

  // Filter Logic
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    return true;
  });

  // Grouping Logic
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = new Date(notification.created_at);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let key = 'Antigas';
    if (date.toDateString() === today.toDateString()) key = 'Hoje';
    else if (date.toDateString() === yesterday.toDateString()) key = 'Ontem';

    if (!groups[key]) groups[key] = [];
    groups[key].push(notification);
    return groups;
  }, {} as Record<string, Notification[]>);

  const groupOrder = ['Hoje', 'Ontem', 'Antigas'];
  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500 animate-pulse">Buscando atualizações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            Notificações
            {unreadCount > 0 && (
              <span className="bg-indigo-600 text-white text-xs px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
                {unreadCount} novas
              </span>
            )}
          </h1>
          <p className="text-slate-500 mt-1">Fique por dentro de tudo que acontece no seu sistema.</p>
        </div>

        <div className="flex gap-2">
          <div className="inline-flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-slate-100 text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'unread' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Não lidas
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm transition-all"
              title="Marcar todas como lidas"
            >
              <CheckCheck size={18} className="text-indigo-600" />
              <span className="hidden sm:inline ml-2">Ler Tudo</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Tudo limpo por aqui!</h3>
            <p className="text-slate-500 text-sm mt-1">Você não tem notificações {filter === 'unread' ? 'não lidas' : ''} no momento.</p>
            {filter === 'unread' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-4 text-indigo-600 font-medium hover:underline text-sm"
              >
                Ver todas as notificações
              </button>
            )}
          </div>
        ) : (
          groupOrder.map(group => {
            if (!groupedNotifications[group]?.length) return null;
            return (
              <div key={group} className="animate-slideIn">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pl-1">{group}</h3>
                <div className="space-y-3">
                  {groupedNotifications[group].map((notification) => {
                    const style = getTypeStyles(notification.type);
                    const Icon = style.icon;
                    return (
                      <div
                        key={notification.id}
                        className={`group relative bg-white border rounded-2xl p-4 transition-all hover:shadow-md ${!notification.is_read
                            ? 'border-indigo-200 shadow-sm bg-indigo-50/10'
                            : 'border-slate-100 hover:border-slate-200'
                          }`}
                      >
                        {!notification.is_read && (
                          <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-indigo-500 rounded-full ring-4 ring-white"></div>
                        )}

                        <div className="flex gap-4">
                          {/* Icon Box */}
                          <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${style.bg} ${style.color}`}>
                            <Icon size={22} />
                          </div>

                          {/* Text Content */}
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex justify-between items-start pr-6">
                              <h4 className={`text-base font-semibold truncate ${!notification.is_read ? 'text-slate-900' : 'text-slate-700'}`}>
                                {notification.title}
                              </h4>
                              <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                                {new Date(notification.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className={`text-sm mt-1 leading-relaxed ${!notification.is_read ? 'text-slate-600' : 'text-slate-500'}`}>
                              {notification.body}
                            </p>
                          </div>
                        </div>

                        {/* Actions Overlay (Desktop) / Buttons (Mobile) */}
                        <div className="absolute right-2 top-2 bottom-2 w-0 group-hover:w-20 bg-gradient-to-l from-white via-white to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-center justify-end px-2 overflow-hidden">
                          <div className="flex flex-col gap-2">
                            {!notification.is_read && (
                              <button
                                onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                                className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:scale-110 transition-all shadow-sm"
                                title="Marcar como lida"
                              >
                                <Check size={16} />
                              </button>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                              className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:scale-110 transition-all shadow-sm"
                              title="Excluir"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Always visible actions on touch devices (optional tweak could be here, but hover logic works well for desktop-first) */}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
