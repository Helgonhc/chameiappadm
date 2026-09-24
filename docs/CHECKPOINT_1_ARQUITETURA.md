# CHAMEIAPP — Documentação de Arquitetura & Fundação (Checkpoint 1)

> **Status:** Checkpoint 1 — Aprovado e Auditado  
> **Data:** Setembro de 2026  
> **Projeto:** Portal Real de Ofertas e Afiliados  
> **Marca Oficial:** CHAMEIAPP  
> **Domínio:** https://chameiapp.com.br  

---

## 1. Arquitetura Proposta

O **CHAMEIAPP** é construído como uma aplicação web monolítica moderna e otimizada baseada em **Next.js (App Router)**, **TypeScript**, **Tailwind CSS** com tokens customizados e **Supabase (PostgreSQL + Auth + Storage)**.

```mermaid
graph TD
    User[Visitante / Cliente Mobile & Desktop] --> NextApp[Next.js App Router]
    NextApp --> RSC[React Server Components - SSR/SSG]
    NextApp --> RouteGo[Route Handler /go/offerId]
    NextApp --> AdminApp[Painel Admin /admin - Autenticado]
    
    RouteGo --> AuditLog[(Click Tracking - Eventos)]
    RouteGo --> Redirect[Redirecionamento Seguro -> Loja Real]
    
    AdminApp --> ServerActions[Server Actions - Validação Zod]
    ServerActions --> DB[(Supabase PostgreSQL)]
    
    RSC --> DB
    AdminApp --> Storage[(Supabase Storage - Imagens Reais)]
    
    Redirect --> Amazon[Amazon Brasil (chameiapp-20)]
    Redirect --> MercadoLivre[Mercado Livre]
```

---

## 2. Sitemap Estrutural

```
/                             (Home - Vitrine de ofertas reais + Seção editorial)
├── /ofertas                  (Catálogo geral de ofertas publicadas com filtros)
│   └── /[slug]               (Página de detalhe do produto real com Canonical)
├── /categoria                (Redireciona para /ofertas)
│   └── /[slug]               (Ofertas filtradas por categoria)
├── /loja                     (Redireciona para /ofertas)
│   └── /[slug]               (Ofertas filtradas por loja/merchant)
├── /sobre                    (Histórico institucional e transparência da marca)
├── /como-funciona            (Explicação didática do fluxo do agregador)
├── /contato                  (Formulário de contato profissional com Zod)
├── /divulgacao-de-afiliados  (Declaração de transparência sobre comissionamento Amazon/ML)
├── /politica-de-privacidade  (Conformidade com a LGPD e gestão de dados)
├── /termos-de-uso            (Termos legais de navegação e isenção de responsabilidade)
├── /admin                    (Painel administrativo restrito com Middleware Server-Side)
│   ├── /login                (Autenticação do administrador)
│   ├── /dashboard            (Métricas reais e lista de produtos)
│   └── /ofertas/nova         (Cadastro de ofertas reais)
└── /go/[offerId]             (Endpoint de tracking de clique e redirecionamento seguro)
```

---

## 3. Schema do Banco de Dados (PostgreSQL / Supabase) & Policies RLS

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE offer_status AS ENUM ('draft', 'published', 'expired', 'archived');

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    website_url VARCHAR(500) NOT NULL,
    logo_url VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) NOT NULL UNIQUE,
    description TEXT,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE RESTRICT,
    current_price NUMERIC(10, 2) NOT NULL CHECK (current_price >= 0),
    previous_price NUMERIC(10, 2) CHECK (previous_price > current_price),
    coupon_code VARCHAR(50),
    image_url VARCHAR(1000) NOT NULL,
    destination_url VARCHAR(2000) NOT NULL,
    affiliate_url VARCHAR(2000),
    featured BOOLEAN NOT NULL DEFAULT false,
    free_shipping BOOLEAN DEFAULT false,
    status offer_status NOT NULL DEFAULT 'published',
    starts_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE click_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    referrer VARCHAR(1000),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100)
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Active Categories" ON categories FOR SELECT USING (active = true);
CREATE POLICY "Public Read Active Merchants" ON merchants FOR SELECT USING (active = true);
CREATE POLICY "Public Read Published Offers" ON offers FOR SELECT USING (status = 'published');
CREATE POLICY "Public Insert Click Events" ON click_events FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin Full Access Categories" ON categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Merchants" ON merchants FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Offers" ON offers FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin Full Access Clicks" ON click_events FOR ALL TO authenticated USING (true);
```

---

## 4. Configuração Nominal (`site.config.ts`)

```typescript
export const SITE_CONFIG = {
  name: "CHAMEIAPP",
  legalName: "CHAMEIAPP Ofertas Ltda",
  tagline: "Achamos as melhores ofertas para você no CHAMEIAPP.",
  subtagline: "Portal independente de ofertas e promoções verificadas da Amazon, Mercado Livre e principais lojas.",
  region: "Minas Gerais, Brasil",
  domain: "https://chameiapp.com.br",
  amazonAssociateTag: "chameiapp-20",
  merchantsAllowed: ["Amazon Brasil", "Mercado Livre"],
};
```
