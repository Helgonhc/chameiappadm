import { Category, Merchant } from '../types/database';

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Tecnologia & Eletrônicos',
    slug: 'tecnologia',
    description: 'Smartphones, notebooks, fones de ouvido e eletrônicos.',
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Casa & Cozinha',
    slug: 'casa-e-cozinha',
    description: 'Eletrodomésticos, robôs aspiradores e utensílios para o lar.',
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Games & Consoles',
    slug: 'games',
    description: 'Consoles PlayStation, Xbox, Nintendo Switch e acessórios.',
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    name: 'Ferramentas & Hardware',
    slug: 'ferramentas',
    description: 'Parafusadeiras, equipamentos e ferramentas.',
    active: true,
    created_at: new Date().toISOString(),
  },
];

export const SEED_MERCHANTS: Merchant[] = [
  {
    id: 'm1111111-1111-1111-1111-111111111111',
    name: 'Amazon Brasil',
    slug: 'amazon',
    website_url: 'https://www.amazon.com.br/',
    logo_url: null,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'm2222222-2222-2222-2222-222222222222',
    name: 'Mercado Livre',
    slug: 'mercado-livre',
    website_url: 'https://www.mercadolivre.com.br/',
    logo_url: null,
    active: true,
    created_at: new Date().toISOString(),
  },
];
