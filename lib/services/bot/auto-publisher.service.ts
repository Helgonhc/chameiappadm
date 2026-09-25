import { MercadoLivreProvider } from '../connectors/mercado-livre/mercado-livre-provider';
import { MetadataExtractorService } from '../extractor/metadata-extractor.service';
import { OfferService } from '../offer.service';
import { Offer } from '../../types/database';

export interface AutoScanResult {
  timestamp: string;
  scannedCount: number;
  qualifiedCount: number;
  publishedCount: number;
  publishedOffers: Offer[];
  logs: string[];
}

export const AutoPublisherService = {
  /**
   * Termos em alta para rastreamento automático de promoções reais
   */
  TRENDING_KEYWORDS: [
    'air fryer',
    'ps5 console',
    'smartphone galaxy',
    'iphone 15',
    'notebook dell',
    'smart tv 4k',
    'echo dot alexa',
    'parafusadeira',
    'fone bluetooth',
    'cadeira gamer',
    'fralda pampers',
    'perfume importado',
  ],

  /**
   * Executa varredura autônoma de ofertas, gera cópias via IA e publica ofertas reais
   */
  async runAutoScan(customKeywords?: string[]): Promise<AutoScanResult> {
    const logs: string[] = [];
    logs.push(`[Bot] Iniciando varredura autônoma às ${new Date().toLocaleTimeString('pt-BR')}...`);

    const keywords = customKeywords && customKeywords.length > 0 ? customKeywords : this.TRENDING_KEYWORDS;
    const mlProvider = new MercadoLivreProvider();

    let scannedCount = 0;
    let qualifiedCount = 0;
    let publishedCount = 0;
    const publishedOffers: Offer[] = [];

    // Buscar ofertas existentes no banco para evitar duplicatas por título ou URL
    const existingOffers = await OfferService.getPublishedOffers();
    const existingUrls = new Set(existingOffers.map((o) => o.destination_url.toLowerCase()));
    const existingTitles = new Set(existingOffers.map((o) => o.title.toLowerCase()));

    for (const keyword of keywords) {
      logs.push(`[Bot] Buscando oportunidade para termo: "${keyword}"...`);

      try {
        const items = await mlProvider.searchProducts(keyword, { limit: 5 });
        scannedCount += items.length;

        for (const item of items) {
          // Requisito 1: Deve ter preço e link válido
          if (!item.current_price || item.current_price <= 0 || !item.product_url) {
            continue;
          }

          // Requisito 2: Verificar se a URL já está no site
          if (existingUrls.has(item.product_url.toLowerCase()) || existingTitles.has(item.title.toLowerCase())) {
            logs.push(`[Bot] Ignorado (Já existente): "${item.title.substring(0, 35)}..."`);
            continue;
          }

          // Requisito 3: Desconto ou preço vantajoso
          const hasDiscount = Boolean(item.previous_price && item.previous_price > item.current_price);
          qualifiedCount++;

          logs.push(`[Bot] Processando produto com IA: "${item.title.substring(0, 40)}..." (Preço: R$ ${item.current_price})`);

          // Extrair metadados e gerar copy persuasivo via NVIDIA NIM AI + Categoria Automática
          const extracted = await MetadataExtractorService.extractFromUrl(item.product_url);

          if (extracted.success && extracted.data) {
            const data = extracted.data;

            // Criar oferta no banco de dados com status 'published'
            const created = await OfferService.createOffer({
              title: data.title || item.title,
              description: data.description || item.description || '',
              current_price: data.currentPrice || item.current_price,
              previous_price: data.previousPrice || item.previous_price,
              image_url: data.imageUrl || item.image_url,
              destination_url: data.destinationUrl || item.product_url,
              affiliate_url: data.affiliateUrl || item.affiliate_url || item.product_url,
              merchant_id: 'm2222222-2222-2222-2222-222222222222', // Mercado Livre
              category_id: data.categoryId || 'cat-01-alimentos-e-bebidas',
              coupon_code: item.coupon || null,
              free_shipping: item.free_shipping || false,
              featured: hasDiscount,
              status: 'published',
            });

            if (created.success && created.data) {
              publishedCount++;
              publishedOffers.push(created.data);
              existingUrls.add(data.destinationUrl.toLowerCase());
              logs.push(`[Bot] ✅ PUBLICADO COM SUCESSO: "${created.data.title}" [Categoria: ${data.categoryName}]`);
            }
          }
        }
      } catch (err: any) {
        logs.push(`[Bot] Erro ao varrer palavra-chave "${keyword}": ${err.message || String(err)}`);
      }
    }

    logs.push(`[Bot] Varredura concluída! ${publishedCount} novas ofertas reais publicadas automaticamente.`);

    return {
      timestamp: new Date().toISOString(),
      scannedCount,
      qualifiedCount,
      publishedCount,
      publishedOffers,
      logs,
    };
  },
};
