# PRECIM — Direção de Arte & Sistema Visual (Checkpoint 2)

> **Status:** Checkpoint 2 — Entregue para Validação  
> **Data:** Setembro de 2026  
> **Projeto:** Portal Real de Ofertas e Afiliados  

---

## 1. Conceito da Identidade Visual

O **PRECIM** une o calor da acolhida mineira à agilidade da tecnologia digital contemporânea. A identidade visual reflete o conceito de **"descoberta de oportunidade com simplicidade"**.

- **Símbolo / Isotipo:** Uma composição geométrica estilizada em formato de vetor contínuo que funde as linhas sutis das montanhas de Minas Gerais com uma seta descendente de queda de preço (desconto).
- **Wordmark:** Logotipo tipográfico em caixa alta/baixa com kerning personalizado, cantos levemente suavizados e um detalhe geométrico no ponto da letra "i" em formato de losango/triângulo descendente.
- **Assinatura / Tagline:** `"Uai, achamos um precim bão."`

---

## 2. Tipografia

Para garantir máxima legibilidade em dispositivos móveis, carregamento ultra-rápido e personalidade marcante sem recorrer a fontes genéricas batidas:

| Aplicação | Família Tipográfica | Peso | Justificativa |
| :--- | :--- | :--- | :--- |
| **Headings / Títulos** | `Plus Jakarta Sans` | Bold (700) / SemiBold (600) | Moderna, geométrica, com traços limpos e toque contemporâneo. |
| **Corpo de Texto / UI** | `Plus Jakarta Sans` | Regular (400) / Medium (500) | Excelente legibilidade em telas pequenas e densas. |
| **Valores & Preços** | `JetBrains Mono` ou `Space Grotesk` | Bold (700) | Numerais de largura tabular que destacam valores e descontos. |
| **Tags & Badges** | `Plus Jakarta Sans` | Bold (700) - Uppercase | Máximo impacto em pequenas dimensões com `letter-spacing: 0.05em`. |

---

## 3. Paleta de Cores (Tokens CSS)

A paleta de cores é inspirada na natureza e arquitetura histórica de Minas Gerais, adaptada para alto contraste em interfaces digitais (WCAG AA).

```css
/* Tokens de Cores Centralizados */
:root {
  /* Brand Primary - Verde Relevo (Florestas e Montanhas) */
  --color-brand-primary-900: #0D281F;
  --color-brand-primary-800: #143D30;
  --color-brand-primary-700: #1B4D3E; /* Cor Principal da Marca */
  --color-brand-primary-600: #256B57;
  --color-brand-primary-100: #E6F2EE;

  /* Brand Accent - Ocre Ouro (Preço, Oportunidade e Riqueza) */
  --color-brand-accent-600: #B45309;
  --color-brand-accent-500: #D97706; /* Cor de Preço e Destaques */
  --color-brand-accent-400: #F59E0B;
  --color-brand-accent-100: #FEF3C7;

  /* Neutros - Pedra e Névoa */
  --color-neutral-900: #111827; /* Texto Principal */
  --color-neutral-700: #374151; /* Texto Secundário */
  --color-neutral-500: #6B7280; /* Muted / Bordas */
  --color-neutral-200: #E5E7EB; /* Divisores */
  --color-neutral-100: #F3F4F6; /* Background de Cards */
  --color-neutral-50:  #F9FAFB; /* Background da Página */
  --color-white:       #FFFFFF;

  /* Status Semânticos das Ofertas */
  --color-offer-active:  #059669; /* Verde Sucesso / Ativa */
  --color-offer-coupon:  #7C3AED; /* Roxo Cupom */
  --color-offer-expired: #9CA3AF; /* Cinza Expirado */
  --color-offer-alert:   #DC2626; /* Vermelho Desconto Alto */
}
```

---

## 4. Grid, Layout & Responsividade (Breakpoints)

O layout é desenhado especificamente para telas de dispositivos móveis reais usados no Brasil (WhatsApp/Instagram referral links) até monitores ultra-wide:

- **360px:** Dispositivos móveis compactos (Androids de entrada) — Margens laterais de 12px.
- **390px / 430px:** iPhones e Androids modernos — Margens laterais de 16px.
- **768px:** Tablets e telas dobráveis — Grid de 2 colunas de ofertas.
- **1024px:** Laptops / Desktops compactos — Grid de 3 colunas de ofertas.
- **1440px:** Desktops e monitores grandes — Grid de 4 colunas de ofertas com container máximo de `1280px`.

---

## 5. Elemento Proprietário: Marker PRECIM

O **Marker PRECIM** é o selo visual exclusivo utilizado para indicar ofertas reais validadas e descontos verificados.

```
       /\
      /  \       <- Linha Superior (Topografia / Montanha)
     /    \
    /______\
       ||        <- Marcador Descendente (Indica "Preço Baixo / Queda")
       \/
```

### Especificação do Marker:
- Formato: Badge trapezoidal/triangular dinâmico com gradiente de relevo e bordas nítidas de 4px.
- Aplicação: Presente no canto superior esquerdo de todos os `OfferCards`, na tag de destaque da Home e como elemento decorativo de apoio no Header.

---

## 6. Especificação dos OfferCards

Existem três variantes de cards de oferta, cada uma projetada para um contexto específico na hierarquia da página:

