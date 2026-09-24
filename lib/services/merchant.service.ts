import { supabase, isSupabaseConfigured } from '../db/supabase';
import { Category, Merchant } from '../types/database';
import { SEED_CATEGORIES, SEED_MERCHANTS } from './seed-data';

export const MerchantService = {
  async getCategories(): Promise<Category[]> {
    if (!isSupabaseConfigured || !supabase) {
      return SEED_CATEGORIES;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error || !data || data.length === 0) {
        return SEED_CATEGORIES;
      }

      return data as Category[];
    } catch {
      return SEED_CATEGORIES;
    }
  },

  async getMerchants(): Promise<Merchant[]> {
    if (!isSupabaseConfigured || !supabase) {
      return SEED_MERCHANTS;
    }

    try {
      const { data, error } = await supabase
        .from('merchants')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error || !data || data.length === 0) {
        return SEED_MERCHANTS;
      }

      return data as Merchant[];
    } catch {
      return SEED_MERCHANTS;
    }
  },
};
