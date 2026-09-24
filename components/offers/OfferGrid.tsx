import React from 'react';
import { Offer } from '../../lib/types/database';
import { OfferCardStandard } from './OfferCardStandard';
import { EmptyState } from '../ui/EmptyState';

interface OfferGridProps {
  offers: Offer[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export const OfferGrid: React.FC<OfferGridProps> = ({
  offers,
  emptyTitle,
  emptyDescription,
}) => {
  if (offers.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 my-6">
      {offers.map((offer) => (
        <OfferCardStandard key={offer.id} offer={offer} />
      ))}
    </div>
  );
};
