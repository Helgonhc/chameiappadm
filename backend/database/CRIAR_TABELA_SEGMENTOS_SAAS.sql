-- ==========================================================
-- CHAMEIAPP: TECHNICAL SEGMENTS (SAAS / MULTI-TENANCY)
-- ==========================================================

-- 1. Tabela de Segmentos Técnicos
CREATE TABLE IF NOT EXISTS public.technical_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT, -- Nome do ícone Lucide
    color TEXT, -- Hexadecimal ou classe CSS
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, name)
);

-- 2. Tabela de Relacionamento Perfil-Segmento (Muitos para Muitos)
CREATE TABLE IF NOT EXISTS public.profile_segments (
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    segment_id UUID NOT NULL REFERENCES public.technical_segments(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    PRIMARY KEY (profile_id, segment_id)
);

-- 3. Habilitar RLS
ALTER TABLE public.technical_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_segments ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de RLS (Scored by organization_id)
CREATE POLICY "Users can view segments from their organization"
ON public.technical_segments FOR SELECT
USING (organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage segments from their organization"
ON public.technical_segments FOR ALL
USING (
    organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
);

CREATE POLICY "Users can view profile_segments from their organization"
ON public.profile_segments FOR SELECT
USING (organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage profile_segments from their organization"
ON public.profile_segments FOR ALL
USING (
    organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid())
    AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
);

-- 5. Inserir Segmentos Padrão (Opcional - pode ser feito via UI)
-- INSERT INTO public.technical_segments (organization_id, name, icon)
-- SELECT id, 'Climatização', 'Zap' FROM public.organizations;
