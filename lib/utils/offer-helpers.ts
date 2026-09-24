import { Offer } from '../types/database';

export function calculateDiscount(currentPrice: number, previousPrice?: number | null): number {
  if (!previousPrice || previousPrice <= currentPrice || currentPrice <= 0) {
    return 0;
  }
  const discount = ((previousPrice - currentPrice) / previousPrice) * 100;
  return Math.round(discount);
}

export function isOfferAvailable(offer: Offer, referenceDate: Date = new Date()): boolean {
  if (!offer || offer.status !== 'published') {
    return false;
  }

  if (offer.expires_at && new Date(offer.expires_at) <= referenceDate) {
    return false;
  }

  if (offer.starts_at && new Date(offer.starts_at) > referenceDate) {
    return false;
  }

  return true;
}
