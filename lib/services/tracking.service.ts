import { supabase, isSupabaseConfigured } from '../db/supabase';

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
      if (!targetUrl || typeof targetUrl !== 'string') return false;

      const trimmed = targetUrl.trim();

      // Rejeitar esquemas maliciosos ou URLs relativas a protocolo
      if (
        trimmed.toLowerCase().startsWith('javascript:') ||
        trimmed.toLowerCase().startsWith('data:') ||
        trimmed.startsWith('//')
      ) {
        return false;
      }

      const parsed = new URL(trimmed);

      // Exigir estritamente protocolo HTTPS
      if (parsed.protocol !== 'https:') {
        return false;
      }

      // Rejeitar credenciais na URL (ex: https://user:pass@evil.com)
      if (parsed.username || parsed.password) {
        return false;
      }

      const hostname = parsed.hostname.toLowerCase();

      const EXACT_ALLOWED_HOSTNAMES = new Set([
        'amazon.com.br',
        'www.amazon.com.br',
        'amzn.to',
        'mercadolivre.com.br',
        'www.mercadolivre.com.br',
        'mercadolibre.com',
        'www.mercadolibre.com',
      ]);

      if (EXACT_ALLOWED_HOSTNAMES.has(hostname)) {
        return true;
      }

      const ALLOWED_SUFFIXES = [
        '.amazon.com.br',
        '.mercadolivre.com.br',
        '.mercadolibre.com',
      ];

      return ALLOWED_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
    } catch {
      return false;
    }
  },

  resolveTargetUrl(offer: { destination_url: string; affiliate_url?: string | null }): string {
    const rawTarget = offer.affiliate_url?.trim() || offer.destination_url.trim();

    if (!rawTarget) {
      throw new Error('URL de destino da oferta não configurada.');
    }

    if (!this.isDomainAllowed(rawTarget)) {
      // Se a affiliate_url não for válida mas a destination_url for, usa destination_url
      if (offer.affiliate_url && this.isDomainAllowed(offer.destination_url)) {
        return offer.destination_url;
      }
      throw new Error('Domínio de destino não autorizado.');
    }

    return rawTarget;
  },
};
