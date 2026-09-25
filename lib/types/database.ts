export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
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
  images?: string[];
  destination_url: string;
  affiliate_url?: string | null;
  featured: boolean;
  free_shipping: boolean;
  status: OfferStatus;
  published_at?: string | null;
  expires_at?: string | null;
  starts_at?: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  merchant?: Merchant;
}
