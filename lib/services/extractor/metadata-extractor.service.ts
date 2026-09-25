import { AffiliateService } from '../affiliate.service';
import { NvidiaAiService, GeneratedOfferCopy } from '../ai/nvidia-ai.service';
import { CategoryDetectorService } from '../ai/category-detector.service';
import { AmazonPaapiService } from './amazon-paapi.service';
import { ensureMinimumThreeImages } from '../../utils/image-helpers';

export interface ExtractedProductData {
  title: string;
  currentPrice: number;
  previousPrice: number | null;
  imageUrl: string;
  images?: string[];
  destinationUrl: string;
  affiliateUrl: string;
  merchantName: string;
  categoryId?: string;
  categoryName?: string;
  categorySlug?: string;
  description: string;
  aiCopy?: GeneratedOfferCopy;
}

export const MetadataExtractorService = {
  /**
   * Extrai dados de um produto a partir de qualquer URL e gera copy com IA
   */
  async extractFromUrl(rawUrl: string): Promise<{ success: boolean; data?: ExtractedProductData; error?: string }> {
    if (!rawUrl || typeof rawUrl !== 'string') {
      return { success: false, error: 'URL inválida.' };
    }

    let cleanUrl = rawUrl.trim();

    // Resolva encurtadores (amzn.to, meli.la, t.co, bit.ly) seguindo o redirecionamento
    cleanUrl = await this.resolveShortUrl(cleanUrl);

    const rule = AffiliateService.detectMerchant(cleanUrl);
    const merchantName = rule?.name || this.guessMerchantFromDomain(cleanUrl);

    // 1. Tentar extração via API Oficial do Mercado Livre (100% Precisa & Sem Bloqueio)
    if (merchantName.includes('Mercado Livre') || cleanUrl.includes('mercadolivre') || cleanUrl.includes('mercadolibre')) {
      const mlData = await this.extractFromMercadoLivreApi(cleanUrl);
      if (mlData) {
        return this.formatAndGenerateCopy(mlData);
      }
    }

    // 2. Tentar extração via ASIN da Amazon Brasil
    if (merchantName.includes('Amazon') || cleanUrl.includes('amazon')) {
      const amazonData = await this.extractFromAmazonAsin(cleanUrl);
      if (amazonData) {
        return this.formatAndGenerateCopy(amazonData);
      }
    }

    // 3. Fallback Geral via OpenGraph / HTML Scraping com Mobile User-Agent
    try {
      const response = await fetch(cleanUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9',
        },
      });

      if (response.ok) {
        const html = await response.text();
        let title = this.extractTitle(html);
        let currentPrice = this.extractCurrentPrice(html);
        let previousPrice = this.extractPreviousPrice(html, currentPrice);
        let imageUrl = this.extractImageUrl(html);
        let description = this.extractDescription(html);

        title = this.cleanTitle(title);

        if (title && title !== 'Produto em Promoção') {
          const genericData: ExtractedProductData = {
            title,
            currentPrice: currentPrice > 0 ? currentPrice : 0,
            previousPrice,
            imageUrl: imageUrl || '',
            destinationUrl: cleanUrl,
            affiliateUrl: AffiliateService.formatAffiliateUrl(cleanUrl),
            merchantName,
            description,
          };
          return this.formatAndGenerateCopy(genericData);
        }
      }
    } catch (err) {
      console.warn('[MetadataExtractor] Erro ao buscar HTML genérico:', err);
    }

    // 4. Último recurso: Extração de Slug da URL sem dados fictícios
    return this.extractFromUrlSlug(cleanUrl, merchantName);
  },

  /**
   * Resolve links encurtados (amzn.to, meli.la, etc.) para a URL completa do produto
   */
  async resolveShortUrl(url: string): Promise<string> {
    if (!url.includes('amzn.to') && !url.includes('meli.la') && !url.includes('t.co') && !url.includes('bit.ly') && !url.includes('a.co')) {
      return url;
    }

    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      if (res.url && res.url !== url) {
        return res.url;
      }
    } catch {
      // Ignorar erro de HEAD
    }
    return url;
  },

  /**
   * Extração 100% Exata via API Oficial e Gratuita do Mercado Livre (https://api.mercadolibre.com/items/MLB...)
   */
  async extractFromMercadoLivreApi(url: string): Promise<ExtractedProductData | null> {
    try {
      // Extrair o ID do item (ex: MLB3567891234 ou MLB-3567891234)
      const mlbMatch = url.match(/MLB-?(\d+)/i) || url.match(/MLB(\d+)/i);
      if (!mlbMatch || !mlbMatch[1]) {
        return null;
      }

      const itemId = `MLB${mlbMatch[1]}`;
      const apiUrl = `https://api.mercadolibre.com/items/${itemId}`;

      const res = await fetch(apiUrl);
      if (!res.ok) return null;

      const itemData = await res.json();
      if (!itemData || !itemData.title) return null;

      const title = itemData.title;
      const currentPrice = Number(itemData.price || 0);
      const previousPrice = itemData.original_price ? Number(itemData.original_price) : null;
      
      // Imagem oficial em alta resolução
      let imageUrl = itemData.pictures?.[0]?.secure_url || itemData.thumbnail || '';
      if (imageUrl.startsWith('http://')) {
        imageUrl = imageUrl.replace('http://', 'https://');
      }

      const rawPictures: string[] = Array.isArray(itemData.pictures)
        ? itemData.pictures.map((p: any) => p?.secure_url || p?.url || '').filter(Boolean)
        : [];

      const cleanedTitle = this.cleanTitle(title);
      const images = ensureMinimumThreeImages(imageUrl, rawPictures, cleanedTitle, 'Mercado Livre');

      const destinationUrl = itemData.permalink || url;
      const affiliateUrl = AffiliateService.formatAffiliateUrl(destinationUrl);

      return {
        title: cleanedTitle,
        currentPrice,
        previousPrice,
        imageUrl: images[0] || imageUrl,
        images,
        destinationUrl,
        affiliateUrl,
        merchantName: 'Mercado Livre',
        description: `Produto ${cleanedTitle} no Mercado Livre com preço promocional de R$ ${currentPrice.toFixed(2)}.`,
      };
    } catch (err) {
      console.warn('[MetadataExtractor] Erro na API do Mercado Livre:', err);
      return null;
    }
  },

  /**
   * Extração Específica para Amazon Brasil com ASIN, PA-API 5.0 Oficial ou Fallback com Imagem HD
   */
  async extractFromAmazonAsin(url: string): Promise<ExtractedProductData | null> {
    try {
      // Extrair ASIN (ex: B08N5WRWNW)
      const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/i) ||
                        url.match(/\/gp\/product\/([A-Z0-9]{10})/i) ||
                        url.match(/\/([A-Z0-9]{10})(?:[/?]|$)/i);

      const asin = asinMatch ? asinMatch[1] : null;

      // 1. Tentar PA-API 5.0 Oficial da Amazon se credenciais estiverem no .env.local
      if (asin && AmazonPaapiService.isConfigured()) {
        const paapiItem = await AmazonPaapiService.getItemByAsin(asin);
        if (paapiItem) {
          const affiliateUrl = AffiliateService.formatAffiliateUrl(paapiItem.detailPageUrl || url);
          return {
            title: this.cleanTitle(paapiItem.title),
            currentPrice: paapiItem.currentPrice,
            previousPrice: paapiItem.previousPrice,
            imageUrl: paapiItem.imageUrl,
            destinationUrl: paapiItem.detailPageUrl || url,
            affiliateUrl,
            merchantName: 'Amazon Brasil',
            description: `Produto ${paapiItem.title} na Amazon Brasil.`,
          };
        }
      }

      // 2. Imagem oficial da Amazon por ASIN HD (Resolução Nativa)
      const officialAmazonImage = asin
        ? `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`
        : '';

      // Tentar fetch mobile do HTML da Amazon
      let title = '';
      let currentPrice = 0;
      let previousPrice: number | null = null;
      let htmlImage = '';

      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9',
          },
        });

        if (response.ok) {
          const html = await response.text();
          title = this.extractTitle(html);
          currentPrice = this.extractCurrentPrice(html);
          previousPrice = this.extractPreviousPrice(html, currentPrice);
          htmlImage = this.extractImageUrl(html);
        }
      } catch {
        // Ignorar falha de fetch
      }

      // Se o título não foi extraído da página HTML, tentar extrair do slug da URL
      if (!title || title === 'Produto em Promoção' || title.includes('Amazon.com.br')) {
        title = this.titleFromUrlSlug(url);
      }

      title = this.cleanTitle(title);
      const imageUrl = htmlImage || officialAmazonImage || 'https://images-na.ssl-images-amazon.com/images/G/32/social_share/amazon_logo._CB633266943_.png';
      const affiliateUrl = AffiliateService.formatAffiliateUrl(url);

      return {
        title,
        currentPrice,
        previousPrice,
        imageUrl,
        destinationUrl: url,
        affiliateUrl,
        merchantName: 'Amazon Brasil',
        description: `Produto ${title} na Amazon Brasil.`,
      };
    } catch (err) {
      console.warn('[MetadataExtractor] Erro ao processar ASIN da Amazon:', err);
      return null;
    }
  },

  /**
   * Formata os dados extraídos, detecta a categoria automática entre as 24 oficiais e invoca a IA da NVIDIA
   */
  async formatAndGenerateCopy(extracted: ExtractedProductData): Promise<{ success: boolean; data: ExtractedProductData }> {
    // 1. Detecção Inteligente da Categoria Oficial entre as 24 categorias
    const detectedCategory = CategoryDetectorService.detectCategory(extracted.title, extracted.description);

    let aiCopy: GeneratedOfferCopy | undefined;

    try {
      aiCopy = await NvidiaAiService.generateOfferCopy({
        title: extracted.title,
        currentPrice: extracted.currentPrice,
        previousPrice: extracted.previousPrice,
        merchantName: extracted.merchantName,
        categoryName: detectedCategory.name,
        rawDescription: extracted.description,
      });
    } catch (err) {
      console.warn('[MetadataExtractor] Erro ao chamar IA da NVIDIA:', err);
    }

    const guaranteedImages = ensureMinimumThreeImages(
      extracted.imageUrl,
      extracted.images,
      extracted.title,
      extracted.merchantName
    );

    const finalData: ExtractedProductData = {
      ...extracted,
      title: aiCopy?.optimizedTitle || extracted.title,
      description: aiCopy?.description || extracted.description,
      imageUrl: guaranteedImages[0] || extracted.imageUrl,
      images: guaranteedImages,
      categoryId: detectedCategory.id,
      categoryName: detectedCategory.name,
      categorySlug: detectedCategory.slug,
      aiCopy,
    };

    return {
      success: true,
      data: finalData,
    };
  },

  /**
   * Extração limpa baseada no Slug da URL quando a loja possui bloqueio estrito
   */
  async extractFromUrlSlug(url: string, merchantName: string): Promise<{ success: boolean; data: ExtractedProductData }> {
    const title = this.titleFromUrlSlug(url);
    const affiliateUrl = AffiliateService.formatAffiliateUrl(url);
    const detectedCategory = CategoryDetectorService.detectCategory(title);

    let aiCopy: GeneratedOfferCopy | undefined;
    try {
      aiCopy = await NvidiaAiService.generateOfferCopy({
        title,
        currentPrice: 0,
        merchantName,
        categoryName: detectedCategory.name,
      });
    } catch {
      // Ignorar erro de IA no fallback
    }

    return {
      success: true,
      data: {
        title: aiCopy?.optimizedTitle || title,
        currentPrice: 0,
        previousPrice: null,
        imageUrl: '',
        destinationUrl: url,
        affiliateUrl,
        merchantName,
        categoryId: detectedCategory.id,
        categoryName: detectedCategory.name,
        categorySlug: detectedCategory.slug,
        description: aiCopy?.description || `Confira a oferta de ${title} na loja ${merchantName}.`,
        aiCopy,
      },
    };
  },

  titleFromUrlSlug(url: string): string {
    try {
      const parsedUrl = new URL(url);
      const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);

      for (const segment of pathSegments) {
        if (segment.length > 5 && !segment.startsWith('dp') && !segment.startsWith('MLB') && !segment.match(/^[A-Z0-9]{10}$/)) {
          const clean = segment
            .replace(/-/g, ' ')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase())
            .trim();
          if (clean.length > 5) return clean;
        }
      }
    } catch {
      // Fallback
    }
    return 'Oferta Especial';
  },

  cleanTitle(title: string): string {
    if (!title) return 'Produto em Promoção';
    return title
      .replace(/\s*\|.*$/, '')
      .replace(/\s*-.*Mercado Livre.*$/i, '')
      .replace(/\s*no Mercado Livre.*$/i, '')
      .replace(/\s*\| Magazine Luiza.*$/i, '')
      .replace(/\s*: Amazon\.com\.br.*$/i, '')
      .trim();
  },

  extractTitle(html: string): string {
    const ogMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
                    html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:title["']/i);
    if (ogMatch && ogMatch[1]) return this.decodeEntities(ogMatch[1]);

    const twMatch = html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i);
    if (twMatch && twMatch[1]) return this.decodeEntities(twMatch[1]);

    const amzMatch = html.match(/id=["']productTitle["'][^>]*>\s*([^<]+)\s*</i);
    if (amzMatch && amzMatch[1]) return amzMatch[1].trim();

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) return this.decodeEntities(titleMatch[1]);

    return 'Produto em Promoção';
  },

  extractCurrentPrice(html: string): number {
    const priceMeta = html.match(/<meta\s+property=["'](?:og:price:amount|product:price:amount)["']\s+content=["']([\d.,]+)["']/i);
    if (priceMeta && priceMeta[1]) {
      const parsed = parseFloat(priceMeta[1].replace(/\./g, '').replace(',', '.'));
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }

    const jsonLdMatch = html.match(/"price"\s*:\s*"?([\d.,]+)"?/i) || html.match(/"lowPrice"\s*:\s*"?([\d.,]+)"?/i);
    if (jsonLdMatch && jsonLdMatch[1]) {
      const parsed = parseFloat(jsonLdMatch[1].replace(/\./g, '').replace(',', '.'));
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }

    const mlPriceMatch = html.match(/class=["']andes-money-amount__fraction["'][^>]*>([\d.]+)</i);
    if (mlPriceMatch && mlPriceMatch[1]) {
      const parsed = parseFloat(mlPriceMatch[1].replace(/\./g, ''));
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }

    const amzPriceMatch = html.match(/class=["']a-price-whole["'][^>]*>([\d.,]+)</i);
    if (amzPriceMatch && amzPriceMatch[1]) {
      const parsed = parseFloat(amzPriceMatch[1].replace(/\./g, '').replace(',', '.'));
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }

    return 0;
  },

  extractPreviousPrice(html: string, currentPrice: number): number | null {
    const origMatch = html.match(/class=["']ui-pdp-price__original-value["'][\s\S]*?class=["']andes-money-amount__fraction["'][^>]*>([\d.]+)</i) ||
                      html.match(/class=["']a-text-price["'][\s\S]*?class=["']a-offscreen["'][^>]*>R\$\s*([\d.,]+)</i);

    if (origMatch && origMatch[1]) {
      const parsed = parseFloat(origMatch[1].replace(/\./g, '').replace(',', '.'));
      if (!isNaN(parsed) && parsed > currentPrice) return parsed;
    }
    return null;
  },

  extractImageUrl(html: string): string {
    const ogImg = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                  html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
    if (ogImg && ogImg[1]) return ogImg[1];

    const twImg = html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);
    if (twImg && twImg[1]) return twImg[1];

    const amzImg = html.match(/id=["']landingImage["'][^>]*src=["']([^"']+)["']/i);
    if (amzImg && amzImg[1]) return amzImg[1];

    return '';
  },

  extractDescription(html: string): string {
    const ogDesc = html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i) ||
                   html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    if (ogDesc && ogDesc[1]) return this.decodeEntities(ogDesc[1]);
    return '';
  },

  guessMerchantFromDomain(url: string): string {
    const lower = url.toLowerCase();
    if (lower.includes('amazon')) return 'Amazon Brasil';
    if (lower.includes('mercadolivre') || lower.includes('mercadolibre')) return 'Mercado Livre';
    if (lower.includes('magazineluiza') || lower.includes('magalu')) return 'Magazine Luiza';
    if (lower.includes('shopee')) return 'Shopee';
    if (lower.includes('casasbahia')) return 'Casas Bahia';
    return 'Loja Parceira';
  },

  decodeEntities(str: string): string {
    return str
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
  },
};
