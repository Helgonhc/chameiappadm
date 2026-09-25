import { AmazonProvider } from '../connectors/amazon/amazon-provider';
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
   * Termos em alta para rastreamento automático nas maiores lojas do Brasil (Amazon + Mercado Livre)
   */
  TRENDING_KEYWORDS: [
    'air fryer',
    'smartphone',
    'notebook gamer',
    'smart tv 4k',
    'fone bluetooth',
    'parafusadeira',
    'ps5',
    'cadeira gamer',
    'smartwatch',
    'aspirador de po',
    'whey protein',
    'perfume importado',
    'fralda',
    'monitor gamer',
    'alexa echo',
  ],

  /**
   * Executa varredura autônoma de ofertas na plataforma selecionada (Amazon, Mercado Livre ou Ambas)
   */
  async runAutoScan(
    customKeywords?: string[],
    targetPlatform: 'all' | 'mercado-livre' | 'amazon' = 'all'
  ): Promise<AutoScanResult> {
    const logs: string[] = [];
    const platformLabel =
      targetPlatform === 'mercado-livre'
        ? 'Mercado Livre (API Oficial)'
        : targetPlatform === 'amazon'
        ? 'Amazon Brasil'
        : 'Ambas (Mercado Livre + Amazon)';

    logs.push(`[Bot Autônomo] Iniciando varredura em: ${platformLabel} às ${new Date().toLocaleTimeString('pt-BR')}...`);

    const keywords = customKeywords && customKeywords.length > 0 ? customKeywords : this.TRENDING_KEYWORDS;
    const amazonProvider = new AmazonProvider();
    const mlProvider = new MercadoLivreProvider();

    let scannedCount = 0;
    let qualifiedCount = 0;
    let publishedCount = 0;
    const publishedOffers: Offer[] = [];

    // Buscar ofertas existentes no banco para evitar duplicatas por título ou URL
    const existingOffers = await OfferService.getPublishedOffers();
    const existingUrls = new Set(existingOffers.map((o) => o.destination_url.toLowerCase()));
    const existingTitles = new Set(existingOffers.map((o) => o.title.toLowerCase()));

    const shouldScanML = targetPlatform === 'all' || targetPlatform === 'mercado-livre';
    const shouldScanAmazon = targetPlatform === 'all' || targetPlatform === 'amazon';

    for (const keyword of keywords) {
      logs.push(`[Bot] Buscando oportunidades para o termo: "${keyword}"...`);

      // A. Varredura no Mercado Livre (API Oficial ao Vivo)
      if (shouldScanML) {
        try {
          const mlItems = await mlProvider.searchProducts(keyword, { limit: 6 });
          scannedCount += mlItems.length;

          if (mlItems.length === 0) {
            logs.push(`[Bot ML] Nenhuma oferta retornada pela API do ML para "${keyword}".`);
          } else {
            logs.push(`[Bot ML] API do Mercado Livre retornou ${mlItems.length} produtos para "${keyword}".`);
          }

          for (const item of mlItems) {
            if (!item.current_price || item.current_price <= 0 || !item.product_url) {
              logs.push(`[Bot ML] ⚠️ Produto "${item.title?.substring(0, 30)}" ignorado (preço zerado ou inválido).`);
              continue;
            }

            if (existingUrls.has(item.product_url.toLowerCase()) || existingTitles.has(item.title.toLowerCase())) {
              logs.push(`[Bot ML] ℹ️ Produto "${item.title.substring(0, 35)}..." já está publicado no site (duplicata evitada).`);
              continue;
            }

            const hasDiscount = Boolean(item.previous_price && item.previous_price > item.current_price);
            qualifiedCount++;

            logs.push(`[Bot Mercado Livre] ⚡ Extraindo metadados e gerando copy com IA para: "${item.title.substring(0, 35)}..." (R$ ${item.current_price.toFixed(2)})`);

            const extracted = await MetadataExtractorService.extractFromUrl(item.product_url);

            if (extracted.success && extracted.data) {
              const data = extracted.data;
              const created = await OfferService.createOffer({
                title: data.title || item.title,
                description: data.description || item.description || '',
                current_price: data.currentPrice || item.current_price,
                previous_price: data.previousPrice || item.previous_price,
                image_url: data.imageUrl || item.image_url,
                images: data.images || item.images,
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
                existingTitles.add(data.title.toLowerCase());
                logs.push(`[Bot ML] ✅ PUBLICADO COM SUCESSO: "${created.data.title}" [Categoria: ${data.categoryName}]`);
              } else {
                logs.push(`[Bot ML] ❌ Falha ao salvar oferta no banco de dados: ${created.error || 'Erro desconhecido'}`);
              }
            } else {
              logs.push(`[Bot ML] ⚠️ Falha na extração de dados para a oferta de "${item.title.substring(0, 30)}".`);
            }
          }
        } catch (err: any) {
          logs.push(`[Bot ML] ❌ Erro ao varrer ML para "${keyword}": ${err.message || String(err)}`);
        }
      }

      // B. Varredura na Amazon Brasil
      if (shouldScanAmazon) {
        try {
          const amazonItems = await amazonProvider.searchProducts(keyword, { limit: 4 });
          scannedCount += amazonItems.length;

          if (amazonItems.length === 0) {
            logs.push(`[Bot Amazon] Nenhuma oferta retornada pela API da Amazon para "${keyword}".`);
          } else {
            logs.push(`[Bot Amazon] API da Amazon retornou ${amazonItems.length} produtos para "${keyword}".`);
          }

          for (const item of amazonItems) {
            if (!item.current_price || item.current_price <= 0 || !item.product_url) {
              logs.push(`[Bot Amazon] ⚠️ Produto "${item.title?.substring(0, 30)}" ignorado (preço zerado ou inválido).`);
              continue;
            }

            if (existingUrls.has(item.product_url.toLowerCase()) || existingTitles.has(item.title.toLowerCase())) {
              logs.push(`[Bot Amazon] ℹ️ Produto "${item.title.substring(0, 35)}..." já está publicado no site (duplicata evitada).`);
              continue;
            }

            const hasDiscount = Boolean(item.previous_price && item.previous_price > item.current_price);
            qualifiedCount++;

            logs.push(`[Bot Amazon] ⚡ Extraindo metadados e gerando copy com IA para: "${item.title.substring(0, 35)}..." (R$ ${item.current_price.toFixed(2)})`);

            const extracted = await MetadataExtractorService.extractFromUrl(item.product_url);

            if (extracted.success && extracted.data) {
              const data = extracted.data;
              const created = await OfferService.createOffer({
                title: data.title || item.title,
                description: data.description || item.description || '',
                current_price: data.currentPrice || item.current_price,
                previous_price: data.previousPrice || item.previous_price,
                image_url: data.imageUrl || item.image_url,
                images: data.images || item.images,
                destination_url: data.destinationUrl || item.product_url,
                affiliate_url: data.affiliateUrl || item.affiliate_url || item.product_url,
                merchant_id: 'm1111111-1111-1111-1111-111111111111', // Amazon Brasil
                category_id: data.categoryId || 'cat-12-dispositivos-amazon',
                coupon_code: item.coupon || null,
                free_shipping: item.free_shipping || true,
                featured: hasDiscount,
                status: 'published',
              });

              if (created.success && created.data) {
                publishedCount++;
                publishedOffers.push(created.data);
                existingUrls.add(data.destinationUrl.toLowerCase());
                existingTitles.add(data.title.toLowerCase());
                logs.push(`[Bot Amazon] ✅ PUBLICADO COM SUCESSO: "${created.data.title}" [Categoria: ${data.categoryName}]`);
              } else {
                logs.push(`[Bot Amazon] ❌ Falha ao salvar oferta no banco de dados: ${created.error || 'Erro desconhecido'}`);
              }
            } else {
              logs.push(`[Bot Amazon] ⚠️ Falha na extração de dados para a oferta de "${item.title.substring(0, 30)}".`);
            }
          }
        } catch (err: any) {
          logs.push(`[Bot Amazon] ❌ Erro ao varrer Amazon para "${keyword}": ${err.message || String(err)}`);
        }
      }
    }

    logs.push(`[Bot] Varredura concluída (${platformLabel})! Total de ${publishedCount} ofertas publicadas automaticamente.`);

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
