import { AmazonProvider } from '../connectors/amazon/amazon-provider';
import { MercadoLivreProvider } from '../connectors/mercado-livre/mercado-livre-provider';
import { MetadataExtractorService } from '../extractor/metadata-extractor.service';
import { OfferService } from '../offer.service';
import { Offer } from '../../types/database';
import { formatCurrencyBRL } from '../../utils/offer-helpers';
import { SEED_CATEGORIES } from '../seed-data';

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
    'camera de seguranca',
    'multimidia automotiva',
    'power bank',
  ],

  /**
   * Termos de busca mapeados especificamente para garantir 10+ produtos em cada uma das 24 categorias
   */
  CATEGORY_KEYWORDS_MAP: {
    'alimentos-e-bebidas': ['cerveja artesanal', 'vinho tinto', 'whisky 12 anos', 'cafe nespresso', 'chocolate lindt', 'azeite extra virgem'],
    'automotivo': ['som automotivo', 'pneu 175 70 14', 'oleo de motor 5w30', 'capacete pro tork', 'multimidia 2 din mp5', 'lâmpada led automotiva'],
    'beleza': ['perfume importado', 'maquiagem ruby rose', 'shampoo loreal', 'protetor solar isdin', 'prancha taiff', 'creme cerave'],
    'brinquedos-e-jogos': ['lego star wars', 'barbie', 'nerf elite', 'quebra cabeca 1000 pecas', 'jogo de tabuleiro catan', 'carrinho hot wheels'],
    'casa': ['jogo de cama casal', 'travesseiro nasa', 'toalha de banho karsten', 'sofa retratil', 'cadeira de escritorio ergonomica', 'jogo de panelas tramontina'],
    'casa-inteligente': ['lampada inteligente positivo', 'tomada smart sonoff', 'fechadura digital intelbras', 'camera de seguranca icsee', 'sensor de presenca zigbee'],
    'cd-e-vinil': ['disco de vinil rock', 'vinil taylor swift', 'lp os paralamas', 'vinil mpb', 'cd iron maiden', 'toca discos vinil'],
    'celulares-e-acessorios': ['iphone 15 pro max', 'galaxy s24 ultra', 'xiaomi redmi note 13', 'power bank 20000mah', 'carregador anker turbo', 'fone bluetooth qcy'],
    'computadores-e-acessorios': ['notebook dell i5', 'macbook air m2', 'ssd nvme 1tb', 'memoria ram 16gb ddr4', 'mouse logitech mx master', 'teclado mecanico rgb'],
    'cozinha': ['air fryer mondial 4l', 'cafeteira oster primalatte', 'batedeira planetaria arno', 'liquidificador philips walita', 'panela de pressao eletrica', 'microondas brastemp 30l'],
    'cuidados-pessoais-e-limpeza': ['sabao em po omo 5kg', 'amaciante downy 3l', 'desinfetante lysoform', 'papel higienico neve 30 rolos', 'detergente ype', 'sabonete dove pack'],
    'dispositivos-amazon': ['echo dot 5 geracao', 'echo show 8', 'fire tv stick 4k', 'kindle paperwhite 16gb', 'echo pop', 'fire tv stick lite'],
    'dvd-e-blu-ray': ['blu-ray 4k o chefao', 'dvd harry potter colecao', 'blu-ray oppenheimer', 'dvd senhor dos aneis estendido', 'blu-ray marvel avengers'],
    'eletronicos-e-tvs': ['smart tv 55 4k lg oled', 'soundbar jbl cinema', 'fone bluetooth jbl tune', 'caixa de som jbl flip 6', 'home theater pioneer', 'projetor 4k hy300'],
    'esportes-e-aventura': ['bicicleta aro 29 ogi', 'whey protein max titanium 1kg', 'creatina creapure 300g', 'haltere sextavado 5kg', 'patins traxart', 'bola de futebol adidas'],
    'ferramentas-e-construcao': ['parafusadeira furadeira bosch 18v', 'jogo de chaves kombat 110 pecas', 'alicate universal edg', 'serra tico tico makita', 'esmerilhadeira deWalt', 'trena a laser 40m'],
    'instrumentos-musicais': ['violao de nylon giannini', 'guitarra fender stratocaster', 'teclado musical yamaha psr', 'microfone condensador bm800', 'ukulele de concerto tagima'],
    'itens-para-bebe': ['fralda pampers confort sec xg', 'carrinho de bebe galzerano', 'mamadeira avent 260ml', 'chupeta mam 0-6m', 'cadeira para auto 0 a 36kg'],
    'jardim-e-piscina': ['lavadora de alta pressao karcher K3', 'mangueira de jardim 30m silicone', 'piscina estrutural mor 3000l', 'cortador de grama tramontina', 'vaso autoirrigavel'],
    'livros-e-ebooks': ['livro a psicologia do dinheiro', 'box e-books senhor dos aneis', 'manga attack on titan', 'hq batman a piada mortal', 'livro essenciatismo'],
    'moda': ['tenis nike revolution', 'camiseta polo lacoste', 'calca jeans levis 501', 'jaqueta corta vento', 'vestido farm estampado', 'bolsa luz da lua couro'],
    'papelaria-e-escritorio': ['impressora epson ecotank l3250', 'caderno inteligente grande', 'caneta faber castell fine pen 12 cores', 'resma de papel sulfite a4 500 fls', 'calculadora cientifica casio'],
    'pet-shop': ['racao premier caes castrados 15kg', 'racao royal canin gatos 10kg', 'areia sanitaria pipicat 12kg', 'coleira antipulgas seresto', 'petisco dreamies para gatos'],
    'itens-gamer': ['console playstation 5 slim 1tb', 'xbox series x 1tb', 'nintendo switch oled', 'cadeira gamer flexform', 'controle ps5 dualsense', 'placa de video rtx 4060 8gb'],
  } as Record<string, string[]>,

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

            const formattedPriceStr = formatCurrencyBRL(item.current_price);
            logs.push(`[Bot Mercado Livre] ⚡ Extraindo metadados e gerando copy com IA para: "${item.title.substring(0, 35)}..." (${formattedPriceStr})`);

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
                category_id: data.categoryId || 'cat-14-eletronicos-e-tvs',
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
                logs.push(`[Bot ML] ✅ PUBLICADO COM SUCESSO: "${created.data.title}" [Categoria: ${data.categoryName || 'Geral'}] por ${formatCurrencyBRL(created.data.current_price)}`);
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

            const formattedPriceStr = formatCurrencyBRL(item.current_price);
            logs.push(`[Bot Amazon] ⚡ Extraindo metadados e gerando copy com IA para: "${item.title.substring(0, 35)}..." (${formattedPriceStr})`);

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
                logs.push(`[Bot Amazon] ✅ PUBLICADO COM SUCESSO: "${created.data.title}" [Categoria: ${data.categoryName || 'Geral'}] por ${formatCurrencyBRL(created.data.current_price)}`);
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

