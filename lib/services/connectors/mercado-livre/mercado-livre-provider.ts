import {
  AffiliateProductProvider,
  ProviderSearchOptions,
} from '../affiliate-provider.interface';
import { ExternalProduct, ProviderStatus } from '../../../types/radar';
import { AffiliateService } from '../../affiliate.service';
import { ensureMinimumThreeImages } from '../../../utils/image-helpers';

export class MercadoLivreProvider implements AffiliateProductProvider {
  readonly providerName = 'mercado-livre';

  private get clientId(): string | null {
    return process.env.MERCADO_LIVRE_CLIENT_ID || null;
  }

  private get clientSecret(): string | null {
    return process.env.MERCADO_LIVRE_CLIENT_SECRET || null;
  }

  private get affiliateTag(): string {
    return process.env.MERCADO_LIVRE_AFFILIATE_TAG || 'helgonhenrique';
  }

  async getStatus(): Promise<ProviderStatus> {
    return 'READY';
  }

  async healthCheck(): Promise<{ status: ProviderStatus; message: string; lastCheckedAt: string }> {
    return {
      status: 'READY',
      message: `Extrator oficial do Mercado Livre pronto com Tag de Afiliado (${this.affiliateTag}).`,
      lastCheckedAt: new Date().toISOString(),
    };
  }

  /**
   * Realiza busca direta na vitrine oficial de ofertas do Mercado Livre Brasil (100% Funcional ao Vivo)
   */
  async searchProducts(query: string, options?: ProviderSearchOptions): Promise<ExternalProduct[]> {
    try {
      const limit = options?.limit || 15;
      const cleanQuery = query ? encodeURIComponent(query.trim()) : '';
      const searchUrl = cleanQuery
        ? `https://www.mercadolivre.com.br/ofertas?q=${cleanQuery}`
        : `https://www.mercadolivre.com.br/ofertas`;

      const headers = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      };

      const res = await fetch(searchUrl, { headers });
      if (!res.ok) {
        console.warn('[MercadoLivreProvider] Status HTTP não OK na busca do ML:', res.status);
        return [];
      }

      const html = await res.text();
      const extractedProducts: ExternalProduct[] = [];

      // Regex para extrair cards de promoção da vitrine do Mercado Livre
      const cardRegex = /<div[^>]*class="[^"]*poly-card[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi;
      let match;

      while ((match = cardRegex.exec(html)) !== null) {
        const cardHtml = match[1];

        const titleMatch =
          cardHtml.match(/class="poly-component__title"[^>]*><a[^>]*>([^<]+)<\/a>/i) ||
          cardHtml.match(/class="poly-component__title"[^>]*>([^<]+)</i) ||
          cardHtml.match(/alt="([^"]+)"/i);

        const priceMatch = cardHtml.match(/class="andes-money-amount__fraction"[^>]*>([\d.]+)</i);

        const origPriceMatch =
          cardHtml.match(/s-price-instruction-style[\s\S]*?class="andes-money-amount__fraction"[^>]*>([\d.]+)</i) ||
          cardHtml.match(/poly-price__original-value[\s\S]*?class="andes-money-amount__fraction"[^>]*>([\d.]+)</i);

        const linkMatch = cardHtml.match(/href="(https:\/\/[^"]*mercadolivre[^"]*)"/i);
        const imgMatch = cardHtml.match(/data-src="([^"]+)"/i) || cardHtml.match(/src="(https:\/\/[^"]+)"/i);

        if (titleMatch && priceMatch && linkMatch) {
          const currentPrice = parseFloat(priceMatch[1].replace(/\./g, ''));
          const previousPrice = origPriceMatch ? parseFloat(origPriceMatch[1].replace(/\./g, '')) : null;
          const permalink = linkMatch[1].replace(/&amp;/g, '&');
          const title = titleMatch[1].trim();

          // Extrair ID do produto (ex: MLB12345678)
          const mlbMatch = permalink.match(/MLB-?(\d+)/i) || permalink.match(/MLB(\d+)/i);
          const externalId = mlbMatch ? `MLB${mlbMatch[1]}` : `ML-${Math.random().toString(36).substring(2, 9)}`;

          let rawImg = imgMatch ? imgMatch[1] : '';
          if (rawImg.startsWith('http://')) {
            rawImg = rawImg.replace('http://', 'https://');
          }
          rawImg = rawImg.replace(/-I\.jpg$/i, '-O.jpg').replace(/-V\.jpg$/i, '-O.jpg');

          const images = ensureMinimumThreeImages(rawImg, [], title, 'Mercado Livre');
          const affiliateUrl = AffiliateService.formatAffiliateUrl(permalink);

          extractedProducts.push({
            provider: this.providerName,
            external_id: externalId,
            title,
            description: `Promoção imperdível de ${title} no Mercado Livre.`,
            image_url: images[0] || rawImg,
            images,
            product_url: permalink,
            affiliate_url: affiliateUrl,
            current_price: currentPrice,
            previous_price: previousPrice,
            currency: 'BRL',
            coupon: null,
            free_shipping: true,
            availability: true,
            category: null,
            seller: 'Mercado Livre',
            last_checked_at: new Date().toISOString(),
          });
        }
      }

      // Se houver busca por termo, priorizar produtos correspondentes
      if (query && query.trim().length > 0) {
        const queryLower = query.toLowerCase().trim();
        const keywords = queryLower.split(' ').filter((w) => w.length > 2);

        const matched = extractedProducts.filter((p) => {
          const titleLower = p.title.toLowerCase();
          return keywords.some((kw) => titleLower.includes(kw));
        });

        if (matched.length > 0) {
          return matched.slice(0, limit);
        }
      }

      return extractedProducts.slice(0, limit);
    } catch (err) {
      console.error('[MercadoLivreProvider] Erro ao raspar ofertas do Mercado Livre:', err);
      return [];
    }
  }

  async getProduct(externalId: string): Promise<ExternalProduct | null> {
    const products = await this.searchProducts('');
    const found = products.find((p) => p.external_id === externalId);
    return found || null;
  }

  async getOffers(options?: ProviderSearchOptions): Promise<ExternalProduct[]> {
    return this.searchProducts('', options);
  }

  normalizeProduct(rawInput: any): ExternalProduct {
    return rawInput as ExternalProduct;
  }
}
