'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Building2, Wrench, ClipboardList, FileText,
    MessageSquare, Bell, Package, Calendar, Clock, Settings,
    LogOut, ChevronLeft, ChevronRight, Menu, X, Ticket, Calculator,
    UserCog, Download, FileCheck, TrendingUp, Search, FolderOpen, Zap, Droplets
} from 'lucide-react';
import { ChameiLogo } from '../Logo';
import toast from 'react-hot-toast';

export default function DemoSidebar({ onSearchClick, unreadCount = 3, collapsed, onToggle }: any) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleAction = (name: string) => {
        toast(`🔒 "${name}" desabilitado no modo demonstração`, {
            icon: 'ℹ️',
            duration: 2000,
        });
    };

    const menuItems = [
        { name: 'Dashboard', href: '/demo', icon: LayoutDashboard, color: 'text-indigo-500' },
        { name: 'Insights & BI', href: '/demo/performance', icon: TrendingUp, color: 'text-purple-500' },
        { name: 'Geradores', href: '/demo/reports', icon: Zap, color: 'text-emerald-400' },
        { name: 'Clientes', href: '/demo/clients', icon: Building2, color: 'text-blue-500' },
        { name: 'Documentos', href: '/demo/documents', icon: FolderOpen, color: 'text-amber-500' },
        { name: 'Equipamentos', href: '/demo/equipments', icon: Wrench, color: 'text-emerald-500' },
        { name: 'Ordens de Serviço', href: '/demo/orders', icon: ClipboardList, color: 'text-cyan-500' },
        { name: 'Chamados', href: '/demo/tickets', icon: Ticket, color: 'text-red-500' },
        { name: 'Orçamentos', href: '/demo/quotes', icon: Calculator, color: 'text-green-500' },
        { name: 'Manutenções Periódicas', href: '/demo/maintenance', icon: Calendar, color: 'text-pink-500' },
        { name: 'Solicitações Manutenção', href: '/demo/maintenance-requests', icon: FileCheck, color: 'text-orange-500' },
        { name: 'Agenda', href: '/demo/agenda', icon: Calendar, color: 'text-violet-500' },
        { name: 'Banco de Horas', href: '/demo/overtime', icon: Clock, color: 'text-teal-500' },
        { name: 'Estoque', href: '/demo/inventory', icon: Package, color: 'text-rose-500' },
        { name: 'Chat', href: '/demo/chat', icon: MessageSquare, color: 'text-sky-500' },
        { name: 'Notificações', href: '/demo/notifications', icon: Bell, hasBadge: true, color: 'text-yellow-500' },
        { name: 'Levantamento de Cargas', href: '/demo/load-survey', icon: Zap, color: 'text-amber-600' },
    ];

    const adminItems = [
        { name: 'Usuários', href: '/demo/users', icon: UserCog },
        { name: 'Faturamento', href: '/demo/billing', icon: FileText },
    ];

    const masterItems = [
        { name: 'Leads & Vendas', href: '/demo/leads', icon: Zap },
        { name: 'Gestão SaaS', href: '/demo/settings', icon: Settings },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-slate-900 border-r border-white/5 overflow-hidden">
            {/* Header: Logo */}
            <div className={`${collapsed ? 'p-1.5' : 'p-4'} border-b border-white/5 bg-slate-950/20 flex-shrink-0`}>
                <div className="flex flex-col items-center">
                    <div className={`${collapsed ? 'py-4' : 'mb-4'}`}>
                        <ChameiLogo className={collapsed ? "h-6" : "h-8"} color="#10B981" textColor={collapsed ? "transparent" : "#FFFFFF"} />
                    </div>

                    {!collapsed && (
                        <div className="text-center px-4">
                            <p className="text-[9px] font-black uppercase tracking-[3px] text-emerald-500/80">Sistema Operacional</p>
                            <div className="h-px w-6 bg-emerald-500/20 mx-auto my-3"></div>
                        </div>
                    )}

                    {!collapsed && (
                        <div className="flex flex-col items-center mt-2 group cursor-pointer" onClick={() => handleAction('Perfil')}>
                            <div className="relative mb-3">
                                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md group-hover:bg-emerald-500/40 transition-all"></div>
                                <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center border border-white/10 relative z-10 text-emerald-500 font-black italic shadow-2xl">
                                    D
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 z-20 shadow-lg"></div>
                            </div>
                            <p className="font-black text-white text-[11px] uppercase tracking-tighter truncate max-w-[140px]">Usuário Demo</p>
                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Administrador</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Search */}
            <div className={`px-2 py-4 ${collapsed ? 'flex justify-center' : ''} flex-shrink-0`}>
                <button
                    onClick={onSearchClick}
                    className={`group flex items-center gap-3 w-full p-2.5 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:text-emerald-400 hover:bg-white/10 transition-all ${collapsed ? 'justify-center w-10 h-10 p-0' : ''}`}
                >
                    <Search size={16} />
                    {!collapsed && <span className="text-[10px] font-black uppercase tracking-widest flex-1 text-left">Busca Rápida</span>}
                    {!collapsed && <span className="text-[8px] opacity-30">CTRL K</span>}
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-2 space-y-1 overflow-y-auto overflow-x-hidden pt-2 scrollbar-none pb-12">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/demo' && pathname.startsWith(item.href));
                    return (
                        <a
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${isActive ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'} ${collapsed ? 'justify-center' : ''}`}
                        >
                            {isActive && <div className="absolute left-0 w-1 h-4 bg-emerald-500 rounded-r-full" />}
                            <div className={`flex-shrink-0 ${item.color}`}>
                                <item.icon size={18} />
                            </div>
                            {!collapsed && <span className="text-[11px] uppercase tracking-wider">{item.name}</span>}
                            {!collapsed && item.hasBadge && unreadCount > 0 && (
                                <span className="ml-auto bg-emerald-500 text-slate-900 text-[9px] font-black px-1.5 rounded-full">{unreadCount}</span>
                            )}
                        </a>
                    );
                })}

                {!collapsed && <div className="h-px bg-white/5 mx-4 my-4" />}
                {adminItems.map((item) => (
                    <button key={item.href} onClick={() => handleAction(item.name)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-slate-500 hover:text-white hover:bg-white/5 w-full text-left ${collapsed ? 'justify-center' : ''}`}>
                        <div className="flex-shrink-0">
                            <item.icon size={18} />
                        </div>
                        {!collapsed && <span className="text-[11px] uppercase tracking-wider">{item.name}</span>}
                    </button>
                ))}

                {!collapsed && (
                    <div className="mt-6 mb-2 px-4">
                        <p className="text-[8px] font-black uppercase tracking-[3px] text-indigo-500/80">Gestão Plataforma</p>
                    </div>
                )}

                {masterItems.map((item) => (
                    <button key={item.href} onClick={() => handleAction(item.name)} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-slate-500 hover:text-indigo-400 hover:bg-white/5 w-full text-left ${collapsed ? 'justify-center' : ''}`}>
                        <div className="flex-shrink-0">
                            <item.icon size={18} />
                        </div>
                        {!collapsed && <span className="text-[11px] font-bold uppercase tracking-wider">{item.name}</span>}
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-white/5 bg-slate-950/40 flex-shrink-0">
                <button onClick={() => handleAction('Sair')} className={`flex items-center gap-3 w-full py-2 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all ${collapsed ? 'justify-center' : 'px-3'}`}>
                    <LogOut size={16} />
                    {!collapsed && <span className="text-[11px] font-black uppercase">Sair</span>}
                </button>
                {!collapsed && (
                    <div className="mt-4 text-center">
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-[2px]">
                            © 2026 CHAMEIAPP <br />
                            <span className="text-emerald-500/40 block mt-1">POR HELGON HENRIQUE</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <button onClick={() => setMobileOpen(true)} className="md:hidden fixed top-3 left-3 z-[100] p-2.5 bg-emerald-600 text-white rounded-lg shadow-lg">
                <Menu size={22} />
            </button>

            {mobileOpen && (
                <div className="md:hidden absolute inset-0 z-[1000] flex w-full h-full overflow-hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <div className="relative w-64 h-full shadow-2xl flex flex-col animate-slideIn">
                        <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1 text-white hover:bg-white/10 rounded z-50">
                            <X size={20} />
                        </button>
                        <div className="w-full h-full flex flex-col">
                            <SidebarContent />
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar - Fixed Dark Background to match Real System */}
            <aside className={`hidden md:flex flex-col bg-slate-900 transition-all duration-300 relative ${collapsed ? 'w-16' : 'w-64'} h-full flex-shrink-0 z-40`}>
                <SidebarContent />
                <button
                    onClick={() => onToggle(!collapsed)}
                    className="absolute top-10 -right-3.5 w-7 h-7 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center shadow-lg hover:border-emerald-500/50 transition-colors z-20 text-slate-400 hover:text-emerald-500"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </aside>
        </>
    );
}
