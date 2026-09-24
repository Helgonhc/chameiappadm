# CHAMEIAPP V2 — DIREÇÃO DE ARTE E DESIGN SYSTEM
## CHECKPOINT 2 — ESPECIFICAÇÃO DE DESIGN EDITORIAL & COMPONENTES

---

### 1. CONCEITO VISUAL E IDENTIDADE DA MARCA
O **CHAMEIAPP V2** adota a direção de arte de **E-COMMERCE EDITORIAL + PORTAL DE OFERTAS + RADAR DE PREÇOS**.
A sensação visual prioriza a utilidade, velocidade de descoberta e autoridade de dados reais.

#### O que NÃO é o CHAMEIAPP:
- NÃO é uma landing page de SaaS corporativo.
- NÃO possui gradientes roxos genéricos ou glassmorphism.
- NÃO possui blocos de texto "Como funciona em 3 passos" ou depoimentos fictícios.
- NÃO usa botões arredondados em estilo aplicativo infantil.

#### O que É o CHAMEIAPP:
- Um portal visualmente denso, limpo e direto.
- O produto e o preço são os protagonistas absolutos desde a primeira dobra.
- Tipografia funcional focada na clareza de números, preços e percentuais de desconto.
- Sinalização visual proprietária para indicar quedas de preço e alertas ("Uai, baixou!", "Tá chamando atenção", "Bão de preço").

---

### 2. PALETA DE CORES PROPRIETÁRIA (DESIGN TOKENS)

| Categoria | Token CSS | Valor Hex / HSL | Aplicação Principal |
| :--- | :--- | :--- | :--- |
| **Brand Signal** | `--color-signal-primary` | `#F04438` | Badges de desconto, botões de oferta, alertas |
| **Brand Signal Dark**| `--color-signal-hover` | `#D92D20` | Hover de ações principais |
| **Editorial Navy** | `--color-editorial-main` | `#0F172A` | Títulos principais, header, badges de autoridade |
| **Editorial Text** | `--color-text-primary` | `#0F172A` | Texto corrido de altíssima legibilidade |
| **Editorial Muted**| `--color-text-muted` | `#64748B` | Timestamps, frete, preços anteriores |
| **Surface Background**|`--color-surface-bg` | `#F8FAFC` | Fundo geral da aplicação (Editorial Light) |
| **Card Surface** | `--color-card-bg` | `#FFFFFF` | Fundo dos cards de produto e containers |
| **Border Neutral** | `--color-border-subtle` | `#E2E8F0` | Linhas e divisórias limpas |
| **Success Accent** | `--color-success` | `#12B76A` | Badges de frete grátis e cupons válidos |
| **Amazon Accent** | `--color-amazon` | `#FF9900` | Tag oficial de origem Amazon |

---

### 3. TIPOGRAFIA & NUMERIA
- **Fonte Primária**: Sans-serif moderna e geométrica com numeração tabular (`font-variant-numeric: tabular-nums`).
- **Valores Monetários**: O cifrão `R$` e os numerais do preço atual possuem peso `700` ou `800` com espaçamento reduzido para destacar a oportunidade imediata.
- **Preço Anterior**: Texto riscado em tom neutro atenuado (`#94A3B8`).
- **Porcentagem de Desconto**: Badge com indicador visual de queda (`↓ XX%`) usando a cor de sinal da marca.

---

### 4. NAVEGAÇÃO & HEADER UTILITÁRIO

#### Desktop Layout:
- **Barra Superior Utilitária**: Tag de rastreio oficial (`Amazon Associados`), atalhos diretos para Categorias, Cupons e Ferramentas.
- **Header Principal**:
  - Logo proprietária **CHAMEIAPP**.
  - **Barra de Busca Protagonista**: Input largo com atalhos de teclado e filtros instantâneos.
  - Botão de acesso ao "Me chama quando baixar" e painel.

#### Mobile Layout:
- Busca fixada ou com destaque no topo para uso rápido com apenas uma mão.
- Atalhos em chips roláveis horizontalmente com as principais categorias (`Tecnologia`, `Ferramentas`, `Casa`, `Games`).

---

### 5. ESPECIFICAÇÃO DOS CARDS DE OFERTA

#### A. `OfferCardStandard`
Card vertical padrão para grids de categoria e Home.
- **Dimensões**: Proporcionalidade limpa (280px a 340px).
- **Conteúdo**:
  - Tag da loja (`Amazon`).
  - Badge de desconto (`↓ 34%`).
  - Imagem do produto em container quadrado sem distorção (`object-fit: contain`).
  - Título limpo (máx. 2 linhas com ellipsis).
  - Preço anterior riscado + Preço atual em destaque.
  - Cupom de desconto (quando existente).
  - Timestamp de atualização real ("Atualizado há 12 min").
  - Botão CTA `[ VER OFERTA ]`.

#### B. `OfferCardCompact`
Card horizontal reduzido para listagens densas e telas mobile pequenas.
- Layout em linha (imagem à esquerda, dados e preço à direita).

#### C. `OfferCardFeature`
Destaque editorial para a principal oferta real do dia.
- Container amplo com fundo sutil editorial, nota explicativa humana ("Por que chamou atenção") e especificações diretas.

#### D. `OfferRow`
Layout de tabela ou lista expandida para comparadores e busca.

#### E. `OfferFlash`
Card compacto com contorno em destaque para ofertas detectadas recentemente pelo Radar com alto score.

---

### 6. ESTADOS OBRIGATÓRIOS DA INTERFACE
1. **Loading / Skeleton**: Skeletons limpos sem animações intrusivas.
2. **Empty State**: Exibição elegante quando nenhuma oferta corresponder ao filtro, sugerindo busca por novos termos.
3. **Offline / Unreachable Integration**: Mensagem transparente informando a indisponibilidade temporária de conectores sem mascaramento.
4. **Expired Offer**: Badge visual de "Oferta Expirada" impedindo direcionamentos frustrantes.

---

### 7. ACESSIBILIDADE E PERFORMANCE
- **Contraste WCAG 2.2 AA**: Garantido em todos os botões e textos de preço (mínimo 4.5:1).
- **Foco de Teclado**: Anéis de foco visíveis em todos os campos de busca, botões e links.
- **Performance**: Zero dependência de bibliotecas de animação pesadas. CSS puramente acelerado por GPU.
