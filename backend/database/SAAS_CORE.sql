-- ==========================================================
-- CHAMEIAPP: CORE SAAS MIGRATION (MULTI-TENANCY)
-- ==========================================================

-- 1. Criar tabela de Organizações (Empresas)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    plan TEXT NOT NULL DEFAULT 'free', -- 'free', 'pro', 'enterprise'
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'canceled'
    billing_email TEXT,
    stripe_customer_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS para organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- 2. Adicionar organization_id às tabelas existentes (se ainda não existir)
DO $$ 
BEGIN 
    -- Profiles
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='organization_id') THEN
            ALTER TABLE public.profiles ADD COLUMN organization_id UUID REFERENCES public.organizations(id);
        END IF;
    END IF;

    -- Clients
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clients') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='clients' AND column_name='organization_id') THEN
            ALTER TABLE public.clients ADD COLUMN organization_id UUID REFERENCES public.organizations(id);
        END IF;
    END IF;

    -- Service Orders (Ordens de Serviço)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'service_orders') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='service_orders' AND column_name='organization_id') THEN
            ALTER TABLE public.service_orders ADD COLUMN organization_id UUID REFERENCES public.organizations(id);
        END IF;
    END IF;

    -- Tickets (Chamados)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tickets') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tickets' AND column_name='organization_id') THEN
            ALTER TABLE public.tickets ADD COLUMN organization_id UUID REFERENCES public.organizations(id);
        END IF;
    END IF;

    -- Equipments
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'equipments') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='equipments' AND column_name='organization_id') THEN
            ALTER TABLE public.equipments ADD COLUMN organization_id UUID REFERENCES public.organizations(id);
        END IF;
    END IF;

    -- Maintenance Contracts
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'maintenance_contracts') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='maintenance_contracts' AND column_name='organization_id') THEN
            ALTER TABLE public.maintenance_contracts ADD COLUMN organization_id UUID REFERENCES public.organizations(id);
        END IF;
    END IF;

    -- Installations
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'installations') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='installations' AND column_name='organization_id') THEN
            ALTER TABLE public.installations ADD COLUMN organization_id UUID REFERENCES public.organizations(id);
        END IF;
    END IF;

    -- Load Surveys
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'load_surveys') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='load_surveys' AND column_name='organization_id') THEN
            ALTER TABLE public.load_surveys ADD COLUMN organization_id UUID REFERENCES public.organizations(id);
        END IF;
    END IF;

END $$;

-- 3. Inserir uma organização padrão para dados existentes
INSERT INTO public.organizations (id, name, slug, plan)
VALUES ('00000000-0000-0000-0000-000000000000', 'Organização Padrão', 'organizacao-padrao', 'pro')
ON CONFLICT (id) DO NOTHING;

-- 4. Vincular dados órfãos à organização padrão
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        UPDATE public.profiles SET organization_id = '00000000-0000-0000-0000-000000000000' WHERE organization_id IS NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clients') THEN
        UPDATE public.clients SET organization_id = '00000000-0000-0000-0000-000000000000' WHERE organization_id IS NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'service_orders') THEN
        UPDATE public.service_orders SET organization_id = '00000000-0000-0000-0000-000000000000' WHERE organization_id IS NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tickets') THEN
        UPDATE public.tickets SET organization_id = '00000000-0000-0000-0000-000000000000' WHERE organization_id IS NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'equipments') THEN
        UPDATE public.equipments SET organization_id = '00000000-0000-0000-0000-000000000000' WHERE organization_id IS NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'maintenance_contracts') THEN
        UPDATE public.maintenance_contracts SET organization_id = '00000000-0000-0000-0000-000000000000' WHERE organization_id IS NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'installations') THEN
        UPDATE public.installations SET organization_id = '00000000-0000-0000-0000-000000000000' WHERE organization_id IS NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'load_surveys') THEN
        UPDATE public.load_surveys SET organization_id = '00000000-0000-0000-0000-000000000000' WHERE organization_id IS NULL;
    END IF;
END $$;

-- 5. Atualizar função de JWT para incluir organization_id (Necessário configurar no Supabase Auth)
-- Nota: Isso é apenas um lembrete, requer alteração nas configurações do Supabase.

-- 6. Políticas de RLS Básicas para Organizations
CREATE POLICY "Users can view their own organization"
ON public.organizations FOR SELECT
USING (
    id IN (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
);

-- 7. Criar Trigger para manter organization_id sincronizado no profile (se necessário)
-- Por enquanto, vamos assumir gerenciamento manual via UI de onboarding.
