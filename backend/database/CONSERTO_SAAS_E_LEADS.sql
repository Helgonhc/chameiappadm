-- ==========================================================
-- CHAMEIAPP: SAAS CORE & ASAAS REPAIR SCRIPT
-- ==========================================================

-- 1. Garantir que a tabela de Organizações exista
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    plan TEXT NOT NULL DEFAULT 'free',
    status TEXT NOT NULL DEFAULT 'active',
    billing_email TEXT,
    asaas_customer_id TEXT,
    asaas_subscription_id TEXT,
    subscription_status TEXT DEFAULT 'trialing',
    next_billing_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Adicionar organization_id às tabelas base (se elas existirem)
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

    -- Service Orders
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'service_orders') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='service_orders' AND column_name='organization_id') THEN
            ALTER TABLE public.service_orders ADD COLUMN organization_id UUID REFERENCES public.organizations(id);
        END IF;
    END IF;
END $$;

-- 3. Criar Organização Master se não existir
INSERT INTO public.organizations (id, name, slug, plan)
VALUES ('00000000-0000-0000-0000-000000000000', 'ChameiApp Master', 'chameiapp-master', 'pro')
ON CONFLICT (id) DO NOTHING;

-- 4. Vincular seu usuário à organização Master (ajuste manual preventivo)
UPDATE public.profiles 
SET organization_id = '00000000-0000-0000-0000-000000000000'
WHERE organization_id IS NULL;

-- 5. Criar Tabela de Leads (Agora com organização master default)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) DEFAULT '00000000-0000-0000-0000-000000000000',
    name TEXT NOT NULL,
    email TEXT,
    whatsapp TEXT NOT NULL,
    segment TEXT,
    interested_plan TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Habilitar RLS e Políticas para Leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
CREATE POLICY "Anyone can insert leads" ON public.leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view leads from their organization" ON public.leads;
CREATE POLICY "Users can view leads from their organization" ON public.leads 
FOR SELECT USING (organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can manage leads from their organization" ON public.leads;
CREATE POLICY "Admins can manage leads from their organization" ON public.leads 
FOR ALL USING (
    organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
);
