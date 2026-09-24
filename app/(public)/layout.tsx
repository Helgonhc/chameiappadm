import React from 'react';
import { Header } from '../../components/layout/Header';
import { CategoryBar } from '../../components/layout/CategoryBar';
import { Footer } from '../../components/layout/Footer';
import { MerchantService } from '../../lib/services/merchant.service';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await MerchantService.getCategories();

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <CategoryBar categories={categories} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
