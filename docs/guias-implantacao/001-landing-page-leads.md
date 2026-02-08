# Guia de Implantação: Landing Page v3 & Captura de Leads

Este documento detalha as mudanças realizadas na vitrine do ChameiApp para habilitar a captura de leads e precificação.

## 1. Funcionalidades Implementadas
- **Captura de Leads (Modal):** Formulário integrado para coleta de Nome, WhatsApp e Ramo.
- **Ecossistema Chamei (Módulos):** Nova seção Grid visual listando Dashboard, Clientes, Equipamentos (QR Code), O.S., Chamados, Orçamentos, Agenda, Banco de Horas, Estoque, Chat, Notificações e Gestão.
- **Integração WhatsApp:** Botão flutuante e CTAs direcionados para atendimento humano.
- **Tabela de Preços:** Estrutura de planos Start (R$ 49,90), Pro (R$ 149,90) e Enterprise (R$ 349,90).
- **FAQ Dinâmico:** Seção de dúvidas frequentes com animações suaves.

## 2. Estrutura Técnica
- **Arquivo Principal:** `app/page.tsx`
- **Componentes Lucide:** `ShieldCheck`, `MessageSquare`, `Zap`, `Loader2`.
- **Efeitos:** Tailwind CSS + Animações customizadas de Glassmorphism.

## 3. Manutenção e Próximos Passos
- **Link do WhatsApp:** Atualmente configurado para `https://wa.me/5531999999999`. Deve ser alterado para o número real de vendas no arquivo `app/page.tsx`.
- **Lógica de Trial:** O botão de liberação redireciona para `/login`. No futuro, podemos criar uma tabela `leads` no Supabase para salvar esses dados automaticamente.

---
*Gerado por Antigravity em 05/02/2026. Prioridade: Alta.*
