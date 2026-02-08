-- ==========================================================
-- CHAMEIAPP: GLOBAL SAAS RLS POLICIES
-- ==========================================================

-- Função auxiliar para validar se o usuário pertence à organização
CREATE OR REPLACE FUNCTION public.current_user_organization() 
RETURNS UUID AS $$
    SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 1. PROFILES
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "SaaS: Profiles isolation" ON public.profiles;
        CREATE POLICY "SaaS: Profiles isolation" ON public.profiles
        FOR ALL USING (organization_id = public.current_user_organization());
    END IF;
END $$;

-- 2. CLIENTS
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clients') THEN
        ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "SaaS: Clients isolation" ON public.clients;
        CREATE POLICY "SaaS: Clients isolation" ON public.clients
        FOR ALL USING (organization_id = public.current_user_organization());
    END IF;
END $$;

-- 3. TICKETS (Chamados)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tickets') THEN
        ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "SaaS: Tickets isolation" ON public.tickets;
        CREATE POLICY "SaaS: Tickets isolation" ON public.tickets
        FOR ALL USING (organization_id = public.current_user_organization());
    END IF;
END $$;

-- 4. SERVICE ORDERS (Ordens de Serviço)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'service_orders') THEN
        ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "SaaS: Service Orders isolation" ON public.service_orders;
        CREATE POLICY "SaaS: Service Orders isolation" ON public.service_orders
        FOR ALL USING (organization_id = public.current_user_organization());
    END IF;
END $$;

-- 5. EQUIPMENTS
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'equipments') THEN
        ALTER TABLE public.equipments ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "SaaS: Equipments isolation" ON public.equipments;
        CREATE POLICY "SaaS: Equipments isolation" ON public.equipments
        FOR ALL USING (organization_id = public.current_user_organization());
    END IF;
END $$;

-- 6. INSTALLATIONS
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'installations') THEN
        ALTER TABLE public.installations ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "SaaS: Installations isolation" ON public.installations;
        CREATE POLICY "SaaS: Installations isolation" ON public.installations
        FOR ALL USING (organization_id = public.current_user_organization());
    END IF;
END $$;

-- 7. MAINTENANCE CONTRACTS
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'maintenance_contracts') THEN
        ALTER TABLE public.maintenance_contracts ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "SaaS: Maintenance isolation" ON public.maintenance_contracts;
        CREATE POLICY "SaaS: Maintenance isolation" ON public.maintenance_contracts
        FOR ALL USING (organization_id = public.current_user_organization());
    END IF;
END $$;

-- 8. NOTIFICATIONS
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') THEN
        ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "SaaS: Notifications isolation" ON public.notifications;
        CREATE POLICY "SaaS: Notifications isolation" ON public.notifications
        FOR ALL USING (user_id = auth.uid());
    END IF;
END $$;

-- Nota: Super admins podem precisar de políticas adicionais, 
-- mas por padrão o RLS acima garante o isolamento SaaS básico.
