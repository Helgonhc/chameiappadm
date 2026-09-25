'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
        await supabase.auth.signOut();
      }

      // Limpar cookie dev se houver
      document.cookie = 'chamei_dev_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1.5 rounded text-xs font-bold text-red-300 hover:text-white hover:bg-red-900/40 border border-red-800/50 transition-colors cursor-pointer flex items-center gap-1"
      title="Sair do Painel Administrativo"
    >
      <span>Sair</span>
      <span className="text-[10px]">🚪</span>
    </button>
  );
}
