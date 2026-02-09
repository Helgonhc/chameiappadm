'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard, Building2, Wrench, ClipboardList, FileText,
    MessageSquare, Bell, Package, Calendar, Clock, Settings,
    LogOut, ChevronLeft, ChevronRight, Menu, X, Ticket, Calculator,
    UserCog, Download, FileCheck, TrendingUp, Search, FolderOpen, Zap
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
        { name: 'Manutenções', href: '/demo/maintenance', icon: Calendar, color: 'text-pink-500' },
        { name: 'Solicitações', href: '/demo/maintenance-requests', icon: FileCheck, color: 'text-orange-500' },
        { name: 'Agenda', href: '/demo/agenda', icon: Calendar, color: 'text-violet-500' },
        { name: 'Banco de Horas', href: '/demo/overtime', icon: Clock, color: 'text-teal-500' },
        { name: 'Estoque', href: '/demo/inventory', icon: Package, color: 'text-rose-500' },
        { name: 'Chat', href: '/demo/chat', icon: MessageSquare, color: 'text-sky-500' },
        { name: 'Notificações', href: '/demo/notifications', icon: Bell, hasBadge: true, color: 'text-yellow-500' },
        { name: 'Levantamento', href: '/demo/load-survey', icon: Zap, color: 'text-amber-600' },
    ];

    const adminItems = [
        { name: 'Usuários', href: '/demo/users', icon: UserCog, color: 'text-purple-400' },
        { name: 'Faturamento', href: '/demo/billing', icon: FileText, color: 'text-green-400' },
    ];


    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-white/10">
            {/* Premium Header */}
            <div className={`${collapsed ? 'p-3' : 'p-5'} border-b border-gray-200 dark:border-white/10`}>
                <div className="flex items-center justify-between">
                    <ChameiLogo className={collapsed ? "h-7" : "h-9"} color="#10B981" textColor={collapsed ? "transparent" : undefined} />
                </div>

                {!collapsed && (
                    <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" onClick={() => handleAction('Perfil')}>
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                D
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-gray-900 dark:text-white truncate">Usuário Demo</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">Administrador</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Search */}
            <div className={`px-3 py-4 ${collapsed ? 'flex justify-center' : ''}`}>
                <button
                    onClick={onSearchClick}
                    className={`group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}
                >
                    <Search size={18} className="shrink-0" />
                    {!collapsed && <span className="text-xs font-semibold flex-1 text-left">Busca Rápida</span>}
                    {!collapsed && <span className="text-[10px] text-gray-400">⌘K</span>}
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto overflow-x-hidden scrollbar-none">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/demo' && pathname.startsWith(item.href + '/'));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${isActive
                                ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-semibold shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                                } ${collapsed ? 'justify-center' : ''}`}
                        >
                            {isActive && <div className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full" />}
                            <item.icon size={20} className={`shrink-0 ${item.color}`} strokeWidth={isActive ? 2.5 : 2} />
                            {!collapsed && <span className="text-sm">{item.name}</span>}
                            {!collapsed && item.hasBadge && unreadCount > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
                            )}
                        </Link>
                    );
                })}

                {!collapsed && <div className="h-px bg-gray-200 dark:bg-white/10 my-4" />}
                {!collapsed && <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Admin</p>}
                {adminItems.map((item) => {
                    return (
                        <button
                            key={item.href}
                            onClick={() => handleAction(item.name)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 ${collapsed ? 'justify-center' : ''}`}
                        >
                            <item.icon size={20} className={`shrink-0 ${item.color}`} />
                            {!collapsed && <span className="text-sm">{item.name}</span>}
                        </button>
                    );
                })}

            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-white/10">
                <button
                    onClick={() => handleAction('Sair')}
                    className={`flex items-center gap-3 w-full py-2.5 px-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}
                >
                    <LogOut size={18} />
                    {!collapsed && <span className="text-sm font-semibold">Sair</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-3 left-3 z-[100] p-2.5 bg-emerald-600 text-white rounded-lg shadow-lg">
                <Menu size={22} />
            </button>

            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-[1000]">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={() => setMobileOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-72 shadow-2xl flex flex-col animate-slideIn">
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="absolute top-4 -right-12 p-2 bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 rounded-xl border border-white/10 transition-all active:scale-90"
                        >
                            <X size={20} />
                        </button>
                        <SidebarContent />
                    </div>
                </div>
            )}

            <aside className={`hidden lg:flex flex-col transition-all duration-300 relative ${collapsed ? 'w-16' : 'w-64'} h-full flex-shrink-0 z-40`}>
                <SidebarContent />
                <button
                    onClick={() => onToggle(!collapsed)}
                    className="absolute top-20 -right-3 w-6 h-6 bg-white dark:bg-slate-900 border border-gray-300 dark:border-white/20 rounded-full flex items-center justify-center shadow-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors z-50 text-gray-600 dark:text-gray-400 hover:text-emerald-500"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </aside>
        </>
    );
}
