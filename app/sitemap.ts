import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '../lib/config/site.config';
import { OfferService } from '../lib/services/offer.service';
import { MerchantService } from '../lib/services/merchant.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.domain;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ofertas`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/como-funciona`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/divulgacao-de-afiliados`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/politica-de-privacidade`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/termos-de-uso`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const offers = await OfferService.getPublishedOffers();
  const offerRoutes: MetadataRoute.Sitemap = offers.map((o) => ({
    url: `${baseUrl}/ofertas/${o.slug}`,
    lastModified: new Date(o.updated_at || o.created_at),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const categories = await MerchantService.getCategories();
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/categoria/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  const merchants = await MerchantService.getMerchants();
  const merchantRoutes: MetadataRoute.Sitemap = merchants.map((m) => ({
    url: `${baseUrl}/loja/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  return [...staticRoutes, ...offerRoutes, ...categoryRoutes, ...merchantRoutes];
}
