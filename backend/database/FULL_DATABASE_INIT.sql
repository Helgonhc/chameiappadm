-- ==========================================================
-- CHAMEIAPP: FULL DATABASE INITIALIZATION (FRESH START)
-- ==========================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE ORGANIZAÇÕES (EMPRESAS)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    plan TEXT NOT NULL DEFAULT 'free',
    status TEXT NOT NULL DEFAULT 'active',
    billing_email TEXT,
    stripe_customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA DE PERFIS (PROFILES)
-- Nota: Esta tabela deve ser vinculada ao auth.users do Supabase
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'technician', -- 'super_admin', 'admin', 'technician', 'client'
    organization_id UUID REFERENCES public.organizations(id),
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA DE CLIENTES
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    cnpj TEXT,
    is_telemetry_client BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABELA DE CHAMADOS (TICKETS)
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id),
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'closed'
    priority TEXT DEFAULT 'medium',
    category TEXT,
    ai_suggestion JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA DE INSTALAÇÕES
CREATE TABLE IF NOT EXISTS public.installations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id),
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    technician_id UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    location_address TEXT,
    state TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    scheduled_date TIMESTAMP WITH TIME ZONE,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    requires_travel BOOLEAN DEFAULT false,
    telemetry_levels JSONB DEFAULT '[]'::jsonb,
    tower_cells INTEGER DEFAULT 1,
    wifi_ssid TEXT,
    wifi_password TEXT,
    technician_name TEXT,
    cnpj TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABELA DE DOCUMENTOS DE INSTALAÇÃO
CREATE TABLE IF NOT EXISTS public.installation_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    installation_id UUID NOT NULL REFERENCES public.installations(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID REFERENCES public.profiles(id)
);

-- 8. TABELA DE CONFIGURAÇÕES DO APP
CREATE TABLE IF NOT EXISTS public.app_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT DEFAULT 'ChameiApp',
    company_cnpj TEXT,
    company_address TEXT,
    company_phone TEXT,
    company_email TEXT,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. HABILITAR RLS EM TUDO
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installation_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- 10. ORGANIZAÇÃO MASTER E TRIGGER DE AUTO-ADMIN
INSERT INTO public.organizations (id, name, slug, plan)
VALUES ('00000000-0000-0000-0000-000000000000', 'ChameiApp Master', 'chameiapp-master', 'enterprise')
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.setup_master_admin_and_profile() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role, organization_id, email)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Admin User'), 
        CASE WHEN NEW.email = 'helgonhc19@yahoo.com.br' THEN 'super_admin' ELSE 'technician' END,
        '00000000-0000-0000-0000-000000000000', 
        NEW.email
    )
    ON CONFLICT (id) DO UPDATE SET 
        role = EXCLUDED.role,
        organization_id = EXCLUDED.organization_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_init ON auth.users;
CREATE TRIGGER on_auth_user_created_init
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.setup_master_admin_and_profile();

-- 11. POLÍTICAS DE RLS BÁSICAS (LEITURA PARA AUTENTICADOS)
-- Nota: Em um passo seguinte, aplicaremos o SAAS_RLS_ENHANCED para isolamento real.
CREATE POLICY "Permitir tudo para super_admin" ON public.profiles FOR ALL TO authenticated USING (role = 'super_admin');
CREATE POLICY "Permitir leitura de profiles p/ autenticados" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir tudo p/ autenticados em app_config" ON public.app_config FOR ALL TO authenticated USING (true);
