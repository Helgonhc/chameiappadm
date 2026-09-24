import { supabase, isSupabaseConfigured } from '../db/supabase';
import { Offer } from '../types/database';
import { SEED_OFFERS } from './seed-data';

export interface OfferFilters {
  categorySlug?: string;
  merchantSlug?: string;
  searchQuery?: string;
  sortBy?: 'recent' | 'price_asc' | 'price_desc';
}

export const OfferService = {
  async getPublishedOffers(filters: OfferFilters = {}): Promise<Offer[]> {
    if (!isSupabaseConfigured || !supabase) {
      return this.filterLocalOffers(SEED_OFFERS, filters);
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

      if (error || !data || data.length === 0) {
        return this.filterLocalOffers(SEED_OFFERS, filters);
      }

      let results = data as Offer[];

      if (filters.categorySlug) {
        results = results.filter(o => o.category?.slug === filters.categorySlug);
      }

      if (filters.merchantSlug) {
        results = results.filter(o => o.merchant?.slug === filters.merchantSlug);
      }

      return this.sortOffers(results, filters.sortBy);
    } catch {
      return this.filterLocalOffers(SEED_OFFERS, filters);
    }
  },

  async getFeaturedOffer(): Promise<Offer | null> {
    const offers = await this.getPublishedOffers();
    const featured = offers.find(o => o.featured);
    return featured || offers[0] || null;
  },

  async getOfferBySlug(slug: string): Promise<Offer | null> {
    if (!isSupabaseConfigured || !supabase) {
      return SEED_OFFERS.find(o => o.slug === slug) || null;
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
        .single();

      if (error || !data) {
        return SEED_OFFERS.find(o => o.slug === slug) || null;
      }

      return data as Offer;
    } catch {
      return SEED_OFFERS.find(o => o.slug === slug) || null;
    }
  },

  async getOfferById(id: string): Promise<Offer | null> {
    if (!isSupabaseConfigured || !supabase) {
      return SEED_OFFERS.find(o => o.id === id) || null;
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
        return SEED_OFFERS.find(o => o.id === id) || null;
      }

      return data as Offer;
    } catch {
      return SEED_OFFERS.find(o => o.id === id) || null;
    }
  },

  filterLocalOffers(offers: Offer[], filters: OfferFilters): Offer[] {
    let result = [...offers];

    if (filters.categorySlug) {
      result = result.filter(o => o.category?.slug === filters.categorySlug);
    }

    if (filters.merchantSlug) {
      result = result.filter(o => o.merchant?.slug === filters.merchantSlug);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(o =>
        o.title.toLowerCase().includes(query) ||
        o.description?.toLowerCase().includes(query)
      );
    }

    return this.sortOffers(result, filters.sortBy);
  },

  sortOffers(offers: Offer[], sortBy?: 'recent' | 'price_asc' | 'price_desc'): Offer[] {
    if (sortBy === 'price_asc') {
      return offers.sort((a, b) => a.current_price - b.current_price);
    }
    if (sortBy === 'price_desc') {
      return offers.sort((a, b) => b.current_price - a.current_price);
    }
    return offers;
  }
};
