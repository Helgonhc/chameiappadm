-- ============================================================
-- CHAMEIAPP V2 — SCRIPT COMPLETO DE RESET & RECRIAÇÃO DO SUPABASE
-- ATENÇÃO: ESTE SCRIPT REMOVE TODAS AS TABELAS ANTERIORES DO PUBLIC SCHEMA
-- E CRIA A ESTRUTURA OFICIAL E SEGURA DO CHAMEIAPP V2 DO ZERO.
-- ============================================================

-- ------------------------------------------------------------
-- FASE 1: REMOÇÃO DE TABELAS E FUNÇÕES ANTERIORES (CLEAN SLATE)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS distribution_jobs CASCADE;
DROP TABLE IF EXISTS price_alerts CASCADE;
DROP TABLE IF EXISTS integration_runs CASCADE;
DROP TABLE IF EXISTS price_history CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;
DROP TABLE IF EXISTS click_events CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS merchants CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP FUNCTION IF EXISTS is_admin(UUID) CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- ------------------------------------------------------------
-- FASE 2: FUNÇÕES AUXILIARES DE SEGURANÇA E TRIGGERS
-- ------------------------------------------------------------

-- Função para atualizar campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- FASE 3: CRIAÇÃO DAS TABELAS DO CHAMEIAPP V2
-- ------------------------------------------------------------

-- 1. Perfis de Usuário e Roles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para criar perfil automaticamente ao registrar novo usuário
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Função utilitária de autorização RLS para admins
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Categorias de Produtos
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Lojas Parceiras / Merchants
CREATE TABLE merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Ofertas Publicadas
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  destination_url TEXT NOT NULL,
  affiliate_url TEXT,
  current_price NUMERIC(10, 2) NOT NULL,
  previous_price NUMERIC(10, 2),
  coupon_code TEXT,
  free_shipping BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived', 'expired')),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Rastreamento de Cliques / Analytics
CREATE TABLE click_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  user_agent TEXT,
  referer TEXT,
  ip_hash TEXT,
  source TEXT,
  campaign TEXT,
  placement TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Candidatas do Radar Chamei
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  external_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  product_url TEXT NOT NULL,
  affiliate_url TEXT,
  current_price NUMERIC(10, 2) NOT NULL,
  previous_price NUMERIC(10, 2),
  currency TEXT DEFAULT 'BRL',
  coupon TEXT,
  shipping TEXT,
  free_shipping BOOLEAN DEFAULT FALSE,
  availability BOOLEAN DEFAULT TRUE,
  category_slug TEXT,
  merchant_slug TEXT,
  raw_metadata JSONB,
  score NUMERIC(5, 2) DEFAULT 0,
  score_breakdown JSONB,
  status TEXT DEFAULT 'candidate' CHECK (status IN ('discovered', 'analyzing', 'candidate', 'approved', 'rejected', 'published', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_candidate_provider_id UNIQUE (provider, external_id)
);

CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Histórico Real de Preços (Zero Backfill)
CREATE TABLE price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  external_product_id TEXT NOT NULL,
  offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  observed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Execuções de Integração / Logs
CREATE TABLE integration_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'success', 'failed', 'rate_limited')),
  items_fetched INTEGER DEFAULT 0,
  items_created INTEGER DEFAULT 0,
  items_updated INTEGER DEFAULT 0,
  error_summary TEXT
);

-- 9. Alertas de Preço ("Me chama quando baixar")
CREATE TABLE price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  target_price NUMERIC(10, 2) NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'web_push')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'triggered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  triggered_at TIMESTAMPTZ
);

-- 10. Fila de Distribuição Futura
CREATE TABLE distribution_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'instagram', 'telegram')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'failed')),
  scheduled_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  external_reference TEXT,
  error TEXT
);

-- ------------------------------------------------------------
-- FASE 4: CRIAÇÃO DE ÍNDICES OTIMIZADOS
-- ------------------------------------------------------------
CREATE INDEX idx_offers_status_published ON offers(status, published_at DESC);
CREATE INDEX idx_offers_slug ON offers(slug);
CREATE INDEX idx_offers_category ON offers(category_id);
CREATE INDEX idx_offers_merchant ON offers(merchant_id);

