-- ==========================================================
-- CHAMEIAPP: MASTER ADMIN SEED SCRIPT
-- ==========================================================

-- 1. Garantir que a organização padrão existe
INSERT INTO public.organizations (id, name, slug, plan, status)
VALUES ('00000000-0000-0000-0000-000000000000', 'ChameiApp Master', 'chameiapp-master', 'enterprise', 'active')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, plan = EXCLUDED.plan;

-- 2. Instrução para o Usuário:
-- Como não é recomendado inserir diretamente na tabela auth.users via SQL simples 
-- (devido ao hashing interno do Supabase), este script prepara uma função 
-- para promover o usuário assim que ele for criado.

CREATE OR REPLACE FUNCTION public.setup_master_admin() 
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email = 'helgonhc19@yahoo.com.br' THEN
        INSERT INTO public.profiles (id, full_name, role, organization_id, email)
        VALUES (NEW.id, 'Master Admin', 'super_admin', '00000000-0000-0000-0000-000000000000', NEW.email)
        ON CONFLICT (id) DO UPDATE SET 
            role = 'super_admin',
            organization_id = '00000000-0000-0000-0000-000000000000';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Criar o Trigger (Se não existir)
DROP TRIGGER IF EXISTS on_auth_user_created_master ON auth.users;
CREATE TRIGGER on_auth_user_created_master
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.setup_master_admin();

-- 4. LOG DE FEEDBACK
-- RODE ESTE SCRIPT NO SQL EDITOR E DEPOIS CRIE O USUÁRIO MANUALMENTE NO DASHBOARD
-- OU VIA SIGNUP NO APP. ELE SERÁ AUTOMATICAMENTE PROMOVIDO A SUPER_ADMIN.
