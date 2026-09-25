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

      let { data, error } = await query;

      if (error || !data) {
        // Fallback resiliente: tentar busca sem join se a relação falhar
        const simpleRes = await supabase
          .from('offers')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (simpleRes.error || !simpleRes.data) {
          return [];
        }
        data = simpleRes.data;
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
  },

  async createOffer(input: Partial<Offer>): Promise<{ success: boolean; data?: Offer; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase não está configurado neste ambiente.' };
    }

    try {
      let affiliateUrl = input.affiliate_url;
      const associateTag = process.env.AMAZON_ASSOCIATE_TAG || 'chameiapp-20';

      if (input.destination_url && input.destination_url.includes('amazon.com.br') && !affiliateUrl) {
        try {
          const parsed = new URL(input.destination_url);
          parsed.searchParams.set('tag', associateTag);
          affiliateUrl = parsed.toString();
        } catch {
          affiliateUrl = input.destination_url;
        }
      }

      const payload = {
        title: input.title,
        slug: input.slug,
        description: input.description || null,
        image_url: input.image_url,
        destination_url: input.destination_url,
        affiliate_url: affiliateUrl || input.destination_url,
        current_price: Number(input.current_price),
        previous_price: input.previous_price ? Number(input.previous_price) : null,
        coupon_code: input.coupon_code || null,
        free_shipping: Boolean(input.free_shipping),
        featured: Boolean(input.featured),
        status: input.status || 'published',
        category_id: input.category_id || null,
        merchant_id: input.merchant_id || null,
        published_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('offers')
        .insert(payload)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as Offer };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Erro ao salvar oferta.' };
    }
  },
};