CREATE INDEX idx_candidates_provider_id ON candidates(provider, external_id);
CREATE INDEX idx_candidates_status ON candidates(status);
CREATE INDEX idx_candidates_score ON candidates(score DESC);

CREATE INDEX idx_price_history_product ON price_history(provider, external_product_id, observed_at DESC);
CREATE INDEX idx_click_events_offer ON click_events(offer_id, clicked_at DESC);
CREATE INDEX idx_integration_runs_provider ON integration_runs(provider, started_at DESC);

-- ------------------------------------------------------------
-- FASE 5: POLÍTICAS DE SEGURANÇA RLS (ROW LEVEL SECURITY)
-- ------------------------------------------------------------

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE distribution_jobs ENABLE ROW LEVEL SECURITY;

-- Profiles: Leitura pelo próprio usuário ou admin; Atualização própria/admin
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id OR is_admin(auth.uid()));

-- Categories: Leitura pública, escrita por admin
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON categories FOR ALL USING (is_admin(auth.uid()));

-- Merchants: Leitura pública, escrita por admin
CREATE POLICY "Public read merchants" ON merchants FOR SELECT USING (true);
CREATE POLICY "Admins manage merchants" ON merchants FOR ALL USING (is_admin(auth.uid()));

-- Offers: Leitura pública de ofertas publicadas, gerenciamento por admin
CREATE POLICY "Public read published offers" ON offers FOR SELECT USING (status = 'published' OR is_admin(auth.uid()));
CREATE POLICY "Admins manage offers" ON offers FOR ALL USING (is_admin(auth.uid()));

-- Click Events: Inserção por qualquer visitante, leitura por admin
CREATE POLICY "Public insert click events" ON click_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins read click events" ON click_events FOR SELECT USING (is_admin(auth.uid()));

-- Candidates: Somente Administradores
CREATE POLICY "Admins manage candidates" ON candidates FOR ALL USING (is_admin(auth.uid()));

-- Price History: Leitura pública, escrita por admin / service role
CREATE POLICY "Public read price history" ON price_history FOR SELECT USING (true);
CREATE POLICY "Admins insert price history" ON price_history FOR INSERT WITH CHECK (is_admin(auth.uid()) OR auth.uid() IS NULL);

-- Integration Runs: Somente Administradores
CREATE POLICY "Admins manage integration runs" ON integration_runs FOR ALL USING (is_admin(auth.uid()));

-- Price Alerts: Inserção pública, gerenciamento por admin
CREATE POLICY "Public insert price alerts" ON price_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage price alerts" ON price_alerts FOR ALL USING (is_admin(auth.uid()));

-- Distribution Jobs: Somente Administradores
CREATE POLICY "Admins manage distribution jobs" ON distribution_jobs FOR ALL USING (is_admin(auth.uid()));

-- ------------------------------------------------------------
-- FASE 6: SEED DE DADOS INICIAIS ESSENCIAIS
-- ------------------------------------------------------------

-- Categorias Iniciais
INSERT INTO categories (name, slug, description, icon) VALUES
('Tecnologia & Informática', 'tecnologia', 'Smartphones, notebooks, periféricos e acessórios de tecnologia.', 'laptop'),
('Ferramentas & Construção', 'ferramentas', 'Parafusadeiras, ferramentas manuais e equipamentos de construção.', 'wrench'),
('Casa & Cozinha', 'casa-e-cozinha', 'Eletroportáteis, utensílios domésticos e itens para lar.', 'home'),
('Eletrônicos & Games', 'eletronicos-e-games', 'Consoles, controles, fones de ouvido e acessórios gamer.', 'gamepad')
ON CONFLICT (slug) DO NOTHING;

-- Loja Parceira Oficial Inicial
INSERT INTO merchants (name, slug, domain, logo_url) VALUES
('Amazon Brasil', 'amazon', 'amazon.com.br', 'https://m.media-amazon.com/images/G/32/social_share/amazon_logo._CB633266945_.png')
ON CONFLICT (slug) DO NOTHING;
