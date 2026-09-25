-- ============================================================
-- SCRIPT DE CORREÇÃO DE PERMISSÕES DO SUPABASE (CHAMEIAPP V2)
-- Executar no SQL Editor do Dashboard do Supabase:
-- https://supabase.com/dashboard/project/ycssbfzfrcfxpbsdlzkq/sql/new
-- ============================================================

-- 1. CONCEDER PERMISSÕES DIRETAS NAS TABELAS PARA TODAS AS ROLES
GRANT ALL ON TABLE public.offers TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.categories TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.merchants TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.candidates TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.click_events TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.price_history TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.integration_runs TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.price_alerts TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.distribution_jobs TO anon, authenticated, service_role;

-- 2. CONCEDER PERMISSÕES NAS SEQUÊNCIAS DE SCHEMAS
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 3. REMOVER POLÍTICAS ANTIGAS E RESTRITIVAS QUE BLOQUEIAM INSERÇÃO DO ROBÔ
DROP POLICY IF EXISTS "Allow public read offers" ON public.offers;
DROP POLICY IF EXISTS "Allow service and anon insert offers" ON public.offers;
DROP POLICY IF EXISTS "Allow all access offers" ON public.offers;
DROP POLICY IF EXISTS "Public read offers" ON public.offers;
DROP POLICY IF EXISTS "Admins manage offers" ON public.offers;

DROP POLICY IF EXISTS "Allow all access categories" ON public.categories;
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
DROP POLICY IF EXISTS "Admins manage categories" ON public.categories;

DROP POLICY IF EXISTS "Allow all access merchants" ON public.merchants;
DROP POLICY IF EXISTS "Public read merchants" ON public.merchants;
DROP POLICY IF EXISTS "Admins manage merchants" ON public.merchants;

DROP POLICY IF EXISTS "Allow all access candidates" ON public.candidates;

-- 4. HABILITAR E ATRIBUIR POLÍTICAS PERMISSIVAS PARA OPERAÇÕES DO ROBÔ E ADMIN
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access offers" 
  ON public.offers 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all access categories" 
  ON public.categories 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all access merchants" 
  ON public.merchants 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all access candidates" 
  ON public.candidates 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
