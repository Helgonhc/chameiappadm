import { supabase, isSupabaseConfigured } from '../db/supabase';
import { Offer } from '../types/database';

export interface OfferFilters {
  categorySlug?: string;
  merchantSlug?: string;
  searchQuery?: string;
  sortBy?: 'recent' | 'price_asc' | 'price_desc';
}

export const OfferService = {
  async getPublishedOffers(filters: OfferFilters = {}): Promise<Offer[]> {
    if (!isSupabaseConfigured || !supabase) {
      // Regra estrita: Não utilizar catálogo embutido como fallback silencioso.
      return [];
    }

    try {
      let query = supabase
        .from('offers')
        .select(`
          *,
          category:categories(*),
          merchant:merchants(*)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (filters.searchQuery) {
        query = query.ilike('title', `%${filters.searchQuery}%`);
      }

      const { data, error } = await query;

      if (error || !data) {
        console.error('[OfferService] Erro ao buscar ofertas no Supabase:', error);
        return [];
      }

      let results = data as Offer[];

      if (filters.categorySlug) {
        results = results.filter(o => o.category?.slug === filters.categorySlug);
      }

      if (filters.merchantSlug) {
        results = results.filter(o => o.merchant?.slug === filters.merchantSlug);
      }

      return this.sortOffers(results, filters.sortBy);
    } catch (err) {
      console.error('[OfferService Exceção]', err);
      return [];
    }
  },

  async getFeaturedOffer(): Promise<Offer | null> {
    const offers = await this.getPublishedOffers();
    const featured = offers.find(o => o.featured);
    return featured || null;
  },

  async getOfferBySlug(slug: string): Promise<Offer | null> {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          category:categories(*),
          merchant:merchants(*)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error || !data) {
        return null;
      }

      return data as Offer;
    } catch {
      return null;
    }
  },

  async getOfferById(id: string): Promise<Offer | null> {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          category:categories(*),
          merchant:merchants(*)
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        return null;
      }

      return data as Offer;
    } catch {
      return null;
    }
  },

  sortOffers(offers: Offer[], sortBy?: 'recent' | 'price_asc' | 'price_desc'): Offer[] {
    if (sortBy === 'price_asc') {
      return [...offers].sort((a, b) => a.current_price - b.current_price);
    }
    if (sortBy === 'price_desc') {
      return [...offers].sort((a, b) => b.current_price - a.current_price);
    }
    return offers;
  }
};
