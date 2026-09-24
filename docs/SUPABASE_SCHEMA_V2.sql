-- ============================================================
-- CHAMEIAPP V2 — SUPABASE MIGRATION SCHEMA V2
-- TABELAS PARA RADAR DE OFERTAS, HISTÓRICO E MOTOR DE AFILIADOS
-- ============================================================

-- 1. TABELA DE CANDIDATAS (FILA DO RADAR CHAMEI)
CREATE TABLE IF NOT EXISTS candidates (
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

CREATE INDEX IF NOT EXISTS idx_candidates_provider_id ON candidates(provider, external_id);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_score ON candidates(score DESC);

-- 2. TABELA DE HISTÓRICO DE PREÇOS REAL (ZERO BACKFILL)
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  external_product_id TEXT NOT NULL,
  offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  observed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_history_product ON price_history(provider, external_product_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_history_offer ON price_history(offer_id);

-- 3. TABELA DE EXECUÇÕES DE INTEGRAÇÃO / LOGS
CREATE TABLE IF NOT EXISTS integration_runs (
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

CREATE INDEX IF NOT EXISTS idx_integration_runs_provider ON integration_runs(provider, started_at DESC);

-- 4. TABELA DE ALERTAS DE PREÇO (ARQUITETURA "ME CHAMA QUANDO BAIXAR")
CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  target_price NUMERIC(10, 2) NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'web_push')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'triggered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  triggered_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_price_alerts_offer ON price_alerts(offer_id, status);

-- 5. TABELA DE FILA DE DISTRIBUIÇÃO FUTURA (REDES / COMUNIDADES)
CREATE TABLE IF NOT EXISTS distribution_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'instagram', 'telegram')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'failed')),
  scheduled_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  external_reference TEXT,
  error TEXT
);

CREATE INDEX IF NOT EXISTS idx_distribution_jobs_status ON distribution_jobs(status, scheduled_at);

-- ============================================================
-- SEGURANÇA E RLS (ROW LEVEL SECURITY)
-- ============================================================

ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE distribution_jobs ENABLE ROW LEVEL SECURITY;

-- Candidates: Somente Administradores
CREATE POLICY "Admins control candidates" ON candidates
  FOR ALL USING (is_admin(auth.uid()));

-- Price History: Leitura pública, Escrita por Administradores / Service Role
CREATE POLICY "Public read price history" ON price_history
  FOR SELECT USING (true);

CREATE POLICY "Admins manage price history" ON price_history
  FOR INSERT WITH CHECK (is_admin(auth.uid()) OR auth.uid() IS NULL);

-- Integration Runs: Somente Administradores
CREATE POLICY "Admins view integration runs" ON integration_runs
  FOR ALL USING (is_admin(auth.uid()));

-- Price Alerts: Criar por qualquer usuário, gerenciar se próprio ou admin
CREATE POLICY "Users can create price alerts" ON price_alerts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins manage price alerts" ON price_alerts
  FOR ALL USING (is_admin(auth.uid()));

-- Distribution Jobs: Somente Administradores
CREATE POLICY "Admins control distribution jobs" ON distribution_jobs
  FOR ALL USING (is_admin(auth.uid()));
