# 🧠 MEMÓRIA DE PROGRESSO E RESTART — CHAMEIAPP V2

> **Data de Atualização**: 25 de Setembro de 2026  
> **Status Geral**: 🟢 Sistema Estável | 29/29 Testes Aprovados | TypeScript 0 Erros | Código Sincronizado no GitHub (`origin/main`)

---

## 📌 RESUMO EXECUTIVO DO PROJETO

O **CHAMEIAPP V2** é uma plataforma de automação de ofertas de afiliados (Mercado Livre + Amazon Brasil) de alta performance, integrada ao Supabase, IA da NVIDIA NIM (Llama 3.3 70B) e suporte a radar autônomo.

---

## 🛠️ PRINCIPAIS RECURSOS E CORREÇÕES IMPLEMENTADAS

### 1. 🖼️ Galeria Multi-Imagem sem Duplicação
- **Arquivo**: [`lib/utils/image-helpers.ts`](file:///d:/Grupimho%20de%20Ofertas/lib/utils/image-helpers.ts)
- **Implementação**:
  - Reconhece a assinatura numérica de assets da CDN do Mercado Livre (`mlstatic`) e gera URLs sequenciais das fotos reais enviadas pelo vendedor (`numId + 1`, `numId + 2`, `numId + 3`).
  - Extrai variações de ângulos oficiais da Amazon via ASIN (`PT01`, `PT02`, `PT03`, `MAIN`).
  - Garante **3 a 6 fotos de alta resolução distintas** por oferta, sem repetir URLs.

### 2. 🏷️ Formatação Padrão de Moeda em PT-BR (BRL)
- **Arquivo**: [`lib/utils/offer-helpers.ts`](file:///d:/Grupimho%20de%20Ofertas/lib/utils/offer-helpers.ts)
- **Implementação**:
  - Função `formatCurrencyBRL(amount)` aplicada em todo o sistema.
  - Exibe valores com símbolo `R$` e centavos separados por vírgula (ex: `R$ 350,00` e `R$ 2.999,00`).
  - Aplicado nas telas de Radar Admin ([`app/admin/radar/page.tsx`](file:///d:/Grupimho%20de%20Ofertas/app/admin/radar/page.tsx)), Candidatas ([`app/admin/radar/candidatas/page.tsx`](file:///d:/Grupimho%20de%20Ofertas/app/admin/radar/candidatas/page.tsx)), Meta-Tags OpenGraph ([`app/(public)/ofertas/[slug]/page.tsx`](file:///d:/Grupimho%20de%20Ofertas/app/(public)/ofertas/[slug]/page.tsx)) e nos logs do robô.

### 3. 📂 Detecção Inteligente de Categorias
- **Arquivo**: [`lib/services/ai/category-detector.service.ts`](file:///d:/Grupimho%20de%20Ofertas/lib/services/ai/category-detector.service.ts)
- **Mapeamentos Adicionados**:
  - Câmeras IP / Segurança ICSee -> `Casa Inteligente`
  - Som Automotivo / Multimídia 2 Din / MP5 -> `Automotivo`
  - Power Banks / Baterias Externas -> `Celulares e Acessórios`
  - Ferramentas Elétricas (motosserra, esmerilhadeira) -> `Ferramentas e Construção`
  - Moda (short, polo, calça) -> `Moda`
- **Fallback de Categoria**: Alterado de "Alimentos e Bebidas" para **"Eletrônicos e TVs"** (`cat-14-eletronicos-e-tvs`).

### 4. ⚡ Robô Autônomo e População das 24 Categorias
- **Arquivo**: [`lib/services/bot/auto-publisher.service.ts`](file:///d:/Grupimho%20de%20Ofertas/lib/services/bot/auto-publisher.service.ts)
- **Recursos**:
  - Mapeamento de palavras-chave para todas as 24 categorias do portal.
  - Script de população em lote ([`scratch/seed-categories.ts`](file:///d:/Grupimho%20de%20Ofertas/scratch/seed-categories.ts)) para buscar e cadastrar pelo menos 10 produtos autênticos por categoria.

### 5. 🔑 Solução de Permissão RLS no Supabase (`permission denied`)
- **Arquivos**:
  - [`lib/db/supabase.ts`](file:///d:/Grupimho%20de%20Ofertas/lib/db/supabase.ts): Exporta `supabaseAdmin` utilizando a `SUPABASE_SERVICE_ROLE_KEY`.
  - [`lib/services/offer.service.ts`](file:///d:/Grupimho%20de%20Ofertas/lib/services/offer.service.ts): Utiliza o cliente `supabaseAdmin` em operações de escrita (`createOffer`, `updateOffer`, `deleteOffer`).
  - [`docs/FIX_SUPABASE_PERMISSIONS.sql`](file:///d:/Grupimho%20de%20Ofertas/docs/FIX_SUPABASE_PERMISSIONS.sql): Script SQL para liberação de RLS no Dashboard Supabase.

### 6. 💰 Calculadora de Comissão Estimada
- **Arquivo**: [`lib/services/radar/offer-analyzer.ts`](file:///d:/Grupimho%20de%20Ofertas/lib/services/radar/offer-analyzer.ts)
- **Implementação**:
  - Calcula a estimativa de comissão (em R$ e %) por marketplace (Amazon ~9%, Mercado Livre ~11%).
  - Atribui `commission_score` e lista os motivos de rentabilidade para o parceiro.

---

## 📜 SCRIPT SQL PARA O SUPABASE (LEMBRETE DE EXECUÇÃO)

Caso receba aviso de permissão no painel do Supabase, execute o código no [SQL Editor do Supabase](https://supabase.com/dashboard/project/ycssbfzfrcfxpbsdlzkq/sql/new):

```sql
GRANT ALL ON TABLE public.offers TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.categories TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.merchants TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.candidates TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.click_events TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.price_history TO anon, authenticated, service_role;

GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access offers" ON public.offers;
CREATE POLICY "Allow all access offers" ON public.offers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access categories" ON public.categories;
CREATE POLICY "Allow all access categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access merchants" ON public.merchants;
CREATE POLICY "Allow all access merchants" ON public.merchants FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all access candidates" ON public.candidates;
CREATE POLICY "Allow all access candidates" ON public.candidates FOR ALL USING (true) WITH CHECK (true);
```

---

## 🧪 STATUS DE TESTES E COMPILAÇÃO

- **TypeScript Typecheck**: `npm run typecheck` ➔ **0 erros**.
- **Testes Unitários**: `npm test` ➔ **29/29 suítes de testes aprovadas**.
- **Repositório Git**: Commits sincronizados na branch `main` do GitHub (`origin/main`).

---

## 🏁 INSTRUÇÕES PARA CONTINUAR A QUALQUER MOMENTO

1. Abra a workspace em `d:\Grupimho de Ofertas`.
2. O servidor de desenvolvimento Next.js pode ser iniciado com `npm run dev`.
3. Todos os arquivos de memória e regras de negócio estão registrados neste documento.
