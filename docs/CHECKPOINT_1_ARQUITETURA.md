# CHAMEIAPP V2 — ARQUITETURA E ESPECIFICAÇÃO DE ENGENHARIA
## CHECKPOINT 1 — RELATÓRIO OFICIAL DE AUDITORIA & ARQUITETURA

---

### 1. ARQUITETURA ATUAL
A plataforma **CHAMEIAPP V1** opera sob o framework Next.js (App Router) com integração ao Supabase como camada de dados e autenticação.
- **Banco de Dados / ORM**: Supabase PostgreSQL gerido via RLS (Row Level Security).
- **Modelos Principais**: `offers`, `categories`, `merchants`, `click_events`, `profiles`.
- **Rotas Públicas**: Home `/`, Categoria `/c/[slug]`, Loja `/l/[slug]`, Oferta `/o/[slug]`, Redirecionamento seguro `/go/[offerId]`.
- **Rotas Administrativas**: `/admin`, `/admin/offers`, `/admin/categories`, `/admin/merchants`.
- **Segurança**: Validação de RLS com função SQL `is_admin()`, Server-side Middleware para rotas `/admin`, proteção contra Open Redirect via allowlist estrita de domínios HTTPS (`amazon.com.br`, `mercadolivre.com.br`, `amzn.to`).

---

### 2. O QUE SERÁ PRESERVADO
Toda a infraestrutura estável de backend e dados da V1 será integralmente preservada sem regressões:
- **Tabelas do Banco**: `offers`, `categories`, `merchants`, `click_events`, `profiles`.
- **Redirecionamento & Tracking**: Rota `/go/[offerId]` com contador assíncrono de cliques, captura de `user_agent`, `referer`, e validação estrita de URL.
- **Autenticação e RLS**: Função `is_admin()`, autenticação via Supabase Auth.
- **Segurança & Proteção contra Injeção**: Validação Zod schemas nas entradas de dados e `UUID_REGEX` nos identificadores.
- **SEO Base**: Métodos de geração de Sitemap, `robots.txt`, Open Graph e dados estruturados Schema.org.

---

### 3. O QUE SERÁ REMOVIDO
- **Códigos legados e nomenclaturas antigas**: Qualquer menção residual ao nome descontinuado ("PRECIM").
- **Componentes visuais rejeitados**: Cards visuais genéricos da V1, Hero SaaS com gradiente roxo, layouts baseados em landing page de software.
- **Estilos Globais V1 conflitantes**: Sub-componentes visuais com bordas genéricas arredondadas, dashboards fake ou contadores dinâmicos sem lastro em dados reais.

---

### 4. O QUE SERÁ REDESENHADO
- **Interface Pública (Frontend Completo)**:
  - **Identidade Visual**: Linguagem de E-commerce Editorial + Portal de Ofertas + Radar de Preços.
  - **Header & Navigation**: Busca utilitária como protagonista visual, menu com atalhos funcionais por categorias reais.
  - **Home**: Layout orientado a descobertas imediatas, sem blocos institucionais de preenchimento.
  - **Cards de Oferta**: Divisão funcional (`OfferCardStandard`, `OfferCardCompact`, `OfferCardFeature`, `OfferRow`, `OfferFlash`).
  - **Página de Oferta/Produto**: Foco na tomada de decisão (Preço, Desconto real, Cupom, Histórico real quando disponível, Nota editorial humana, Botão de Ação direto).
- **Painel Administrativo V2**:
  - Área **RADAR CHAMEI** para busca, análise e aprovação de candidatos.

---

### 5. NOVA ARQUITETURA CHAMEIAPP V2
A V2 introduz um pipeline de dados desacoplado em 5 camadas:

```
[ FONTES EXTERNAS ] (Amazon Creators API / Futuros Provedores)
         │
         ▼
[ CONNECTOR LAYER ] (AffiliateProductProvider Interface)
         │
         ▼
[ RADAR CHAMEI ] (Busca, Deduplicação & Captura de Produtos)
         │
         ▼
[ OFFER ANALYZER ] (Scoring Determinístico 0-100 sem IA paga)
         │
         ▼
[ FILA DE CANDIDATAS ] (Painel Admin: Discovered -> Candidate -> Approved)
         │
         ▼
[ PUBLICAÇÃO ] (Transição para Tabela 'offers' -> Home / SEO)
```

