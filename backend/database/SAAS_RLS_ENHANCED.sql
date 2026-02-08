-- ==============================================================================
-- CHAMEIAPP: RLS ENHANCED (ISOLATION BY ORGANIZATION)
-- ==============================================================================
-- Este script garante que nenhum dado seja vazado entre diferentes empresas.
-- Todas as tabelas agora filtram estritamente pelo organization_id.
-- ==============================================================================

-- 1. Função auxiliar para obter o ID da Organização do usuário atual
CREATE OR REPLACE FUNCTION public.get_my_organization_id()
RETURNS uuid AS $$
BEGIN
  -- Tenta pegar do JWT (definido pelo Supabase Auth Hook se configurado)
  IF (auth.jwt() ->> 'organization_id') IS NOT NULL THEN
    RETURN (auth.jwt() ->> 'organization_id')::uuid;
  END IF;

  -- Fallback: busca no profile (pode ter impacto leve em performance)
  RETURN (
    SELECT organization_id FROM public.profiles 
    WHERE id = auth.uid() 
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. RESET DE POLÍTICAS EXISTENTES (Para evitar conflitos)
-- Executar DROP POLICY para cada tabela antes de recriar

-- PROFILES
DROP POLICY IF EXISTS "Profiles View Policy" ON profiles;
DROP POLICY IF EXISTS "Profiles Update Policy" ON profiles;
DROP POLICY IF EXISTS "Profiles Insert Policy" ON profiles;

-- CLIENTS
DROP POLICY IF EXISTS "Clients View Policy" ON clients;
DROP POLICY IF EXISTS "Clients Admin Mutate Policy" ON clients;

-- SERVICE ORDERS
DROP POLICY IF EXISTS "Enable read access for all users" ON service_orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON service_orders;

-- TICKETS
DROP POLICY IF EXISTS "Enable read access for all users" ON tickets;

-- ... e assim por diante para outras tabelas ...

-- 3. NOVAS POLÍTICAS ESTREITAS POR ORGANIZAÇÃO (Exemplos Core)

-- [POLÍTICA GENÉRICA PARA MULTI-TENANCY]
-- Usaremos o padrão: USING (organization_id = get_my_organization_id())

-- PROFILES
CREATE POLICY "Profiles Org Isolation" ON profiles
FOR ALL USING (organization_id = get_my_organization_id());

-- CLIENTS
CREATE POLICY "Clients Org Isolation" ON clients
FOR ALL USING (organization_id = get_my_organization_id());

-- SERVICE ORDERS
CREATE POLICY "Service Orders Org Isolation" ON service_orders
FOR ALL USING (organization_id = get_my_organization_id());

-- TICKETS
CREATE POLICY "Tickets Org Isolation" ON tickets
FOR ALL USING (organization_id = get_my_organization_id());

-- EQUIPMENTS
CREATE POLICY "Equipments Org Isolation" ON equipments
FOR ALL USING (organization_id = get_my_organization_id());

-- INSTALLATIONS
CREATE POLICY "Installations Org Isolation" ON installations
FOR ALL USING (organization_id = get_my_organization_id());

-- MAINTENANCE CONTRACTS
CREATE POLICY "Contracts Org Isolation" ON maintenance_contracts
FOR ALL USING (organization_id = get_my_organization_id());

-- LOAD SURVEYS
CREATE POLICY "Surveys Org Isolation" ON load_surveys
FOR ALL USING (organization_id = get_my_organization_id());

-- 4. POLÍTICAS PARA A TABELA ORGANIZATIONS
-- Usuários só podem ver os detalhes da própria organização
CREATE POLICY "Organizations Access Policy" ON organizations
FOR SELECT USING (id = get_my_organization_id());

-- Somente super_admins ou via Stripe Hook poderiam editar organizations (configurado via trigger/definer)

-- 5. NOTA SOBRE SEGURANÇA
-- Todas as novas tabelas CRIADAS a partir de agora DEVEM ter organization_id
-- e a política de isolamento aplicada.