```
+-----------------------------------------------------------------------+
| 1. OfferCardFeatured (Card de Destaque Hero / Topo da Vitrine)       |
| +-------------------------+ +---------------------------------------+ |
| | Imagem Real do Produto  | | [Marker PRECIM]  [Loja: Mercado Livre]| |
| | (Max 320x320px)         | | Título Real do Produto                | |
| |                         | | R$ 1.499,00   R$ 1.999,00 (-25%)       | |
| |                         | | [Cupom: PRECIM10] [Frete Grátis]      | |
| |                         | | [ Button: Ver oferta na loja -> ]     | |
| +-------------------------+ +---------------------------------------+ |
+-----------------------------------------------------------------------+

+-------------------------------------+  +-------------------------------------+
| 2. OfferCardStandard (Grade Padrao)|  | 3. OfferCardCompact (Listas/Lateral)|
| +---------------------------------+ |  | +-------+ +-----------------------+ |
| | Imagem do Produto (Aspect 4:3)  | |  | | Imagem  | | Título Curto          | |
| +---------------------------------+ |  | | (80x80) | | R$ 49,90 (-15%)       | |
| | Loja: Amazon                     | |  | +-------+ | [Ver na loja]         | |
| | Título do Produto                | |  |           +-----------------------+ |
| | R$ 299,90  R$ 399,90 (-25%)       | |  +-------------------------------------+
| | [ Button: Ver oferta na loja ]   | |
| +---------------------------------+ |
+-------------------------------------+
```

---

## 7. Header (Desktop & Mobile)

- **Desktop (>= 1024px):**
  - **Lado Esquerdo:** Brand Logo ("PRECIM" em Verde Relevo com Marker SVG) + Tagline sutil.
  - **Centro:** Campo de busca funcional com ícone de lupa e atalho por teclado (`ctrl + k`).
  - **Lado Direito:** Links de navegação estáticos (`Ofertas`, `Categorias`, `Como Funciona`, `Sobre`).
- **Mobile (< 1024px):**
  - **Linha Superior:** Logo centralizado + Botão de Busca expansível + Botão de Menu Hamburguer.
  - **Linha Inferior (Barra de Acesso Rápido):** Chips deslizantes horizontais com as principais categorias (`Tecnologia`, `Ferramentas`, `Games`, `Casa & Cozinha`).

---

## 8. Experiência Mobile-First

- **Área de Toque Mínima:** Todos os botões e links de CTA possuem altura mínima de `48px` para evitar cliques acidentais.
- **Preço Visível sem Rolagem:** Em telas de 360px a 430px, o preço da oferta principal aparece imediatamente visível acima da dobra.
- **Bottom Navigation Sheet (Menu Mobile):** O menu em telas pequenas abre como um painel deslizante a partir do fundo da tela (*Sheet*), oferecendo ergonomia natural para o polegar.

---

## 9. Wireframe da Home (Desktop)

```
================================================================================
 [HEADER]  PRECIM (Logo) | [ Campo de Busca ] | Ofertas | Categorias | Sobre
================================================================================
 [HERO / BLOC EDITORIAL REDUZIDO]
  "Uai, achamos um precim bão."
  Ofertas selecionadas para você encontrar boas oportunidades sem perder tempo.
--------------------------------------------------------------------------------
 [SEÇÃO: DESTAQUE PRINCIPAL (Se existir oferta com featured=true)]
  +--------------------------------------------------------------------------+
  | [ OfferCardFeatured ] -> Exibe a oferta principal em destaque real       |
  +--------------------------------------------------------------------------+
--------------------------------------------------------------------------------
 [BARRA DE FILTROS & ORDENAÇÃO]
  Categorias: [Todas] [Tecnologia] [Ferramentas] [Games] [Casa] | Ordenar por: [Mais Recentes v]
--------------------------------------------------------------------------------
 [GRADE DE OFERTAS PÚBLICAS]
  +--------------------+  +--------------------+  +--------------------+
  | OfferCardStandard  |  | OfferCardStandard  |  | OfferCardStandard  |
  +--------------------+  +--------------------+  +--------------------+
  | OfferCardStandard  |  | OfferCardStandard  |  | OfferCardStandard  |
  +--------------------+  +--------------------+  +--------------------+
--------------------------------------------------------------------------------
 [BLOCO EDITORIAL / TRANSPARÊNCIA]
  "Como o PRECIM funciona? Selecionamos ofertas reais e direcionamos você..."
================================================================================
 [FOOTER]  Links Institucionais | Divulgação de Afiliados | LGPD | PRECIM 2026
================================================================================
```

---

## 10. Wireframe da Home (Mobile - 390px)

```
========================================
 [=]           PRECIM            [Q]
========================================
 [Chip: Todas] [Tecnologia] [Ferramentas] >
========================================
 "Uai, achamos um precim bão."
----------------------------------------
 [OF. DESTAQUE REAL]
 +------------------------------------+
 | Imagem Produto (Real)              |
 | Loja: Amazon                       |
 | Fone Bluetooth XYZ                 |
 | R$ 189,90  R$ 250,00 (-24%)        |
 | [ Button: Ver oferta na loja ]     |
 +------------------------------------+
----------------------------------------
 [OFERTAS RECENTES]
 +------------------------------------+
 | OfferCardStandard (Mobile)         |
 +------------------------------------+
 | OfferCardStandard (Mobile)         |
 +------------------------------------+
========================================
 [FOOTER COMPACTO & TRANSPARÊNCIA]
========================================
```

---

### Solicitação de Validação
O **Checkpoint 2 (Direção de Arte e Wireframes)** foi totalmente detalhado. Aguardo sua aprovação para iniciar o **Checkpoint 3 (Desenvolvimento Frontend)**.
