-- ============================================================
-- CHAMEIAPP V2 — SCRIPT SUPREMO DE DESTRUIÇÃO / LIMPEZA COMPLETA
-- ATENÇÃO: ESTE SCRIPT APAGA TUDO NO SCHEMA PUBLIC SEM DEIXAR NENHUM VESTÍGIO
-- (Tabelas, views, triggers, funções, enums, sequências, políticas RLS anteriores)
-- ============================================================

-- 1. DESTRUIR O SCHEMA PUBLIC E TUDO DENTRO DELE
DROP SCHEMA public CASCADE;

-- 2. RECRIAR O SCHEMA PUBLIC TOTALMENTE LIMPO (ZERADO DO ZERO)
CREATE SCHEMA public;

-- 3. RESTAURAR AS PERMISSÕES PADRÃO DO SUPABASE
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

COMMENT ON SCHEMA public IS 'standard public schema';
