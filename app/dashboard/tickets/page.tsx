'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Plus, Search, Filter, MessageSquare, Paperclip, Send,
  MoreVertical, CheckCircle, Clock, User, ArrowLeft,
  Phone, Mail, FileText, AlertCircle, MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';

// --- MOCK DATA ---
const MOCK_TICKETS = [
  {
    id: 'TKT-2024-892',
    client: 'Shopping Center Norte',
    clientId: 'cli_001',
    contact: 'Ana Gerente',
    avatar: 'A',
    title: 'Ar Condicionado Central - Bloco B Parado',
    priority: 'urgent',
    status: 'open',
    category: 'Manutenção',
    created_at: '2024-02-07T08:30:00',
    sla_due: '2024-02-07T12:30:00', // 4h SLA
    messages: [
      {
        id: 'msg_1',
        sender: 'Ana Gerente',
        role: 'client',
        content: 'Bom dia, o chiller do Bloco B parou de funcionar completamente. A temperatura está subindo rápido e temos lojas reclamando.',
        timestamp: '2024-02-07T08:30:00'
      },
      {
        id: 'msg_2',
        sender: 'Sistema',
        role: 'system',
        content: 'Chamado criado automaticamente via Painel do Cliente. Prioridade definida como URGENTE baseada na categoria "Parada Total".',
        timestamp: '2024-02-07T08:30:05'
      }
    ]
  },
  {
    id: 'TKT-2024-891',
    client: 'Hospital Santa Clara',
    clientId: 'cli_002',
    contact: 'Dr. Roberto',
    avatar: 'R',
    title: 'Solicitação de Laudo Técnico - Gerador',
    priority: 'medium',
    status: 'in_progress',
    category: 'Documentação',
    created_at: '2024-02-06T14:15:00',
    sla_due: '2024-02-08T18:00:00',
    messages: [
      {
        id: 'msg_1',
        sender: 'Dr. Roberto',
        role: 'client',
        content: 'Precisamos do laudo da última manutenção do gerador para a vistoria dos bombeiros na próxima semana.',
        timestamp: '2024-02-06T14:15:00'
      },
      {
        id: 'msg_2',
        sender: 'Suporte Técnico',
        role: 'support',
        content: 'Olá Dr. Roberto. Já localizei o relatório. Estou apenas aguardando a assinatura digital do engenheiro responsável. Envio até amanhã.',
        timestamp: '2024-02-06T14:45:00'
      },
      {
        id: 'msg_3',
        sender: 'Dr. Roberto',
        role: 'client',
        content: 'Ótimo, fico no aguardo. Obrigado pela agilidade.',
        timestamp: '2024-02-06T15:00:00'
      }
    ]
  },
  {
    id: 'TKT-2024-885',
    client: 'Condomínio Solar',
    clientId: 'cli_003',
    contact: 'Síndico João',
    avatar: 'J',
    title: 'Dúvida sobre Fatura de Março',
    priority: 'low',
    status: 'resolved',
    category: 'Financeiro',
    created_at: '2024-02-05T09:00:00',
    sla_due: '2024-02-07T09:00:00',
    messages: [
      {
        id: 'msg_1',
        sender: 'Síndico João',
        role: 'client',
        content: 'Não entendi a cobrança extra de peças na fatura deste mês.',
        timestamp: '2024-02-05T09:00:00'
      },
      {
        id: 'msg_2',
        sender: 'Financeiro',
        role: 'support',
        content: 'João, essa cobrança refere-se à troca do disjuntor realizada no dia 28/01, conforme aprovado na OS-992. Segue anexo.',
        attachment: 'os_992_assinada.pdf',
        timestamp: '2024-02-05T10:30:00'
      },
      {
        id: 'msg_3',
        sender: 'Síndico João',
        role: 'client',
        content: 'Ah sim, tinha esquecido. Tudo certo então. Pode encerrar.',
        timestamp: '2024-02-05T11:00:00'
      }
    ]
  },
  {
    id: 'TKT-2024-880',
    client: 'Escola Internacional',
    clientId: 'cli_004',
    contact: 'Coordenação',
    avatar: 'E',
    title: 'Agendamento de Manutenção Preventiva',
    priority: 'medium',
    status: 'open',
    category: 'Agendamento',
    created_at: '2024-02-07T10:00:00',
    sla_due: '2024-02-08T10:00:00',
    messages: [
      {
        id: 'msg_1',
        sender: 'Coordenação',
        role: 'client',
        content: 'Gostaríamos de agendar a preventiva dos ares condicionados para o feriado, para não atrapalhar as aulas.',
        timestamp: '2024-02-07T10:00:00'
      }
    ]
  }
];

