import { supabase, isSupabaseConfigured } from '../db/supabase';
import { SITE_CONFIG } from '../config/site.config';

export interface ClickTrackParams {
  offerId: string;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
}

export const TrackingService = {
  async recordClick(params: ClickTrackParams): Promise<void> {
    if (!isSupabaseConfigured || !supabase) {
      console.log(`[Click Tracking Mock] Click gravado para oferta ${params.offerId}`);
      return;
    }

    try {
      await supabase.from('click_events').insert({
        offer_id: params.offerId,
        referrer: params.referrer || null,
        utm_source: params.utmSource || null,
        utm_medium: params.utmMedium || null,
        utm_campaign: params.utmCampaign || null,
      });
    } catch (err) {
      console.error('[Click Tracking Error]', err);
    }
  },

  isDomainAllowed(targetUrl: string): boolean {
    try {
      const parsed = new URL(targetUrl);
      const hostname = parsed.hostname.toLowerCase();
      
      const allowedDomains = [
        'amazon.com.br',
        'www.amazon.com.br',
        'mercadolivre.com.br',
        'www.mercadolivre.com.br',
        'mercadolibre.com',
        'www.mercadolibre.com',
        'amzn.to',
      ];

      return allowedDomains.some(domain => hostname === domain || hostname.endsWith('.' + domain));
    } catch {
      return false;
    }
  },

  resolveTargetUrl(offer: { destination_url: string; affiliate_url?: string | null }): string {
    const rawTarget = offer.affiliate_url?.trim() || offer.destination_url.trim();

    if (!rawTarget) {
      throw new Error('URL de destino não configurada.');
    }

    if (!this.isDomainAllowed(rawTarget)) {
      console.warn(`[Open Redirect Protection] Domínio não autorizado: ${rawTarget}`);
      // Fallback seguro se não for domínio permitido
      return offer.destination_url;
    }

    return rawTarget;
  },
};
