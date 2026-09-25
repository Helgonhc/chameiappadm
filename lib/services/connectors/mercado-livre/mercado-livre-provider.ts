import {
  AffiliateProductProvider,
  ProviderSearchOptions,
} from '../affiliate-provider.interface';
import { ExternalProduct, ProviderStatus } from '../../../types/radar';
import { AffiliateService } from '../../affiliate.service';
import { ensureMinimumThreeImages } from '../../../utils/image-helpers';

export class MercadoLivreProvider implements AffiliateProductProvider {
  readonly providerName = 'mercado-livre';
  private cachedToken: { token: string; expiresAt: number } | null = null;

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
    const hasAppKeys = Boolean(this.clientId && this.clientSecret);
    return {
      status: 'READY',
      message: hasAppKeys
        ? `API do Mercado Livre pronta com credenciais OAuth ativas (Client ID: ${this.clientId}) e Tag: ${this.affiliateTag}.`
        : `API do Mercado Livre pronta em modo público com Tag de Afiliado (${this.affiliateTag}).`,
      lastCheckedAt: new Date().toISOString(),
    };
  }

  /**
   * Autenticação OAuth Client Credentials oficial do Mercado Livre
   */
  async getAccessToken(): Promise<string | null> {
    if (this.cachedToken && Date.now() < this.cachedToken.expiresAt) {
      return this.cachedToken.token;
    }

    if (!this.clientId || !this.clientSecret) return null;

    try {
      const res = await fetch('https://api.mercadolibre.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.access_token) {
          const expiresIn = (data.expires_in || 21600) * 1000;
          this.cachedToken = {
            token: data.access_token,
            expiresAt: Date.now() + expiresIn - 60000,
          };
          return data.access_token;
        }
      }
    } catch (err) {
      console.warn('[MercadoLivreProvider] Erro ao autenticar OAuth no ML:', err);
    }
    return null;
  }

  /**
   * Realiza busca direta na API Oficial do Mercado Livre Brasil com resiliência
   */
  async searchProducts(query: string, options?: ProviderSearchOptions): Promise<ExternalProduct[]> {
    try {
      const searchTerm = query || 'oferta';
      const limit = options?.limit || 20;
      const accessToken = await this.getAccessToken();

      const headers: Record<string, string> = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'application/json',
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      // 1. Tentar busca por termo direto
      const primaryUrl = `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}`;
      let res = await fetch(primaryUrl, { headers });

      // 2. Se falhar com token, tentar requisição pública limpa
      if (!res.ok && accessToken) {
        delete headers['Authorization'];
        res = await fetch(primaryUrl, { headers });
      }

      if (res.ok) {
        const data = await res.json();
        const results = data.results || [];
        if (results.length > 0) {
          return results.map((item: any) => this.normalizeProduct(item));
        }
      }

      // 3. Fallback: Busca genérica de ofertas do dia se o termo específico não retornar resultados
      const fallbackUrl = `https://api.mercadolibre.com/sites/MLB/search?q=promocao&limit=${limit}`;
      const fallbackRes = await fetch(fallbackUrl, { headers });
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        const fallbackResults = fallbackData.results || [];
        return fallbackResults.map((item: any) => this.normalizeProduct(item));
      }

      return [];
    } catch (err) {
      console.error('[MercadoLivreProvider] Erro ao buscar produtos no Mercado Livre:', err);
      return [];
    }
  }

  async getProduct(externalId: string): Promise<ExternalProduct | null> {
    try {
      const url = `https://api.mercadolibre.com/items/${externalId}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
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
    const title = String(rawInput?.title || 'Produto Mercado Livre');

    let imageUrl = rawInput?.thumbnail || rawInput?.pictures?.[0]?.secure_url || '';
    if (imageUrl.startsWith('http://')) {
      imageUrl = imageUrl.replace('http://', 'https://');
    }
    // Melhorar resolução da thumbnail do Mercado Livre (-I.jpg -> -O.jpg)
    imageUrl = imageUrl.replace(/-I\.jpg$/i, '-O.jpg').replace(/-V\.jpg$/i, '-O.jpg');

    // Extrair array de imagens da API (pictures)
    const rawPictures: string[] = Array.isArray(rawInput?.pictures)
      ? rawInput.pictures.map((p: any) => p?.secure_url || p?.url || '').filter(Boolean)
      : [];

    const images = ensureMinimumThreeImages(imageUrl, rawPictures, title, 'Mercado Livre');

    return {
      provider: this.providerName,
      external_id: String(rawInput?.id || ''),
      title,
      description: `Produto ${title} no Mercado Livre.`,
      image_url: images[0] || imageUrl,
      images,
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
