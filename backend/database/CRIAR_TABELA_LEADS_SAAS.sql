-- ==========================================================
-- CHAMEIAPP: LEADS (SAAS / MULTI-TENANCY)
-- ==========================================================

-- 1. Tabela de Leads (Interessados vindos da Landing Page)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) DEFAULT '00000000-0000-0000-0000-000000000000', -- Default para Master Org
    name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    segment TEXT, -- Ramo de atividade informado no formulário
    status TEXT DEFAULT 'new', -- 'new', 'contacted', 'converted', 'ignored'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de RLS
-- Qualquer um pode inserir (público via Landing Page)
CREATE POLICY "Anyone can insert leads"
ON public.leads FOR INSERT
WITH CHECK (true);

-- Apenas membros da organização podem ver seus leads
CREATE POLICY "Users can view leads from their organization"
ON public.leads FOR SELECT
USING (organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

-- Apenas admins podem editar leads
CREATE POLICY "Admins can manage leads from their organization"
ON public.leads FOR ALL
USING (
    organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
);
