# Guia de Implantação: Identidade Visual e Navegação Pro (v4)

Este documento detalha a padronização da marca ChameiApp e a implementação da navegação de site na vitrine.

## 1. Identidade de Logomarca
- **Símbolo:** Ícone `Zap` (Raio) centralizado em um quadrado rotacionado 45° (estilo losango).
- **Cores:** Emerald-500 (#10b981) com opacidade 20% no fundo do símbolo.
- **Tipografia:** Texto "ChameiApp" em Itálico, Black, com Tracking Tighter.
- **Slogan:** "Industrial Intelligence" em fonte minúscula (6px-7px) com tracking super espaçado (3px).

## 2. Navegação por Âncoras (Landing Page)
- **Implementação:** Navbar fixa com efeito backdrop-blur e transição de scroll.
- **Seções Mapeadas:**
  - `#recursos`: Grade de 12 módulos operacionais.
  - `#como-funciona`: Stepper de 3 passos (Agende, Execute, Envie).
  - `#preços`: Tabela de precificação (Start, Professional, Business).
  - `#faq`: Accordion de dúvidas frequentes.
- **Smooth Scroll:** Lógica de offset (80px) para compensar a altura da Navbar fixa durante o scroll.

## 3. Login Cyber-Tech Elite
- **Estética:** Split-screen imersivo com fundo escuro (#020617) e visual de Terminal Industrial.
- **Componentes Tech:** Cards de status em tempo real (fictícios para UX), selos de segurança e métricas de confiança.
- **Animações:** Lógica `animate-slideLeft` e `animate-fadeInUp` aplicada aos elementos de marca e formulário, configuradas via `tailwind.config.js`.
- **Inputs:** Labels renomeados para "Terminal ID" e "Access Token" para reforçar a seriedade tecnológica.
