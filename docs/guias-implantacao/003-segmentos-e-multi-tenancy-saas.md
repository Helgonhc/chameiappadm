# Guia de Implantação: Segmentos Técnicos e Multi-Tenancy (SaaS)

Este documento descreve as etapas necessárias para implementar e configurar o módulo de Segmentos Técnicos e a estrutura Multi-Tenant (SaaS) no ChameiApp.

## 1. Configuração do Banco de Dados (Supabase)

Você deve executar os seguintes scripts SQL no seu **SQL Editor** do Supabase para criar a estrutura necessária:

### Passo Zero: Criar a Base Multi-Tenant (OBRIGATÓRIO)
O erro que você recebeu ocorre porque o sistema precisa da coluna `organization_id`. Execute o script abaixo primeiro:
- Script: `backend/database/SAAS_CORE.sql`
- **O que ele faz:** Cria a tabela de organizações, adiciona a coluna `organization_id` em todas as tabelas (incluindo `profiles`) e configura as organizações padrão.

### Passo A: Criar Tabela de Leads
Execute o script em: `backend/database/CRIAR_TABELA_LEADS_SAAS.sql`
- Isso cria a tabela `leads` para capturar interessados na Landing Page.
- Adiciona suporte a `organization_id`.

### Passo B: Criar Tabelas de Segmentos
Execute o script em: `backend/database/CRIAR_TABELA_SEGMENTOS_SAAS.sql`
- Cria as tabelas `technical_segments` (Setores como Ar Condicionado, TI, etc) e `technician_segments` (Link entre técnico e setor).
- Configura permissões RLS automáticas por organização.

### Passo C: Blindagem de Segurança (POLÍTICAS RLS)
Execute o script em: `backend/database/SAAS_POLICIES.sql`
- **IMPORTANTE:** Este script aplica o isolamento de dados em TODAS as tabelas core (Clientes, OS, Chamados, Equipamentos).
- Garante que uma empresa nunca veja os dados de outra.

## 2. Instalação de Dependências

Se você ainda não instalou o ambiente de desenvolvimento local, certifique-se de ter o Node.js e Python configurados:

1. **Frontend:**
   ```bash
   cd admin-portal-main
   npm install
   ```
2. **IPython (Opcional - para scripts administrativos):**
   ```bash
   pip install ipython
   ```

## 3. Guia de Uso no Dashboard

### Gerenciando Segmentos
1. Vá em **Configurações (Settings)**.
2. Clique na aba **Segmentos**.
3. Adicione os setores que sua empresa atende (ex: Elétrica, Hidráulica, Climatização).

### Vinculando Técnicos
1. Vá em **Usuários**.
2. Clique em **Novo Usuário** ou **Editar** um usuário com cargo de **Técnico**.
3. Você verá uma nova seção no final do formulário chamada **"Segmentos de Atuação"**.
4. Selecione as especialidades deste técnico e salve.

### Captura de Leads
- Acesse a Landing Page principal (`/`).
- O formulário "Solicitar Demonstração" agora envia os dados diretamente para a tabela `leads` no banco de dados.

## 4. Estrutura Técnica (Arquivos Relevantes)
- `app/dashboard/settings/page.tsx`: Interface de gestão de segmentos.
- `app/dashboard/users/page.tsx`: Interface de associação de técnicos.
- `app/page.tsx`: Integração da Landing Page com banco.
- `frontend/types/index.ts`: Atualização dos tipos TypeScript para suporte SaaS.

---
*Gerado por Antigravity em 05/02/2026. Prioridade: Alta.*
