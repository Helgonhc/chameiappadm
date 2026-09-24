import {
  AffiliateProductProvider,
  ProviderSearchOptions,
} from '../affiliate-provider.interface';
import { ExternalProduct, ProviderStatus } from '../../../types/radar';

export class MercadoLivreProvider implements AffiliateProductProvider {
  readonly providerName = 'mercado-livre';

  async getStatus(): Promise<ProviderStatus> {
    return 'NOT_CONFIGURED';
  }

  async healthCheck(): Promise<{ status: ProviderStatus; message: string; lastCheckedAt: string }> {
    return {
      status: 'NOT_CONFIGURED',
      message: 'Integração Mercado Livre aguardando credenciais e regras de afiliados.',
      lastCheckedAt: new Date().toISOString(),
    };
  }

  async searchProducts(query: string, options?: ProviderSearchOptions): Promise<ExternalProduct[]> {
    return [];
  }

  async getProduct(externalId: string): Promise<ExternalProduct | null> {
    return null;
  }

  async getOffers(options?: ProviderSearchOptions): Promise<ExternalProduct[]> {
    return [];
  }

  normalizeProduct(rawInput: any): ExternalProduct {
    return {
      provider: this.providerName,
      external_id: String(rawInput?.id || ''),
      title: String(rawInput?.title || ''),
      description: rawInput?.description ? String(rawInput.description) : null,
      image_url: String(rawInput?.thumbnail || rawInput?.image_url || ''),
      product_url: String(rawInput?.permalink || rawInput?.product_url || ''),
      affiliate_url: rawInput?.affiliate_url ? String(rawInput.affiliate_url) : null,
      current_price: Number(rawInput?.price || 0),
      previous_price: rawInput?.original_price ? Number(rawInput.original_price) : null,
      currency: 'BRL',
      coupon: rawInput?.coupon ? String(rawInput.coupon) : null,
      free_shipping: Boolean(rawInput?.shipping?.free_shipping),
      availability: Boolean(rawInput?.available_quantity > 0),
      category: rawInput?.category_id ? String(rawInput.category_id) : null,
      seller: 'Mercado Livre',
      last_checked_at: new Date().toISOString(),
      raw_metadata: typeof rawInput === 'object' ? rawInput : null,
    };
  }
}
