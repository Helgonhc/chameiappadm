'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { usePermissions } from '../hooks/usePermissions';
import {
  LayoutDashboard,
  Users,
  Building2,
  Wrench,
  ClipboardList,
  FileText,
  MessageSquare,
  Bell,
  Package,
  Calendar,
  Clock,
  Settings,
  List,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Ticket,
  Calculator,
  UserCog,
  Download,
  FileCheck,
  TrendingUp,
  Search,
  FolderOpen,
  Zap,
  Droplets
} from 'lucide-react';
import { ChameiLogo } from './Logo';

// Menu items with individual colors for premium feel
const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, permission: null, color: 'text-indigo-500' },
  { name: 'Insights & BI', href: '/dashboard/performance', icon: TrendingUp, permission: 'can_view_reports', color: 'text-purple-500' },
  { name: 'Geradores', href: '/dashboard/reports', icon: Zap, permission: null, color: 'text-emerald-400' },
  { name: 'Clientes', href: '/dashboard/clients', icon: Building2, permission: 'can_view_all_clients', color: 'text-blue-500' },
  { name: 'Documentos', href: '/dashboard/documents', icon: FolderOpen, permission: null, color: 'text-amber-500' },
  { name: 'Equipamentos', href: '/dashboard/equipments', icon: Wrench, permission: 'can_create_equipments', color: 'text-emerald-500' },
  { name: 'Ordens de Serviço', href: '/dashboard/orders', icon: ClipboardList, permission: null, color: 'text-cyan-500' },
  { name: 'Chamados', href: '/dashboard/tickets', icon: Ticket, permission: null, color: 'text-red-500' },
  { name: 'Orçamentos', href: '/dashboard/quotes', icon: Calculator, permission: ['can_create_quotes', 'can_view_financials'], color: 'text-green-500' },
  { name: 'Manutenções', href: '/dashboard/maintenance', icon: Calendar, permission: null, color: 'text-pink-500' },
  { name: 'Solicitações', href: '/dashboard/maintenance-requests', icon: FileCheck, permission: null, color: 'text-orange-500' },
  { name: 'Agenda', href: '/dashboard/agenda', icon: Calendar, permission: null, color: 'text-violet-500' },
  { name: 'Banco de Horas', href: '/dashboard/overtime', icon: Clock, permission: null, color: 'text-teal-500' },
  { name: 'Estoque', href: '/dashboard/inventory', icon: Package, permission: 'can_manage_inventory', color: 'text-rose-500' },
  { name: 'Chat', href: '/dashboard/chat', icon: MessageSquare, permission: null, color: 'text-sky-500' },
  { name: 'Notificações', href: '/dashboard/notifications', icon: Bell, permission: null, hasBadge: true, color: 'text-yellow-500' },
  { name: 'Levantamento', href: '/dashboard/load-survey', icon: Zap, permission: null, color: 'text-amber-600' },
];

const adminItems = [
  { name: 'Usuários', href: '/dashboard/users', icon: UserCog, color: 'text-purple-400' },
  { name: 'Faturamento', href: '/dashboard/billing', icon: FileText, color: 'text-green-400' },
];

const masterItems = [
  { name: 'Leads & Vendas', href: '/dashboard/leads', icon: Zap, color: 'text-yellow-400' },
  { name: 'Gestão SaaS', href: '/dashboard/settings?tab=segments', icon: Settings, color: 'text-indigo-400' },
];

const profileItem = { name: 'Meu Perfil', href: '/dashboard/settings', icon: Settings };

interface SidebarProps {
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
  unreadCount?: number;
  collapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

export default function Sidebar({ onSearchClick, onNotificationsClick, unreadCount = 0, collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { profile, logout } = useAuthStore();
  const { can, isAdmin, isSuperAdmin } = usePermissions();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-white/10">
      {/* Premium Header */}
      <div className={`${collapsed ? 'p-3' : 'p-5'} border-b border-gray-200 dark:border-white/10`}>
        <div className="flex items-center justify-between">
          <ChameiLogo className={collapsed ? "h-7" : "h-9"} color="#10B981" textColor={collapsed ? "transparent" : undefined} />
        </div>

        {!collapsed && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
            <div className="relative">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {profile?.full_name?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{profile?.full_name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{profile?.role?.replace('_', ' ')}</p>
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
          let hasPermission = true;
          if (item.permission !== null) {
            hasPermission = Array.isArray(item.permission)
              ? item.permission.some(p => can(p as any))
              : can(item.permission as any);
          }
          if (!hasPermission) return null;

          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
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

        {!collapsed && isAdmin && <div className="h-px bg-gray-200 dark:bg-white/10 my-4" />}
        {!collapsed && isAdmin && <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Admin</p>}
        {isAdmin && adminItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                } ${collapsed ? 'justify-center' : ''}`}
            >
              <item.icon size={20} className={`shrink-0 ${item.color}`} />
              {!collapsed && <span className="text-sm">{item.name}</span>}
            </Link>
          );
        })}

        {!collapsed && isSuperAdmin && (
          <div className="mt-6 mb-2 px-3">
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Gestão Plataforma</p>
          </div>
        )}

        {isSuperAdmin && masterItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${isActive ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-500/30' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                } ${collapsed ? 'justify-center' : ''}`}
            >
              <item.icon size={20} className={`shrink-0 ${item.color}`} />
              {!collapsed && <span className="text-sm font-semibold">{item.name}</span>}
            </Link>
          );
        })}
      </nav>


      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-white/10">
        <button
          onClick={handleLogout}
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
      {/* Mobile Menu Buttons */}
      <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-3 left-3 z-50 p-2.5 bg-emerald-600 text-white rounded-lg shadow-lg">
        <Menu size={22} />
      </button>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-95 border-2 border-white/10"
        aria-label="Abrir menu"
      >
        <Menu size={24} />
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
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

      <aside className={`hidden lg:flex flex-col transition-all duration-300 relative ${collapsed ? 'w-16' : 'w-64'}`}>
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
