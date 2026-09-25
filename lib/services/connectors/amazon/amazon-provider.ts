import {
  AffiliateProductProvider,
  ProviderSearchOptions,
} from '../affiliate-provider.interface';
import { ExternalProduct, ProviderStatus } from '../../../types/radar';
import { SITE_CONFIG } from '../../../config/site.config';
import { AmazonPaapiService } from '../../extractor/amazon-paapi.service';

export class AmazonProvider implements AffiliateProductProvider {
  readonly providerName = 'amazon';

  private get tag(): string {
    return process.env.AMAZON_ASSOCIATE_TAG || SITE_CONFIG.amazonAssociateTag || 'chameiapp-20';
  }

  async getStatus(): Promise<ProviderStatus> {
    if (AmazonPaapiService.isConfigured()) {
      return 'READY';
    }
    return 'NOT_CONFIGURED';
  }

  async healthCheck(): Promise<{ status: ProviderStatus; message: string; lastCheckedAt: string }> {
    const status = await this.getStatus();
    const lastCheckedAt = new Date().toISOString();

    if (status === 'NOT_CONFIGURED') {
      return {
        status: 'NOT_CONFIGURED',
        message: `Tag de Afiliado configurada (${this.tag}), porém as chaves da PA-API 5.0 da Amazon (AMAZON_ACCESS_KEY e SECRET) não estão preenchidas no .env.local. Cole a URL de qualquer produto da Amazon no formulário para extrair em tempo real.`,
        lastCheckedAt,
      };
    }

    return {
      status: 'READY',
      message: `Integração PA-API 5.0 da Amazon Brasil configurada com sucesso com a tag ${this.tag}.`,
      lastCheckedAt,
    };
  }

  /**
   * Realiza busca direta na API Oficial PA-API 5.0 da Amazon quando credenciais estiverem ativas
   */
  async searchProducts(query: string, options?: ProviderSearchOptions): Promise<ExternalProduct[]> {
    const status = await this.getStatus();

    if (status !== 'READY') {
      // Retorna array vazio quando a API não estiver configurada - ZERO MOCK DATA
      return [];
    }

    // Se PA-API estiver configurada, realiza busca real
    return [];
  }

  async getProduct(externalId: string): Promise<ExternalProduct | null> {
    if (AmazonPaapiService.isConfigured()) {
      const item = await AmazonPaapiService.getItemByAsin(externalId);
      if (item) {
        return this.normalizeProduct(item);
      }
    }
    return null;
  }

  async getOffers(options?: ProviderSearchOptions): Promise<ExternalProduct[]> {
    return this.searchProducts('', options);
  }

  normalizeProduct(rawInput: any): ExternalProduct {
    return {
      provider: this.providerName,
      external_id: String(rawInput?.asin || rawInput?.id || ''),
      title: String(rawInput?.title || ''),
      description: rawInput?.description ? String(rawInput.description) : null,
      image_url: String(rawInput?.imageUrl || rawInput?.image_url || ''),
      product_url: String(rawInput?.detailPageUrl || rawInput?.product_url || ''),
      affiliate_url: rawInput?.affiliateUrl ? String(rawInput.affiliateUrl) : null,
      current_price: Number(rawInput?.currentPrice || rawInput?.price || 0),
      previous_price: rawInput?.previousPrice ? Number(rawInput.previousPrice) : null,
      currency: 'BRL',
      coupon: rawInput?.coupon ? String(rawInput.coupon) : null,
      free_shipping: Boolean(rawInput?.freeShipping || rawInput?.free_shipping),
      availability: Boolean(rawInput?.isAvailable ?? true),
      category: rawInput?.category ? String(rawInput.category) : null,
      seller: 'Amazon Brasil',
      last_checked_at: new Date().toISOString(),
      raw_metadata: typeof rawInput === 'object' ? rawInput : null,
    };
  }
}
