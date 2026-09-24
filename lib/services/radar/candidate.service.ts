import { getSupabaseAdmin } from '../../db/supabase-admin';
import { CandidateOffer, CandidateStatus, ExternalProduct } from '../../types/radar';
import { OfferAnalyzer } from './offer-analyzer';

export class CandidateService {
  private analyzer: OfferAnalyzer;
  private memoryStore: Map<string, CandidateOffer> = new Map();

  constructor() {
    this.analyzer = new OfferAnalyzer();
  }

  /**
   * Normaliza URLs para evitar duplicações por parâmetros irrelevantes de tracking.
   */
  public normalizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      // Mantém apenas o hostname e pathname limpo
      return `${parsed.protocol}//${parsed.hostname}${parsed.pathname}`.toLowerCase();
    } catch {
      return url.toLowerCase().trim();
    }
  }

  /**
   * Gera a chave de deduplicação composta.
   */
  public getDeduplicationKey(provider: string, externalId: string): string {
    return `${provider.toLowerCase().trim()}:${externalId.toLowerCase().trim()}`;
  }

  /**
   * Processa um produto externo recém-descoberto, calcula o score e o adiciona como candidata se não for duplicado.
   */
  public async processDiscoveredProduct(product: ExternalProduct): Promise<{
    candidate: CandidateOffer | null;
    isDuplicate: boolean;
  }> {
    const dedupKey = this.getDeduplicationKey(product.provider, product.external_id);

    // 1. Verifica se já existe em memória
    if (this.memoryStore.has(dedupKey)) {
      return { candidate: this.memoryStore.get(dedupKey) ?? null, isDuplicate: true };
    }

    // 2. Verifica se existe no Supabase (se configurado)
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data } = await supabase
        .from('candidates')
        .select('*')
        .eq('provider', product.provider)
        .eq('external_id', product.external_id)
        .maybeSingle();

      if (data) {
        return { candidate: data as CandidateOffer, isDuplicate: true };
      }
    }

    // 3. Calcula score
    const scoreBreakdown = this.analyzer.analyze(product);

    const candidate: CandidateOffer = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cand_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      provider: product.provider,
      external_id: product.external_id,
      title: product.title,
      description: product.description || null,
      image_url: product.image_url,
      product_url: product.product_url,
      affiliate_url: product.affiliate_url || null,
      current_price: product.current_price,
      previous_price: product.previous_price || null,
      currency: product.currency || 'BRL',
      coupon: product.coupon || null,
      shipping: product.shipping || null,
      free_shipping: Boolean(product.free_shipping),
      availability: product.availability !== false,
      category_slug: product.category || null,
      merchant_slug: product.seller || product.provider,
      raw_metadata: product.raw_metadata || null,
      score: scoreBreakdown.total,
      score_breakdown: scoreBreakdown,
      status: 'candidate',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Armazena na memória (fallback para dev/testes)
    this.memoryStore.set(dedupKey, candidate);

    // Armazena no Supabase se disponível
    if (supabase) {
      await supabase.from('candidates').insert({
        id: candidate.id,
        provider: candidate.provider,
        external_id: candidate.external_id,
        title: candidate.title,
        description: candidate.description,
        image_url: candidate.image_url,
        product_url: candidate.product_url,
        affiliate_url: candidate.affiliate_url,
        current_price: candidate.current_price,
        previous_price: candidate.previous_price,
        currency: candidate.currency,
        coupon: candidate.coupon,
        shipping: candidate.shipping,
        free_shipping: candidate.free_shipping,
        availability: candidate.availability,
        category_slug: candidate.category_slug,
        merchant_slug: candidate.merchant_slug,
        score: candidate.score,
        score_breakdown: candidate.score_breakdown,
        status: candidate.status,
        created_at: candidate.created_at,
        updated_at: candidate.updated_at,
      });
    }

    return { candidate, isDuplicate: false };
  }

  /**
   * Transiciona o status de uma candidata.
   */
  public async updateStatus(
    candidateId: string,
    newStatus: CandidateStatus
  ): Promise<CandidateOffer | null> {
    for (const [key, item] of this.memoryStore.entries()) {
      if (item.id === candidateId) {
        item.status = newStatus;
        item.updated_at = new Date().toISOString();
        this.memoryStore.set(key, item);

        const supabase = getSupabaseAdmin();
        if (supabase) {
          await supabase
            .from('candidates')
            .update({ status: newStatus, updated_at: item.updated_at })
            .eq('id', candidateId);
        }

        return item;
      }
    }
    return null;
  }
}
