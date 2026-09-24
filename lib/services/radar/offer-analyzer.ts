import { ExternalProduct, OfferScore } from '../../types/radar';

export class OfferAnalyzer {
  /**
   * Analisa deterministicamente um produto externo e gera um score interno de 0 a 100.
   * Não realiza gastos com IA paga (AUTO_SPEND=false).
   */
  public analyze(product: ExternalProduct): OfferScore {
    const reasons: string[] = [];

    // 1. Discount Score (máx 40)
    let discount_score = 0;
    if (product.previous_price && product.previous_price > product.current_price) {
      const discountPercent =
        ((product.previous_price - product.current_price) / product.previous_price) * 100;

      if (discountPercent >= 50) {
        discount_score = 40;
        reasons.push(`Super desconto de ${discountPercent.toFixed(0)}% (Score máximo de desconto)`);
      } else if (discountPercent >= 30) {
        discount_score = 30;
        reasons.push(`Ótimo desconto de ${discountPercent.toFixed(0)}%`);
      } else if (discountPercent >= 15) {
        discount_score = 20;
        reasons.push(`Desconto razoável de ${discountPercent.toFixed(0)}%`);
      } else if (discountPercent > 0) {
        discount_score = 10;
        reasons.push(`Pequeno desconto de ${discountPercent.toFixed(0)}%`);
      }
    } else {
      reasons.push('Sem histórico de preço anterior imediato para desconto');
    }

    // 2. Coupon Score (máx 15)
    let coupon_score = 0;
    if (product.coupon && product.coupon.trim().length > 0) {
      coupon_score = 15;
      reasons.push(`Cupom de desconto presente: ${product.coupon}`);
    }

    // 3. Freshness Score (máx 15)
    let freshness_score = 15;
    const now = new Date().getTime();
    const checkedAt = new Date(product.last_checked_at).getTime();
    const diffHours = (now - checkedAt) / (1000 * 60 * 60);

    if (diffHours <= 1) {
      freshness_score = 15;
      reasons.push('Dados verificados há menos de 1 hora');
    } else if (diffHours <= 24) {
      freshness_score = 10;
      reasons.push('Dados verificados nas últimas 24 horas');
    } else {
      freshness_score = 5;
      reasons.push('Dados verificados há mais de 24 horas');
    }

    // 4. Data Quality Score (máx 15)
    let data_quality_score = 0;
    if (product.title && product.title.trim().length > 5) data_quality_score += 4;
    if (product.image_url && product.image_url.startsWith('http')) data_quality_score += 4;
    if (product.product_url && product.product_url.startsWith('http')) data_quality_score += 4;
    if (product.category && product.category.trim().length > 0) data_quality_score += 3;
    reasons.push(`Qualidade dos dados: ${data_quality_score}/15 pontos`);

    // 5. Availability & Shipping Score (máx 15)
    let availability_score = 0;
    if (product.availability !== false) {
      availability_score += 10;
      reasons.push('Produto disponível em estoque');
    } else {
      reasons.push('Produto indisponível no momento');
    }

    if (product.free_shipping) {
      availability_score += 5;
      reasons.push('Frete grátis informado');
    }

    const total = Math.min(
      100,
      discount_score + coupon_score + freshness_score + data_quality_score + availability_score
    );

    return {
      total,
      discount_score,
      coupon_score,
      freshness_score,
      data_quality_score,
      availability_score,
      reasons,
    };
  }
}
