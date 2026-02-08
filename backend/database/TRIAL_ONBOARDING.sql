-- ==========================================================
-- CHAMEIAPP: TRIAL & ONBOARDING SYSTEM
-- ==========================================================

-- 1. Estender a tabela de Organizações com controle de Trial
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='organizations' AND column_name='trial_ends_at') THEN
        ALTER TABLE public.organizations ADD COLUMN trial_ends_at TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='organizations' AND column_name='is_trial') THEN
        ALTER TABLE public.organizations ADD COLUMN is_trial BOOLEAN DEFAULT false;
    END IF;
END $$;

-- 2. Tabela de Leads (Captura antes do Onboarding completo)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    segment TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'converted', 'contacted'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Função para verificar se a organização está em dia ou Trial expirado
CREATE OR REPLACE FUNCTION public.check_org_status(org_id UUID)
RETURNS TEXT AS $$
DECLARE
    org_record RECORD;
BEGIN
    SELECT * INTO org_record FROM public.organizations WHERE id = org_id;
    
    IF org_record.is_trial AND org_record.trial_ends_at < NOW() THEN
        RETURN 'trial_expired';
    END IF;
    
    RETURN org_record.status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Habilitar RLS para Leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view leads" ON public.leads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Public can insert leads" ON public.leads FOR INSERT WITH CHECK (true);