export default function TicketsPage() {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('history');
  const [newMessage, setNewMessage] = useState('');

  // Mobile responsiveness
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);

  const selectedTicket = MOCK_TICKETS.find(t => t.id === selectedTicketId);

  const filteredTickets = MOCK_TICKETS.filter(t =>
    t.title.toLowerCase().includes(filter.toLowerCase()) ||
    t.client.toLowerCase().includes(filter.toLowerCase()) ||
    t.id.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSelectTicket = (id: string) => {
    setSelectedTicketId(id);
    setIsMobileListVisible(false); // Hide list on mobile when selecting
  };

  const handleBackToList = () => {
    setIsMobileListVisible(true);
    // Optional: setSelectedTicketId(null) if we want to clear selection
  };

  // Helper functions for UI
  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-100';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'low': return 'text-slate-600 bg-slate-50 border-slate-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityLabel = (p: string) => {
    switch (p) {
      case 'urgent': return 'Urgente';
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return p;
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'open': return 'bg-purple-100 text-purple-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'resolved': return 'bg-emerald-100 text-emerald-700';
      case 'closed': return 'bg-slate-100 text-slate-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusLabel = (s: string) => {
    switch (s) {
      case 'open': return 'Aberto';
      case 'in_progress': return 'Em Andamento';
      case 'resolved': return 'Resolvido';
      case 'closed': return 'Fechado';
      default: return s;
    }
  };

  const formatRelTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);

    if (diffMins < 60) return `há ${diffMins} min`;
    if (diffHours < 24) return `há ${diffHours} h`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col animate-fadeIn">
      {/* Page Header - Compact */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Central de Ajuda</h1>
          <p className="text-slate-500 font-medium text-sm">Gerencie solicitações e suporte em tempo real.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
          <Plus size={18} /> <span className="hidden sm:inline">Novo Chamado</span>
        </button>
      </div>

      {/* Main Split View Container */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex relative">

        {/* LEFT COLUMN: Ticket List */}
        <div className={`w-full md:w-[320px] lg:w-[360px] flex flex-col border-r border-slate-100 bg-slate-50/50 ${isMobileListVisible ? 'flex' : 'hidden md:flex'}`}>
          {/* Search & Filter Header */}
          <div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Buscar chamados..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button className="px-3 py-1.5 bg-slate-800 text-white rounded-full text-xs font-bold whitespace-nowrap">Todos</button>
              <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:border-slate-300 rounded-full text-xs font-bold whitespace-nowrap transition-colors">Meus Tickets</button>
              <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:border-slate-300 rounded-full text-xs font-bold whitespace-nowrap transition-colors">Urgentes</button>
              <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:border-slate-300 rounded-full text-xs font-bold whitespace-nowrap transition-colors">Não Lidos</button>
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredTickets.map(ticket => (
              <div
                key={ticket.id}
                onClick={() => handleSelectTicket(ticket.id)}
                className={`p-4 border-b border-slate-100 cursor-pointer transition-all hover:bg-white group ${selectedTicketId === ticket.id ? 'bg-white border-l-4 border-l-indigo-600 shadow-sm relative z-10' : 'border-l-4 border-l-transparent text-slate-500'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getPriorityColor(ticket.priority)}`}>
                    {getPriorityLabel(ticket.priority)}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <Clock size={10} /> {formatRelTime(ticket.messages[ticket.messages.length - 1].timestamp)}
                  </span>
                </div>

                <h3 className={`font-bold text-sm mb-1 line-clamp-2 ${selectedTicketId === ticket.id ? 'text-slate-800' : 'text-slate-700'}`}>
                  {ticket.title}
                </h3>

                <p className="text-xs text-slate-500 mb-3 line-clamp-1">
                  {ticket.messages[ticket.messages.length - 1].content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${selectedTicketId === ticket.id ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                      {ticket.avatar}
                    </div>
                    <span className="text-xs font-semibold text-slate-600 truncate max-w-[100px]">{ticket.client}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(ticket.status)}`}>
                    {getStatusLabel(ticket.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Ticket Detail (Inbox Style) */}
        {!selectedTicket ? (
          <div className={`flex-1 flex flex-col items-center justify-center bg-slate-50 text-center p-8 ${!isMobileListVisible ? 'flex' : 'hidden md:flex'}`}>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
              <MessageSquare size={32} className="text-indigo-200" />
            </div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">Selecione um Chamado</h2>
            <p className="text-slate-400 max-w-xs mx-auto">Escolha um ticket da lista ao lado para ver os detalhes, responder e gerenciar o atendimento.</p>
          </div>
        ) : (
          <div className={`flex-1 flex flex-col bg-white ${!isMobileListVisible ? 'flex absolute inset-0 md:static z-20' : 'hidden md:flex'}`}>

            {/* Detail Header */}
            <div className="h-16 border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 bg-white shrink-0">
              <div className="flex items-center gap-3 overflow-hidden">
                <button onClick={handleBackToList} className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-700">
                  <ArrowLeft size={20} />
                </button>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-slate-800 text-lg sm:text-lg truncate max-w-[200px] sm:max-w-md">{selectedTicket.title}</h2>
                    <span className="bg-slate-100 text-slate-500 px-1.5 rounded text-[10px] font-mono">#{selectedTicket.id}</span>
                  </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    {selectedTicket.contact} • {selectedTicket.client}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="btn-secondary hidden sm:flex items-center gap-1.5 h-9 text-xs">
                  <CheckCircle size={14} /> <span className="hidden xl:inline">Resolver</span>
                </button>
                <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Sub-Header / SLA Warnings */}
            {new Date(selectedTicket.sla_due) < new Date() ? (
              <div className="bg-red-50 border-b border-red-100 px-6 py-2 flex items-center gap-2 text-xs font-bold text-red-600">
                <AlertCircle size={14} /> SLA Vencido: Este chamado está atrasado.
              </div>
            ) : (
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                <Clock size={14} /> SLA Vence em: {new Date(selectedTicket.sla_due).toLocaleString()}
              </div>
            )}

            {/* Main Content Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50/30 custom-scrollbar flex flex-col gap-8">

              {/* Timestamp Separator */}
              <div className="flex justify-center mb-2">
                <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                  Hoje
                </span>
              </div>

              {selectedTicket.messages.map((msg, index) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'support' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center text-xs font-bold ring-2 ring-white ${msg.role === 'client' ? 'bg-indigo-100 text-indigo-700' : msg.role === 'system' ? 'bg-gray-200 text-gray-600' : 'bg-emerald-100 text-emerald-700'}`}>
                    {msg.role === 'system' ? 'S' : msg.sender.charAt(0)}
                  </div>

                  {/* Bubble */}
                  <div className={`flex flex-col max-w-[90%] sm:max-w-[75%] ${msg.role === 'support' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-baseline gap-2 mb-1.5 px-1">
                      <span className="text-sm font-bold text-slate-700">{msg.sender}</span>
                      <span className="text-[11px] text-slate-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <div className={`p-5 shadow-sm text-[15px] leading-relaxed relative group transition-all hover:shadow-md ${msg.role === 'support'
                      ? 'bg-indigo-600 text-white rounded-[24px] rounded-tr-sm border border-transparent'
                      : msg.role === 'system'
                        ? 'bg-gray-50 text-gray-500 text-xs italic rounded-full border border-gray-100 text-center w-full py-2 px-6 mx-auto max-w-md'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-[24px] rounded-tl-sm'
                      }`}>
                      {msg.content}

                      {msg.attachment && (
                        <div className={`mt-4 flex items-center gap-3 p-3 rounded-2xl border transition-colors ${msg.role === 'support' ? 'bg-white/10 border-white/10 text-white hover:bg-white/20' : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'}`}>
                          <FileText size={20} className={msg.role === 'support' ? 'text-white' : 'text-indigo-500'} />
                          <span className="text-sm font-medium underline cursor-pointer">{msg.attachment}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area (Modern Clean Style) */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-100 shrink-0 flex items-end gap-3">
              <div className="flex gap-1 pb-1">
                <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all" title="Anexar">
                  <Paperclip size={20} />
                </button>
                <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all hidden sm:block" title="Modelo">
                  <FileText size={20} />
                </button>
              </div>

              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escreva uma mensagem..."
                  className="w-full bg-slate-100 border-0 rounded-[24px] px-5 py-3.5 text-[15px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all resize-none min-h-[50px] max-h-[150px] shadow-inner"
                  rows={1}
                />
              </div>

              <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex shrink-0 items-center justify-center">
                <Send size={20} className="ml-0.5" />
              </button>
            </div>

          </div>
        )}

      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(203, 213, 225, 0.5);
          border-radius: 20px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: rgba(148, 163, 184, 0.8);
        }
      `}</style>
    </div>
  );
}
