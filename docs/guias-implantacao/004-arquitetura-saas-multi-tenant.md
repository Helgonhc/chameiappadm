# Arquitetura Multi-Tenant (SaaS) no ChameiApp

Este documento explica como o ChameiApp isola os dados de diferentes empresas de forma automática e segura, permitindo que o mesmo aplicativo atenda milhares de clientes independentes.

## 1. O Conceito: Shared Database, Isolated Schema
O ChameiApp utiliza a estratégia de **Banco de Dados Compartilhado com Isolamento via Row Level Security (RLS)**.

### A Chave Mestra: `organization_id`
Todas as tabelas do sistema (Clientes, Chamados, OS, Equipamentos, etc.) possuem uma coluna chamada `organization_id`. 
- Quando a Empresa A cadastra um cliente, ele recebe o `organization_id` da Empresa A.
- Quando a Empresa B acessa o painel, o banco de dados filtra automaticamente para mostrar apenas o que pertence à Empresa B.

## 2. Como o Isolamento é Automático? (RLS)
Nós não dependemos apenas do código do frontend para filtrar os dados. Usamos o **Row Level Security (RLS)** do PostgreSQL (Supabase).

**Exemplo de Regra (Política):**
```sql
CREATE POLICY "Isolamento por Empresa" 
ON public.chamados 
FOR SELECT 
USING (organization_id = (SELECT organization_id FROM public.profiles WHERE id = auth.uid()));
```
*Tradução: "O banco de dados só entregará as linhas onde o ID da organização do registro seja igual ao ID da organização do usuário logado."*

## 3. Fluxo de Cadastro de Nova Empresa
Quando uma nova pessoa cadastra sua empresa:
1. Criamos um registro na tabela `organizations`.
2. Criamos o usuário na tabela `auth.users`.
3. Vinculamos esse usuário à organização recém-criada na tabela `profiles`.
4. **Pronto!** A partir desse momento, qualquer dado que esse usuário criar será carimbado com o ID da empresa dele.

## 4. O que precisamos fazer em cada menu?
Para que todos os menus integrem o banco de dados corretamente:

1. **Audit de Tabelas:** Garantir que TODAS as tabelas tenham a coluna `organization_id` (O script `SAAS_CORE.sql` já faz boa parte disso).
2. **Regras de RLS:** Aplicar as políticas de segurança em todas as tabelas.
3. **Frontend:** Garantir que o `useAuthStore` do sistema saiba qual é a `organization_id` do usuário logado para carimbar novos registros.

## 5. Próximos Passos Prioritários
- [ ] Aplicar RLS em tabelas legadas (Service Orders, Equipments).
- [ ] Refinar o Dashboard para mostrar métricas exclusivas da empresa logada.
- [ ] Implementar o fluxo de "Auto-Onboarding" (onde o próprio usuário cria sua org).

---
*Documento de alinhamento técnico - ChameiApp SaaS.*
