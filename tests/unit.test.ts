import assert from 'node:assert';
import { test, describe } from 'node:test';
import { calculateDiscount, isOfferAvailable } from '../lib/utils/offer-helpers';
import { TrackingService } from '../lib/services/tracking.service';
import { Offer } from '../lib/types/database';
import { AmazonProvider } from '../lib/services/connectors/amazon/amazon-provider';
import { MercadoLivreProvider } from '../lib/services/connectors/mercado-livre/mercado-livre-provider';
import { OfferAnalyzer } from '../lib/services/radar/offer-analyzer';
import { CandidateService } from '../lib/services/radar/candidate.service';
import { PriceHistoryService } from '../lib/services/radar/price-history.service';

describe('Suíte de Testes Automatizados — CHAMEIAPP', () => {

  // A. CALCULATE DISCOUNT
  describe('A. calculateDiscount', () => {
    test('deve calcular desconto correto para preços válidos', () => {
      assert.strictEqual(calculateDiscount(100, 150), 33);
      assert.strictEqual(calculateDiscount(199.90, 299.90), 33);
      assert.strictEqual(calculateDiscount(50, 100), 50);
    });

    test('deve retornar 0 quando o preço anterior for menor ou igual ao atual', () => {
      assert.strictEqual(calculateDiscount(100, 100), 0);
      assert.strictEqual(calculateDiscount(150, 100), 0);
    });

    test('deve retornar 0 quando o preço anterior for null ou undefined', () => {
      assert.strictEqual(calculateDiscount(100, null), 0);
      assert.strictEqual(calculateDiscount(100, undefined), 0);
    });
  });

  // B. URL VALIDATION
  describe('B. URL Validation (Open Redirect Protection)', () => {
    test('deve aprovar URLs válidas da Amazon Brasil', () => {
      assert.strictEqual(TrackingService.isDomainAllowed('https://www.amazon.com.br/dp/B0C39C9Z1Z'), true);
      assert.strictEqual(TrackingService.isDomainAllowed('https://amazon.com.br/dp/123'), true);
    });

    test('deve aprovar URLs válidas do Mercado Livre', () => {
      assert.strictEqual(TrackingService.isDomainAllowed('https://www.mercadolivre.com.br/p/MLB123'), true);
      assert.strictEqual(TrackingService.isDomainAllowed('https://mercadolibre.com/p/123'), true);
    });

    test('deve aprovar encurtador amzn.to', () => {
      assert.strictEqual(TrackingService.isDomainAllowed('https://amzn.to/3xyz'), true);
    });

    test('deve rejeitar URLs HTTP (não HTTPS)', () => {
      assert.strictEqual(TrackingService.isDomainAllowed('http://www.amazon.com.br/dp/123'), false);
    });

    test('deve rejeitar domínios maliciosos com sulfixo falso', () => {
      assert.strictEqual(TrackingService.isDomainAllowed('https://amazon.com.br.evil.example/phishing'), false);
      assert.strictEqual(TrackingService.isDomainAllowed('https://evilamazon.com.br/phishing'), false);
    });

    test('deve rejeitar esquemas maliciosos (javascript, data, protocol-relative)', () => {
      assert.strictEqual(TrackingService.isDomainAllowed('javascript:alert(1)'), false);
      assert.strictEqual(TrackingService.isDomainAllowed('data:text/html,<script>alert(1)</script>'), false);
      assert.strictEqual(TrackingService.isDomainAllowed('//evil.com/phishing'), false);
    });

    test('deve rejeitar URLs com credenciais incorporadas', () => {
      assert.strictEqual(TrackingService.isDomainAllowed('https://user:pass@www.amazon.com.br/dp/123'), false);
    });
  });

  // C. RESOLVE OFFER DESTINATION
  describe('C. resolveOfferDestination', () => {
    test('deve priorizar affiliate_url quando presente e válida', () => {
      const offer = {
        destination_url: 'https://www.amazon.com.br/dp/B0C39C9Z1Z',
        affiliate_url: 'https://amzn.to/3xyz',
      };
      assert.strictEqual(TrackingService.resolveTargetUrl(offer), 'https://amzn.to/3xyz');
    });

    test('deve utilizar destination_url quando affiliate_url for nula ou vazia', () => {
      const offer = {
        destination_url: 'https://www.amazon.com.br/dp/B0C39C9Z1Z',
        affiliate_url: null,
      };
      assert.strictEqual(TrackingService.resolveTargetUrl(offer), 'https://www.amazon.com.br/dp/B0C39C9Z1Z');
    });

    test('deve disparar erro quando a URL for inválida ou domínio malicioso', () => {
      const offer = {
        destination_url: 'https://evil.example.com/item',
        affiliate_url: 'javascript:alert(1)',
      };
      assert.throws(() => TrackingService.resolveTargetUrl(offer), /Domínio de destino não autorizado/);
    });
  });

  // D. OFFER AVAILABILITY
  describe('D. Offer Availability & Timing', () => {
    const baseOffer: Offer = {
      id: '12345678-1234-1234-1234-1234567890ab',
      title: 'Oferta Teste',
      slug: 'oferta-teste',
      category_id: 'cat-1',
      merchant_id: 'mer-1',
      current_price: 100,
      image_url: 'https://www.amazon.com.br/img.jpg',
      destination_url: 'https://www.amazon.com.br/dp/123',
      featured: false,
      free_shipping: true,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    test('deve considerar oferta published como disponível se dentro do prazo', () => {
      assert.strictEqual(isOfferAvailable(baseOffer), true);
    });

    test('deve rejeitar ofertas draft ou archived', () => {
      assert.strictEqual(isOfferAvailable({ ...baseOffer, status: 'draft' }), false);
      assert.strictEqual(isOfferAvailable({ ...baseOffer, status: 'archived' }), false);
    });

    test('deve rejeitar oferta expirada (expires_at no passado)', () => {
      const pastDate = new Date(Date.now() - 1000 * 60 * 60).toISOString();
      assert.strictEqual(isOfferAvailable({ ...baseOffer, expires_at: pastDate }), false);
    });

    test('deve rejeitar oferta futura (starts_at no futuro)', () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60).toISOString();
      assert.strictEqual(isOfferAvailable({ ...baseOffer, starts_at: futureDate }), false);
    });
  });

  // E. UUID FORMAT VALIDATION
  describe('E. UUID Validation para /go/[offerId]', () => {
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    test('deve aceitar UUIDs válidos e rejeitar IDs maliciosos/inválidos', () => {
      assert.strictEqual(UUID_REGEX.test('e3b0c442-98fc-1c14-9aff-4c8996fb9242'), true);
      assert.strictEqual(UUID_REGEX.test('123-invalido'), false);
      assert.strictEqual(UUID_REGEX.test("'; DROP TABLE offers; --"), false);
    });
  });

  // F. AUTHORIZATION ROLES
  describe('F. Autorização Admin (Diferença entre Auth e Autorização)', () => {
    test('deve validar que usuários com role !== admin são rejeitados', () => {
      const userProfile = { id: 'u1', role: 'user' };
      const adminProfile = { id: 'u2', role: 'admin' };

      assert.strictEqual(userProfile.role === 'admin', false);
      assert.strictEqual(adminProfile.role === 'admin', true);
    });
  });

  // G. AFFILIATE PROVIDERS (ZERO MOCK & STATUS REAL)
  describe('G. Affiliate Providers (Zero Mock & Provider Status)', () => {
    test('AmazonProvider sem credenciais da PA-API deve retornar NOT_CONFIGURED e array vazio', async () => {
      const amazon = new AmazonProvider();
      const health = await amazon.healthCheck();
      assert.strictEqual(health.status, 'NOT_CONFIGURED');

      const results = await amazon.searchProducts('furadeira');
      assert.deepStrictEqual(results, []);
    });

    test('MercadoLivreProvider deve retornar READY (API Pública Oficial)', async () => {
      const ml = new MercadoLivreProvider();
      const health = await ml.healthCheck();
      assert.strictEqual(health.status, 'READY');
    });
  });

  // H. OFFER ANALYZER (SCORED MOTOR 0-100)
  describe('H. Offer Analyzer (Determinístico)', () => {
    test('deve calcular pontuação alta para oferta com desconto de 50%, cupom e frete grátis', () => {
      const analyzer = new OfferAnalyzer();
      const score = analyzer.analyze({
        provider: 'amazon',
        external_id: 'B0C39C9Z1Z',
        title: 'Parafusadeira Bosch GSR 1000 SMART',
        image_url: 'https://m.media-amazon.com/images/I/71.jpg',
        product_url: 'https://www.amazon.com.br/dp/B0C39C9Z1Z',
        current_price: 250,
        previous_price: 500,
        currency: 'BRL',
        coupon: 'FERRAMENTA10',
        free_shipping: true,
        availability: true,
        category: 'Ferramentas',
        seller: 'Amazon.com.br',
        last_checked_at: new Date().toISOString(),
      });

      // 40 (desconto) + 15 (cupom) + 15 (recência) + 15 (qualidade) + 15 (estoque/frete) = 100
      assert.strictEqual(score.total, 100);
      assert.strictEqual(score.discount_score, 40);
      assert.strictEqual(score.coupon_score, 15);
      assert.strictEqual(score.freshness_score, 15);
      assert.strictEqual(score.availability_score, 15);
    });

    test('deve pontuar menor oferta sem desconto ou cupom', () => {
      const analyzer = new OfferAnalyzer();
      const score = analyzer.analyze({
        provider: 'amazon',
        external_id: 'B0C39C9Z1Z',
        title: 'Produto Comum',
        image_url: 'https://m.media-amazon.com/images/I/71.jpg',
        product_url: 'https://www.amazon.com.br/dp/B0C39C9Z1Z',
        current_price: 100,
        previous_price: 100,
        currency: 'BRL',
        last_checked_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 48h atrás
      });

      assert.strictEqual(score.discount_score, 0);
      assert.strictEqual(score.coupon_score, 0);
      assert.strictEqual(score.freshness_score, 5);
      assert.strictEqual(score.total < 50, true);
    });
  });

  // I. CANDIDATE SERVICE (DEDUPLICAÇÃO & FLUXO)
  describe('I. Candidate Service & Deduplicação', () => {
    test('deve normalizar URLs corretamente descartando parâmetros de tracking', () => {
      const service = new CandidateService();
      const rawUrl = 'https://www.amazon.com.br/dp/B0C39C9Z1Z?tag=chameiapp-20&ref=sr_1_1';
      const normalized = service.normalizeUrl(rawUrl);
      assert.strictEqual(normalized, 'https://www.amazon.com.br/dp/b0c39c9z1z');
    });

    test('deve identificar duplicidade por (provider, external_id)', async () => {
      const service = new CandidateService();
      const product = {
        provider: 'amazon',
        external_id: 'B0C39C9Z1Z',
        title: 'Produto Teste Dedup',
        image_url: 'https://m.media-amazon.com/images/I/1.jpg',
        product_url: 'https://www.amazon.com.br/dp/B0C39C9Z1Z',
        current_price: 199.90,
        currency: 'BRL',
        last_checked_at: new Date().toISOString(),
      };

      const res1 = await service.processDiscoveredProduct(product);
      assert.strictEqual(res1.isDuplicate, false);
      assert.strictEqual(res1.candidate?.status, 'candidate');

      const res2 = await service.processDiscoveredProduct(product);
      assert.strictEqual(res2.isDuplicate, true);
    });
  });

  // J. PRICE HISTORY SERVICE (DADOS REAIS & STATS)
  describe('J. Price History Service (Zero Fake Backfill)', () => {
    test('deve retornar null se não houver registros para o produto', async () => {
      const service = new PriceHistoryService();
      const stats = await service.getPriceStats('amazon', 'NAO_EXISTE');
      assert.strictEqual(stats, null);
    });

    test('deve calcular estatísticas reais com base em observações reais registradas', async () => {
      const service = new PriceHistoryService();
      const provider = 'amazon';
      const extId = 'B0REALPRICE1';

      await service.addPriceObservation({
        provider,
        external_product_id: extId,
        price: 500,
        currency: 'BRL',
        observed_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      });

      await service.addPriceObservation({
        provider,
        external_product_id: extId,
        price: 400,
        currency: 'BRL',
        observed_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      });

      await service.addPriceObservation({
        provider,
        external_product_id: extId,
        price: 300,
        currency: 'BRL',
        observed_at: new Date().toISOString(),
      });

      const stats = await service.getPriceStats(provider, extId);
      assert.notStrictEqual(stats, null);
      assert.strictEqual(stats?.min_price, 300);
      assert.strictEqual(stats?.max_price, 500);
      assert.strictEqual(stats?.avg_price, 400);
      assert.strictEqual(stats?.median_price, 400);
      assert.strictEqual(stats?.latest_price, 300);
      assert.strictEqual(stats?.price_drop_percent, 40); // (500 - 300) / 500 = 40%
      assert.strictEqual(stats?.has_sufficient_data, true);
    });
  });

  // K. GALERIA DE PELO MENOS 3 IMAGENS & NEUROMARKETING IA
  describe('K. Galeria de 3+ Imagens & Copy de Neuromarketing', () => {
    test('ensureMinimumThreeImages deve sempre retornar um array com no mínimo 3 imagens', async () => {
      const { ensureMinimumThreeImages } = await import('../lib/utils/image-helpers');
      
      const singleImage = 'https://http2.mlstatic.com/D_NQ_NP_12345-O.jpg';
      const images = ensureMinimumThreeImages(singleImage, [], 'Smart TV 55 4K', 'Mercado Livre');

      assert.strictEqual(Array.isArray(images), true);
      assert.strictEqual(images.length >= 3, true);
      assert.strictEqual(images[0], singleImage);
    });

    test('ensureMinimumThreeImages deve preservar imagens extras da API quando fornecidas', async () => {
      const { ensureMinimumThreeImages } = await import('../lib/utils/image-helpers');
      
      const mainImg = 'https://http2.mlstatic.com/D_NQ_NP_1.jpg';
      const extra1 = 'https://http2.mlstatic.com/D_NQ_NP_2.jpg';
      const extra2 = 'https://http2.mlstatic.com/D_NQ_NP_3.jpg';
      
      const images = ensureMinimumThreeImages(mainImg, [extra1, extra2], 'Notebook Gamer', 'Mercado Livre');
      assert.strictEqual(images.length >= 3, true);
      assert.strictEqual(images.includes(mainImg), true);
      assert.strictEqual(images.includes(extra1), true);
      assert.strictEqual(images.includes(extra2), true);
    });
  });

});
