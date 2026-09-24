import { supabase, isSupabaseConfigured } from '../db/supabase';

export interface UserProfile {
  id: string;
  role: 'admin' | 'user';
  created_at?: string;
}

export const AuthService = {
  async getCurrentUser() {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        return null;
      }
      return user;
    } catch {
      return null;
    }
  },

  async isAdmin(userId?: string): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) {
      // Em modo sem Supabase em dev, permitir apenas se simulação local
      return process.env.NODE_ENV !== 'production';
    }

    try {
      let targetUserId = userId;

      if (!targetUserId) {
        const user = await this.getCurrentUser();
        if (!user) return false;
        targetUserId = user.id;

        // Verificar metadata da sessão de forma imediata
        if (user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin') {
          return true;
        }
      }

      // Verificar no banco de dados na tabela de perfis (profiles)
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', targetUserId)
        .single();

      if (error || !data) {
        return false;
      }

      return data.role === 'admin';
    } catch {
      return false;
    }
  },

  async verifyAdminOrThrow(): Promise<string> {
    const user = await this.getCurrentUser();
    if (!user) {
      throw new Error('Não autenticado.');
    }

    const admin = await this.isAdmin(user.id);
    if (!admin) {
      throw new Error('Acesso negado: Requer privilégios de administrador.');
    }

    return user.id;
  },
};