---

### 6. ARQUITETURA RADAR CHAMEI
O **Radar Chamei** é o motor interno de varredura e inteligência de oportunidades.
- Opera via `CandidateService` e `OfferAnalyzer`.
- Permite busca manual parametrizada via Admin (`/admin/radar`) e busca agendada controlada via `RadarScheduler`.
- Garante retenção de contexto, deduplicação em nível de provider + identificador externo e URL normalizada.

---

### 7. ARQUITETURA AMAZONCONNECTOR
- **Localização**: `lib/services/connectors/amazon/amazon-provider.ts`.
- **Integração Oficial**: Preparado exclusivamente para a **Amazon Creators API** / **PA-API 5.0**.
- **Regra Estrita**: ZERO Scraping via Cheerio/Puppeteer/Playwright. Zero bots mascarados.
- **Leitura de Credenciais**: Utiliza variáveis de ambiente restritas ao servidor (`AMAZON_API_CLIENT_ID`, `AMAZON_API_CLIENT_SECRET`, `AMAZON_ASSOCIATE_TAG=chameiapp-20`).
- **Estados**: `NOT_CONFIGURED` | `PENDING_ACCESS` | `READY` | `ERROR`.

---

### 8. INTERFACE AFFILIATEPRODUCTPROVIDER
Interface padronizada aplicando o **Adapter Pattern** (`lib/services/connectors/affiliate-provider.interface.ts`):
```typescript
export interface AffiliateProductProvider {
  readonly providerName: string;
  getStatus(): Promise<ProviderStatus>;
  searchProducts(query: string, options?: ProviderSearchOptions): Promise<ExternalProduct[]>;
  getProduct(externalId: string): Promise<ExternalProduct | null>;
  getOffers(options?: ProviderSearchOptions): Promise<ExternalProduct[]>;
  normalizeProduct(rawInput: unknown): ExternalProduct;
  healthCheck(): Promise<{ status: ProviderStatus; message: string; lastCheckedAt: string }>;
}
```

---

### 9. MODELO EXTERNALPRODUCT
Modelo agnóstico interno de representação de produtos capturados (`lib/types/radar.ts`):
```typescript
export interface ExternalProduct {
  provider: string; // 'amazon', 'mercado-livre'
  external_id: string; // ASIN ou ID do anúncio
  title: string;
  description?: string | null;
  image_url: string;
  product_url: string;
  affiliate_url?: string | null;
  current_price: number;
  previous_price?: number | null;
  currency: string; // 'BRL'
  coupon?: string | null;
  shipping?: string | null;
  free_shipping?: boolean;
  availability?: boolean;
  category?: string | null;
  seller?: string | null;
  last_checked_at: string;
  raw_metadata?: Record<string, unknown> | null;
}
```

---

### 10. FLUXO DE BUSCA
1. Operador aciona busca no Radar Admin ou o `RadarScheduler` executa rotina programada.
2. O `AmazonProvider` checa o estado das credenciais.
3. Se `NOT_CONFIGURED`: Retorna status informativo no painel e lista vazia `[]`. Zero produto fake.
4. Se `READY`: Realiza requisição autenticada à API oficial.
5. Os dados brutos retornados são normalizados para `ExternalProduct`.

---

### 11. FLUXO DE NORMALIZAÇÃO
- Remoção de querystrings irrelevantes ou maliciosas das URLs.
- Padronização monetária (transformação para float em BRL `current_price`).
- Extração de cupons e regras de frete.
- Sanitização de títulos e remoção de caracteres de controle.

---

### 12. DEDUPLICAÇÃO
A deduplicação é executada em 2 níveis no `CandidateService`:
- **Chave Composta**: `${provider}:${external_id}` (ex: `amazon:B0C39C9Z1Z`).
- **URL Normalizada**: Comparação pelo caminho base sem parâmetros de rastreio HTTP.
- Produtos duplicados são ignorados ou têm suas informações de preço atualizadas na fila existente, evitando duplicação de candidatas.

---

