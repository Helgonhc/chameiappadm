-- ==========================================================
-- CHAMEIAPP: FORCE MASTER ADMIN ACCESS (EMERGENCY FIX)
-- ==========================================================

-- 1. Garantir que a organização Master de fato existe
INSERT INTO public.organizations (id, name, slug, plan, status)
VALUES ('00000000-0000-0000-0000-000000000000', 'ChameiApp Master', 'chameiapp-master', 'enterprise', 'active')
ON CONFLICT (id) DO NOTHING;

-- 2. Identificar o ID do usuário pelo email e forçar a criação/atualização do perfil
-- Rode isto APÓS ter criado o usuário no Authentication do Supabase
DO $$ 
DECLARE 
    temp_user_id UUID;
BEGIN 
    -- Buscar o ID na tabela de auth
    SELECT id INTO temp_user_id FROM auth.users WHERE email = 'helgonhc19@yahoo.com.br';

    IF temp_user_id IS NOT NULL THEN
        -- Inserir ou atualizar na tabela de perfis
        INSERT INTO public.profiles (id, full_name, role, organization_id, email)
        VALUES (temp_user_id, 'Master Admin', 'super_admin', '00000000-0000-0000-0000-000000000000', 'helgonhc19@yahoo.com.br')
        ON CONFLICT (id) DO UPDATE SET 
            role = 'super_admin',
            organization_id = '00000000-0000-0000-0000-000000000000',
            full_name = 'Master Admin';
            
        RAISE NOTICE 'Acesso forçado com sucesso para o usuário %', temp_user_id;
    ELSE
        RAISE NOTICE 'Usuário helgonhc19@yahoo.com.br não encontrado em auth.users. Crie o usuário primeiro!';
    END IF;
END $$;
