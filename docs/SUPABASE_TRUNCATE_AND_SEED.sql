-- ============================================================
-- CHAMEIAPP V2 — SCRIPTS DE LIMPEZA DE DADOS (TRUNCATE) E NOVO SEED
-- ============================================================

-- ============================================================
-- PARTE 1: SCRIPT PARA ZERAR E LIMPAR TODO O CONTEÚDO DAS TABELAS
-- (Mantém a estrutura do banco intacta, apenas apaga todos os registros)
-- ============================================================

TRUNCATE TABLE distribution_jobs CASCADE;
TRUNCATE TABLE price_alerts CASCADE;
TRUNCATE TABLE integration_runs CASCADE;
TRUNCATE TABLE price_history CASCADE;
TRUNCATE TABLE candidates CASCADE;
TRUNCATE TABLE click_events CASCADE;
TRUNCATE TABLE offers CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE merchants CASCADE;

-- Opcional: Se quiser apagar também os perfis criados (exceto admins), execute:
-- DELETE FROM profiles WHERE role != 'admin';


-- ============================================================
-- PARTE 2: SCRIPT PARA ADICIONAR NOVAS CATEGORIAS E LOJAS PARCEIRAS
-- ============================================================

-- 1. Inserir Categorias Oficiais do ChameiApp
INSERT INTO categories (name, slug, description, icon) VALUES
('Tecnologia & Informática', 'tecnologia', 'Smartphones, notebooks, hardware, monitores e periféricos.', 'laptop'),
('Ferramentas & Construção', 'ferramentas', 'Parafusadeiras, furadeiras, kits manuais e medição.', 'wrench'),
('Casa & Cozinha', 'casa-e-cozinha', 'Eletroportáteis, cafeteiras, robôs aspiradores e utensílios.', 'home'),
('Eletrônicos & Games', 'eletronicos-e-games', 'Consoles, controles, headsets, jogos e áudio.', 'gamepad'),
('Automotivo', 'automotivo', 'Acessórios automotivos, óleos, ferramentas veiculares e som.', 'car'),
('Esporte & Lazer', 'esporte-e-lazer', 'Equipamentos esportivos, suplementos e itens ao ar livre.', 'activity')
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 2. Inserir Lojas Parceiras Oficiais
INSERT INTO merchants (name, slug, domain, logo_url) VALUES
('Amazon Brasil', 'amazon', 'amazon.com.br', 'https://m.media-amazon.com/images/G/32/social_share/amazon_logo._CB633266945_.png'),
('Mercado Livre', 'mercado-livre', 'mercadolivre.com.br', 'https://http2.mlstatic.com/frontend-assets/ui-navigation/5.21.22/mercadolibre/logo__large_plus.png')
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, domain = EXCLUDED.domain;