### 13. FLUXO CANDIDATE
Ciclo de vida do produto no Radar:
`discovered` ➔ `analyzing` ➔ `candidate` ➔ `approved` / `rejected` ➔ `published` / `expired`

---

### 14. OFFER ANALYZER (MOTOR DE SCORING)
- **Localização**: `lib/services/radar/offer-analyzer.ts`.
- **Princípio**: Motor de avaliação 100% determinístico baseado em regras quantitativas.
- **Gastos com IA**: Zero gastos (`AUTO_SPEND=false`).

---

### 15. MODELO DE SCORING (OFFER SCORE 0 A 100)
- **Discount Score (0 a 40 pts)**: Calculado pela porcentagem de queda de preço real em relação ao preço anterior validado.
- **Coupon Score (0 a 15 pts)**: Concedido se houver cupom de desconto verificado.
- **Freshness Score (0 a 15 pts)**: Recência da checagem (15 pts para < 1h; 10 pts para < 24h; 5 pts para > 24h).
- **Data Quality Score (0 a 15 pts)**: Presença de imagem em alta definição, título completo, link direto e categoria.
- **Availability & Shipping Score (0 a 15 pts)**: Disponibilidade em estoque (10 pts) + Frete grátis (5 pts).

---

### 16. PUBLICAÇÃO
1. O Operador revisa a candidata na fila `/admin/radar/candidatas`.
2. Adiciona dados editoriais (`why_it_called_attention`, `pros`, `attention_points`).
3. Ao clicar em **[Aprovar e Publicar]**, o sistema converte a `CandidateOffer` em um registro na tabela pública `offers` com `status: 'published'`.
4. A oferta passa a figurar instantaneamente no feed da Home, Categorias e Sitemap de SEO.

---

### 17. PRICE HISTORY (HISTÓRICO DE PREÇOS REAL)
- **Tabela**: `price_history`.
- **Regra do Histórico**: **ZERO BACKFILL FICTÍCIO**.
- Registra observações de preços **apenas** quando dados reais forem coletados pelo sistema.
- **Métricas Calculadas** (`PriceHistoryService`): Mínimo observado, Máximo observado, Média, Mediana, Variação percentual de queda.

---

### 18. SCHEDULER (RADAR SCHEDULER)
- Responsável por agendar execuções periódicas de busca do Radar.
- Implementa **Rate Limiting**, **Exponential Backoff**, **Retries** e **Deduplicação**.
- Armazena logs de execução em `integration_runs`.

---

### 19. INTEGRATION RUNS
Tabela de telemetria e auditoria de integrações:
- `id`, `provider`, `started_at`, `finished_at`, `status` (`running` | `success` | `failed` | `rate_limited`), `items_fetched`, `items_created`, `items_updated`, `error_summary`.

---

### 20. FUTURA DISTRIBUTION QUEUE (REDES & COMUNIDADES)
- **Tabela**: `distribution_jobs`.
- **Status Inicial**: Inativo no Checkpoint 1.
- Projetado para suportar envios futuros para Telegram, WhatsApp e Instagram sem automações proibidas por navegadores headless.

---

### 21. SEGURANÇA
- **Credenciais**: Apenas variáveis de ambiente server-side. Zero vazamento no bundle cliente.
- **RLS no Supabase**: Políticas restritas via `is_admin(auth.uid())`.
- **Open Redirect Protection**: Allowlist rigorosa de domínios HTTPS permitidos (`amazon.com.br`, `mercadolivre.com.br`, `amzn.to`).
- **Validação de Inputs**: Zod schemas em todas as entradas de API.

---

### 22. MUDANÇAS DE BANCO DE DADOS
Adição de 5 novas tabelas no Supabase mantendo as tabelas V1 intactas:
1. `candidates` (Fila do Radar)
2. `price_history` (Histórico real de preços)
3. `integration_runs` (Logs de execuções do Radar)
4. `price_alerts` (Arquitetura "Me chama quando baixar")
5. `distribution_jobs` (Fila de distribuição futura)

---

### 23. MIGRATIONS NECESSÁRIAS
Arquivo SQL completo disponibilizado em `docs/SUPABASE_SCHEMA_V2.sql` pronto para aplicação no Supabase SQL Editor.

