import { ExternalProduct, ProviderStatus } from '../../types/radar';

export interface ProviderSearchOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minDiscountPercent?: number;
  limit?: number;
}

export interface AffiliateProductProvider {
  readonly providerName: string;

  getStatus(): Promise<ProviderStatus>;

  searchProducts(query: string, options?: ProviderSearchOptions): Promise<ExternalProduct[]>;

  getProduct(externalId: string): Promise<ExternalProduct | null>;

  getOffers(options?: ProviderSearchOptions): Promise<ExternalProduct[]>;

  normalizeProduct(rawInput: unknown): ExternalProduct;

  healthCheck(): Promise<{ status: ProviderStatus; message: string; lastCheckedAt: string }>;
}
