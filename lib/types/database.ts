export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  active: boolean;
  created_at: string;
}

export interface Merchant {
  id: string;
  name: string;
  slug: string;
  website_url: string;
  logo_url?: string | null;
  active: boolean;
  created_at: string;
}

export type OfferStatus = 'draft' | 'published' | 'expired' | 'archived';

export interface Offer {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  category_id: string;
  merchant_id: string;
  current_price: number;
  previous_price?: number | null;
  coupon_code?: string | null;
  image_url: string;
  destination_url: string;
  affiliate_url?: string | null;
  featured: boolean;
  free_shipping?: boolean | null;
  status: OfferStatus;
  starts_at?: string | null;
  expires_at?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
  // Joins
  category?: Category;
  merchant?: Merchant;
}

export interface ClickEvent {
  id: string;
  offer_id: string;
  created_at: string;
  referrer?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
}
