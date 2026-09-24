-- ============================================================
-- CHAMEIAPP — SCHEMA POSTGRESQL & POLICIES RLS DE SEGURANÇA
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TIPOS E ENUMS
CREATE TYPE offer_status AS ENUM ('draft', 'published', 'expired', 'archived');
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- 2. TABELA DE PERFIS DE USUÁRIOS (PROFILES)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. FUNÇÃO AUXILIAR DE VERIFICAÇÃO ADMIN
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. TABELAS DE NEGÓCIO
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL UNIQUE,
    website_url VARCHAR(500) NOT NULL,
    logo_url VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) NOT NULL UNIQUE,
    description TEXT,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE RESTRICT,
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

CREATE TABLE public.click_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    referrer VARCHAR(1000),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100)
);

-- 5. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;

-- 6. POLÍCITAS RLS — LEITURA PÚBLICA / ANON (ESTRITA)
CREATE POLICY "Public Read Active Categories" ON public.categories
    FOR SELECT USING (active = true);

CREATE POLICY "Public Read Active Merchants" ON public.merchants
    FOR SELECT USING (active = true);

CREATE POLICY "Public Read Published Valid Offers" ON public.offers
    FOR SELECT USING (
        status = 'published' AND
        (starts_at IS NULL OR starts_at <= NOW()) AND
        (expires_at IS NULL OR expires_at > NOW())
    );

-- NENHUMA POLÍTICA DE SELECT PÚBLICO EM click_events! (Bloqueio total de leitura para anon)

-- 7. POLÍTICAS RLS — AUTORIZAÇÃO ADMIN EXPLICITA (is_admin())
CREATE POLICY "Admin Full Access Profiles" ON public.profiles
    FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Admin Full Access Categories" ON public.categories
    FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Admin Full Access Merchants" ON public.merchants
    FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Admin Full Access Offers" ON public.offers
    FOR ALL TO authenticated USING (public.is_admin());

CREATE POLICY "Admin Full Access Click Events" ON public.click_events
    FOR ALL TO authenticated USING (public.is_admin());