---

### 24. NOVAS ROTAS ADMINISTRATIVAS V2
- `/admin/radar`: Painel do Radar Chamei (Busca manual e Status dos Provedores).
- `/admin/radar/candidatas`: Fila de aprovação e gerenciamento de candidatas.
- `/admin/integracoes`: Monitoramento de saúde e credenciais das integrações.

---

### 25. NOVOS SERVIÇOS V2
- `AmazonProvider` (`lib/services/connectors/amazon/amazon-provider.ts`)
- `MercadoLivreProvider` (`lib/services/connectors/mercado-livre/mercado-livre-provider.ts`)
- `OfferAnalyzer` (`lib/services/radar/offer-analyzer.ts`)
- `CandidateService` (`lib/services/radar/candidate.service.ts`)
- `PriceHistoryService` (`lib/services/radar/price-history.service.ts`)

---

### 26. COMPONENTES QUE SERÃO DESCARTADOS
- `Header` e `Footer` visuais da V1.
- `OfferCard` único e genérico da V1.
- Layouts de grid estáticos de landing page SaaS.

---

### 27. COMPONENTES PRESERVADOS
- Infraestrutura de banco `lib/db/supabase.ts`.
- `TrackingService` (`lib/services/tracking.service.ts`).
- Validações de helpers de desconto (`lib/utils/offer-helpers.ts`).
- Lógica de autorização e verificação de perfil admin.

---

### 28. RISCOS DA INTEGRAÇÃO AMAZON & MITIGAÇÃO
- **Risco**: Falta de elegibilidade inicial ou ausência das credenciais da API de Criadores / PA-API.
- **Mitigação**: O sistema utiliza o estado `NOT_CONFIGURED`. O Radar não quebra, exibe aviso claro e permite o cadastro de Links Especiais ou produtos manuais reais pelo administrador.

---

### 29. COMPORTAMENTO SEM API DA AMAZON
- A aplicação **NÃO** exibe produtos falsos nem simula chamadas à API.
- O painel exibe o status `NOT_CONFIGURED` com mensagem explicativa.
- As telas públicas exibem o estado real do banco de dados (se houver ofertas publicadas, exibe-as; caso contrário, exibe estado `empty` limpo).

---

### 30. PLANO DETALHADO DOS PRÓXIMOS CHECKPOINTS

- **CHECKPOINT 2 — DIREÇÃO DE ARTE & DESIGN SYSTEM V2**:
  - Definir paleta de cores harmoniosa e proprietária para o CHAMEIAPP.
  - Selecionar tipografia moderna otimizada para mobile e números/preços.
  - Criar o arquivo de tokens globais de design em CSS Vanilla.

- **CHECKPOINT 3 — REDESIGN FRONTEND PÚBLICO**:
  - Implementar Header utilitário com busca protagonista.
  - Implementar a nova Home editorial focada na descoberta imediata de produtos.
  - Desenvolver a família de cards (`OfferCardStandard`, `OfferCardCompact`, `OfferCardFeature`, `OfferRow`, `OfferFlash`).
  - Reformular a página de detalhes da oferta `/o/[slug]`.

- **CHECKPOINT 4 — INTERFACE RADAR CHAMEI NO ADMIN**:
  - Construir as páginas `/admin/radar` e `/admin/radar/candidatas`.
  - Conectar com os serviços de `CandidateService` e `OfferAnalyzer`.

- **CHECKPOINTS 5 A 10 — INTEGRAÇÕES, REGRAS, HISTÓRICO, QA E PRODUÇÃO**:
  - Validar conectores com credenciais reais da Amazon.
  - Testar fluxo completo da busca à publicação com ofertas de teste reais.
  - Realizar baterias de testes E2E e validações finais de segurança antes de conectar o domínio de produção.

---

### STATUS DO CHECKPOINT 1
- **Compilação TypeScript**: 100% OK (`npm run typecheck` sem erros).
- **Testes Automatizados**: 27/27 testes aprovados (`npm test`).
- **Nenhum Dado Fictício**: Zero mock, zero produtos hardcoded.
- **Próxima Ação**: **PAUSADO**. Aguardando aprovação humana para iniciar o Checkpoint 2.
