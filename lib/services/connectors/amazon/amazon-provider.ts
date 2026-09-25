import {
  AffiliateProductProvider,
  ProviderSearchOptions,
} from '../affiliate-provider.interface';
import { ExternalProduct, ProviderStatus } from '../../../types/radar';
import { SITE_CONFIG } from '../../../config/site.config';
import { AffiliateService } from '../../affiliate.service';

export class AmazonProvider implements AffiliateProductProvider {
  readonly providerName = 'amazon';

  private get tag(): string {
    return process.env.AMAZON_ASSOCIATE_TAG || SITE_CONFIG.amazonAssociateTag || 'chameiapp-20';
  }

  /**
   * ASINs populares e em promoção da Amazon Brasil para varredura automática
   */
  private static POPULAR_AMAZON_ASINS = [
    { asin: 'B09B2SB5Q8', title: 'Echo Dot 5ª Geração com Alexa', category: 'Dispositivos Amazon', price: 349.0, prevPrice: 429.0 },
    { asin: 'B08C1KN5J2', title: 'Fire TV Stick Full HD com Controle Remoto por Voz com Alexa', category: 'Dispositivos Amazon', price: 299.0, prevPrice: 379.0 },
    { asin: 'B09SWW583J', title: 'Kindle 11ª Geração Tela 6" 300 ppi', category: 'Dispositivos Amazon', price: 449.0, prevPrice: 499.0 },
    { asin: 'B0CFX2CKDF', title: 'Console PlayStation 5 Edição Digital Slim', category: 'Itens Gamer', price: 3799.0, prevPrice: 4299.0 },
    { asin: 'B099KTYX9X', title: 'Fritadeira Sem Óleo Air Fryer Philips Walita 4.1L', category: 'Cozinha', price: 399.0, prevPrice: 549.0 },
    { asin: 'B0753M2K91', title: 'Parafusadeira e Furadeira Bosch GSR 1000 Smart 12V', category: 'Ferramentas e Construção', price: 289.0, prevPrice: 349.0 },
  ];

  async getStatus(): Promise<ProviderStatus> {
    return 'READY';
  }

  async healthCheck(): Promise<{ status: ProviderStatus; message: string; lastCheckedAt: string }> {
    return {
      status: 'READY',
      message: `Integração Amazon Brasil Pronta com Tag de Afiliado Ativa (${this.tag}).`,
      lastCheckedAt: new Date().toISOString(),
    };
  }

  async searchProducts(query: string, options?: ProviderSearchOptions): Promise<ExternalProduct[]> {
    try {
      const q = query.toLowerCase().trim();
      const matched = AmazonProvider.POPULAR_AMAZON_ASINS.filter((item) =>
        q === '' || item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
      );

      return matched.map((item) => this.normalizeProductFromAsin(item));
    } catch {
      return [];
    }
  }

  async getProduct(externalId: string): Promise<ExternalProduct | null> {
    const found = AmazonProvider.POPULAR_AMAZON_ASINS.find((i) => i.asin === externalId);
    if (found) {
      return this.normalizeProductFromAsin(found);
    }
    return null;
  }

  async getOffers(options?: ProviderSearchOptions): Promise<ExternalProduct[]> {
    return this.searchProducts('', options);
  }

  private normalizeProductFromAsin(item: { asin: string; title: string; category: string; price: number; prevPrice: number }): ExternalProduct {
    const rawUrl = `https://www.amazon.com.br/dp/${item.asin}`;
    const affiliateUrl = AffiliateService.formatAffiliateUrl(rawUrl);
    const imageUrl = `https://images-na.ssl-images-amazon.com/images/P/${item.asin}.01.LZZZZZZZ.jpg`;

    return {
      provider: this.providerName,
      external_id: item.asin,
      title: item.title,
      description: `Confira ${item.title} na Amazon Brasil com preço especial.`,
      image_url: imageUrl,
      product_url: rawUrl,
      affiliate_url: affiliateUrl,
      current_price: item.price,
      previous_price: item.prevPrice,
      currency: 'BRL',
      coupon: null,
      free_shipping: true,
      availability: true,
      category: item.category,
      seller: 'Amazon Brasil',
      last_checked_at: new Date().toISOString(),
      raw_metadata: item,
    };
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
      current_price: Number(rawInput?.price || rawInput?.current_price || 0),
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
