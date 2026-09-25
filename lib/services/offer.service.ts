import { supabase, isSupabaseConfigured } from '../db/supabase';
import { Offer } from '../types/database';
import { AffiliateService } from './affiliate.service';

export interface OfferFilters {
  categorySlug?: string;
  merchantSlug?: string;
  searchQuery?: string;
  status?: 'published' | 'draft' | 'archived' | 'expired' | 'all';
  featuredOnly?: boolean;
  sortBy?: 'recent' | 'price_asc' | 'price_desc';
}

export const OfferService = {
  /**
   * Busca apenas ofertas publicadas e ativas para a home e catálogo do portal
   */
  async getPublishedOffers(filters: OfferFilters = {}): Promise<Offer[]> {
    if (!isSupabaseConfigured || !supabase) {
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
        results = results.filter((o) => o.category?.slug === filters.categorySlug);
      }

      if (filters.merchantSlug) {
        results = results.filter((o) => o.merchant?.slug === filters.merchantSlug);
      }

      return this.sortOffers(results, filters.sortBy);
    } catch {
      return [];
    }
  },

  async getOffersByCategoryId(categoryId: string): Promise<Offer[]> {
    const all = await this.getPublishedOffers();
    return all.filter((o) => o.category_id === categoryId);
  },

  /**
   * Busca TODAS as ofertas para o Painel Administrativo (sem restrição de status)
   */
  async getAllOffersForAdmin(filters: OfferFilters = {}): Promise<Offer[]> {
    if (!isSupabaseConfigured || !supabase) {
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
        .order('published_at', { ascending: false });

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.featuredOnly) {
        query = query.eq('featured', true);
      }

      if (filters.searchQuery) {
        query = query.ilike('title', `%${filters.searchQuery}%`);
      }

      let { data, error } = await query;

      if (error || !data) {
        // Fallback resiliente sem join
        let simpleQuery = supabase
          .from('offers')
          .select('*')
          .order('published_at', { ascending: false });

        if (filters.status && filters.status !== 'all') {
          simpleQuery = simpleQuery.eq('status', filters.status);
        }

        const simpleRes = await simpleQuery;
        if (simpleRes.error || !simpleRes.data) {
          return [];
        }
        data = simpleRes.data;
      }

      let results = data as Offer[];

      if (filters.categorySlug) {
        results = results.filter((o) => o.category?.slug === filters.categorySlug);
      }

      if (filters.merchantSlug) {
        results = results.filter((o) => o.merchant?.slug === filters.merchantSlug);
      }

      return this.sortOffers(results, filters.sortBy);
    } catch {
      return [];
    }
  },

  async getFeaturedOffer(): Promise<Offer | null> {
    const offers = await this.getPublishedOffers();
    const featured = offers.find((o) => o.featured);
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

  /**
   * Cria uma nova oferta com injeção automática de Tag de Afiliado
   */
  async createOffer(input: Partial<Offer>): Promise<{ success: boolean; data?: Offer; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase não está configurado neste ambiente.' };
    }

    try {
      let affiliateUrl = input.affiliate_url;
      if (!affiliateUrl && input.destination_url) {
        affiliateUrl = AffiliateService.formatAffiliateUrl(input.destination_url);
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

  /**
   * Atualiza os campos de uma oferta existente
   */
  async updateOffer(id: string, input: Partial<Offer>): Promise<{ success: boolean; data?: Offer; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase não está configurado.' };
    }

    try {
      const updatePayload: Record<string, any> = { ...input };

      // Se atualizou a destination_url ou affiliate_url, reaplica o formatador de afiliados
      if (input.destination_url && !input.affiliate_url) {
        updatePayload.affiliate_url = AffiliateService.formatAffiliateUrl(input.destination_url);
      }

      if (input.current_price !== undefined) {
        updatePayload.current_price = Number(input.current_price);
      }
      if (input.previous_price !== undefined) {
        updatePayload.previous_price = input.previous_price ? Number(input.previous_price) : null;
      }

      const { data, error } = await supabase
        .from('offers')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data as Offer };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Erro ao atualizar oferta.' };
    }
  },

  /**
   * Alterna o status da oferta (published, draft, archived)
   */
  async toggleOfferStatus(id: string, newStatus: 'published' | 'draft' | 'archived'): Promise<{ success: boolean; error?: string }> {
    return this.updateOffer(id, { status: newStatus });
  },

  /**
   * Alterna a oferta como destaque principal (Hero Banner)
   */
  async toggleOfferFeatured(id: string, featured: boolean): Promise<{ success: boolean; error?: string }> {
    return this.updateOffer(id, { featured });
  },

  /**
   * Exclui permanentemente uma oferta do Supabase
   */
  async deleteOffer(id: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase não está configurado.' };
    }

    try {
      const { error } = await supabase.from('offers').delete().eq('id', id);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Erro ao excluir oferta.' };
    }
  },
};
