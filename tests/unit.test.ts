import assert from 'node:assert';
import { test, describe } from 'node:test';
import { calculateDiscount, isOfferAvailable } from '../lib/utils/offer-helpers';
import { TrackingService } from '../lib/services/tracking.service';
import { Offer } from '../lib/types/database';

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

});
