export type ProviderStatus = 'NOT_CONFIGURED' | 'PENDING_ACCESS' | 'READY' | 'ERROR';

export interface ExternalProduct {
  provider: string; // ex: 'amazon', 'mercado-livre'
  external_id: string; // ex: ASIN ou ID do anúncio
  title: string;
  description?: string | null;
  image_url: string;
  images?: string[];
  product_url: string;
  affiliate_url?: string | null;
  current_price: number;
  previous_price?: number | null;
  currency: string; // ex: 'BRL'
  coupon?: string | null;
  shipping?: string | null;
  free_shipping?: boolean;
  availability?: boolean;
  category?: string | null;
  seller?: string | null;
  last_checked_at: string;
  raw_metadata?: Record<string, unknown> | null;
}

export type CandidateStatus =
  | 'discovered'
  | 'analyzing'
  | 'candidate'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'expired';

export interface OfferScore {
  total: number; // 0 a 100
  discount_score: number;
  coupon_score: number;
  freshness_score: number;
  data_quality_score: number;
  availability_score: number;
  commission_score: number;
  commission_rate: number; // ex: 0.12 (12%)
  estimated_commission: number; // ex: 45.00 (R$)
  reasons: string[];
}

export interface CandidateOffer {
  id: string;
  provider: string;
  external_id: string;
  title: string;
  description?: string | null;
  image_url: string;
  images?: string[];
  product_url: string;
  affiliate_url?: string | null;
  current_price: number;
  previous_price?: number | null;
  currency: string;
  coupon?: string | null;
  shipping?: string | null;
  free_shipping?: boolean;
  availability?: boolean;
  category_slug?: string | null;
  merchant_slug?: string | null;
  raw_metadata?: Record<string, unknown> | null;
  score: number;
  commission_rate?: number;
  estimated_commission?: number;
  score_breakdown?: OfferScore | null;
  status: CandidateStatus;
  created_at: string;
  updated_at: string;
}

export interface PriceHistoryRecord {
  id: string;
  provider: string;
  external_product_id: string;
  offer_id?: string | null;
  price: number;
  currency: string;
  observed_at: string;
}

export interface IntegrationRun {
  id: string;
  provider: string;
  started_at: string;
  finished_at?: string | null;
  status: 'running' | 'success' | 'failed' | 'rate_limited';
  items_fetched: number;
  items_created: number;
  items_updated: number;
  error_summary?: string | null;
}

export interface PriceAlert {
  id: string;
  offer_id: string;
  target_price: number;
  channel: 'email' | 'whatsapp' | 'web_push';
  status: 'active' | 'triggered' | 'cancelled';
  created_at: string;
  triggered_at?: string | null;
}

export interface DistributionJob {
  id: string;
  offer_id: string;
  channel: 'whatsapp' | 'instagram' | 'telegram';
  status: 'pending' | 'published' | 'failed';
  scheduled_at: string;
  published_at?: string | null;
  external_reference?: string | null;
  error?: string | null;
}
