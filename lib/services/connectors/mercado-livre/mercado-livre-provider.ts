import {
  AffiliateProductProvider,
  ProviderSearchOptions,
} from '../affiliate-provider.interface';
import { ExternalProduct, ProviderStatus } from '../../../types/radar';
import { AffiliateService } from '../../affiliate.service';

export class MercadoLivreProvider implements AffiliateProductProvider {
  readonly providerName = 'mercado-livre';

  async getStatus(): Promise<ProviderStatus> {
    return 'READY';
  }

  async healthCheck(): Promise<{ status: ProviderStatus; message: string; lastCheckedAt: string }> {
    return {
      status: 'READY',
      message: 'API Oficial do Mercado Livre conectada e pronta para busca de ofertas em tempo real.',
      lastCheckedAt: new Date().toISOString(),
    };
  }

  /**
   * Realiza busca direta na API Pública Oficial do Mercado Livre Brasil
   */
  async searchProducts(query: string, options?: ProviderSearchOptions): Promise<ExternalProduct[]> {
    try {
      const searchTerm = query || 'oferta do dia';
      const limit = options?.limit || 20;
      const url = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}`;

      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
      });
      if (!res.ok) {
        console.warn('[MercadoLivreProvider] Falha ao buscar produtos no ML:', res.status);
        return [];
      }

      const data = await res.json();
      const results = data.results || [];

      return results.map((item: any) => this.normalizeProduct(item));
    } catch (err) {
      console.error('[MercadoLivreProvider] Erro ao buscar produtos:', err);
      return [];
    }
  }

  async getProduct(externalId: string): Promise<ExternalProduct | null> {
    try {
      const url = `https://api.mercadolibre.com/items/${externalId}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
      });
      if (!res.ok) return null;

      const item = await res.json();
      return this.normalizeProduct(item);
    } catch {
      return null;
    }
  }

  async getOffers(options?: ProviderSearchOptions): Promise<ExternalProduct[]> {
    return this.searchProducts('promocao desconto', options);
  }

  normalizeProduct(rawInput: any): ExternalProduct {
    const currentPrice = Number(rawInput?.price || 0);
    const previousPrice = rawInput?.original_price ? Number(rawInput.original_price) : null;
    const permalink = rawInput?.permalink || `https://www.mercadolivre.com.br/p/${rawInput?.id}`;
    const affiliateUrl = AffiliateService.formatAffiliateUrl(permalink);

    let imageUrl = rawInput?.thumbnail || rawInput?.pictures?.[0]?.secure_url || '';
    if (imageUrl.startsWith('http://')) {
      imageUrl = imageUrl.replace('http://', 'https://');
    }
    // Melhorar resolução da thumbnail do Mercado Livre (-I.jpg -> -O.jpg)
    imageUrl = imageUrl.replace(/-I\.jpg$/i, '-O.jpg').replace(/-V\.jpg$/i, '-O.jpg');

    return {
      provider: this.providerName,
      external_id: String(rawInput?.id || ''),
      title: String(rawInput?.title || 'Produto Mercado Livre'),
      description: `Produto ${rawInput?.title} no Mercado Livre.`,
      image_url: imageUrl,
      product_url: permalink,
      affiliate_url: affiliateUrl,
      current_price: currentPrice,
      previous_price: previousPrice,
      currency: 'BRL',
      coupon: null,
      free_shipping: Boolean(rawInput?.shipping?.free_shipping),
      availability: Boolean(rawInput?.available_quantity ? rawInput.available_quantity > 0 : true),
      category: rawInput?.category_id ? String(rawInput.category_id) : null,
      seller: rawInput?.seller?.nickname || 'Mercado Livre',
      last_checked_at: new Date().toISOString(),
      raw_metadata: rawInput,
    };
  }
}
