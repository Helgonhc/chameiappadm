import { getSupabaseAdmin } from '../../db/supabase-admin';
import { PriceHistoryRecord } from '../../types/radar';

export interface PriceStats {
  min_price: number;
  max_price: number;
  avg_price: number;
  median_price: number;
  observations_count: number;
  latest_price: number;
  price_drop_percent: number;
  has_sufficient_data: boolean;
}

export class PriceHistoryService {
  private memoryStore: PriceHistoryRecord[] = [];

  /**
   * Adiciona uma observação de preço REAL.
   * NUNCA gera backfill ou preços históricos fictícios.
   */
  public async addPriceObservation(record: Omit<PriceHistoryRecord, 'id'>): Promise<PriceHistoryRecord> {
    const fullRecord: PriceHistoryRecord = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ph_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      provider: record.provider,
      external_product_id: record.external_product_id,
      offer_id: record.offer_id || null,
      price: record.price,
      currency: record.currency || 'BRL',
      observed_at: record.observed_at || new Date().toISOString(),
    };

    this.memoryStore.push(fullRecord);

    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase.from('price_history').insert({
        id: fullRecord.id,
        provider: fullRecord.provider,
        external_product_id: fullRecord.external_product_id,
        offer_id: fullRecord.offer_id,
        price: fullRecord.price,
        currency: fullRecord.currency,
        observed_at: fullRecord.observed_at,
      });
    }

    return fullRecord;
  }

  /**
   * Obtém estatísticas reais de preço para um determinado produto.
   * Exige ao menos 1 observação real. Retorna `has_sufficient_data: false` se houver < 3 observações.
   */
  public async getPriceStats(
    provider: string,
    externalProductId: string
  ): Promise<PriceStats | null> {
    let records = this.memoryStore.filter(
      (r) => r.provider === provider && r.external_product_id === externalProductId
    );

    const supabase = getSupabaseAdmin();
    if (supabase && records.length === 0) {
      const { data } = await supabase
        .from('price_history')
        .select('*')
        .eq('provider', provider)
        .eq('external_product_id', externalProductId)
        .order('observed_at', { ascending: true });

      if (data && data.length > 0) {
        records = data as PriceHistoryRecord[];
      }
    }

    if (records.length === 0) {
      return null;
    }

    const prices = records.map((r) => r.price).sort((a, b) => a - b);
    const min_price = prices[0];
    const max_price = prices[prices.length - 1];
    const sum = prices.reduce((acc, p) => acc + p, 0);
    const avg_price = Number((sum / prices.length).toFixed(2));

    const mid = Math.floor(prices.length / 2);
    const median_price =
      prices.length % 2 !== 0
        ? prices[mid]
        : Number(((prices[mid - 1] + prices[mid]) / 2).toFixed(2));

    const latest_price = records[records.length - 1].price;
    const price_drop_percent =
      max_price > 0 ? Number((((max_price - latest_price) / max_price) * 100).toFixed(1)) : 0;

    return {
      min_price,
      max_price,
      avg_price,
      median_price,
      observations_count: records.length,
      latest_price,
      price_drop_percent,
      has_sufficient_data: records.length >= 3,
    };
  }
}
