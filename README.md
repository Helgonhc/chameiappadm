
# 🔧 Portal Admin - Sistema de Gestão

Portal web completo para administradores e técnicos com todas as funcionalidades do aplicativo mobile.

## ✨ Funcionalidades

- 📊 **Dashboard** - Visão geral do sistema
- 👥 **Clientes** - Cadastro e gestão de clientes
- 🔧 **Equipamentos** - Controle de equipamentos com QR Code
- 📋 **Ordens de Serviço** - Criação e acompanhamento de OS
- 🎫 **Chamados** - Sistema de tickets/chamados
- 💰 **Orçamentos** - Criação e envio de orçamentos
- 📅 **Agenda** - Calendário de agendamentos
- ⏰ **Banco de Horas** - Controle de horas extras
- 📦 **Estoque** - Gestão de inventário
- 💬 **Chat** - Comunicação interna
- 🔔 **Notificações** - Central de notificações
- 👤 **Usuários** - Gestão de usuários (admin)
- ⚙️ **Configurações** - Perfil e empresa

---

## 🚀 GUIA PASSO A PASSO

### PASSO 1: Preparar o Projeto

1. Abra o terminal na pasta `admin-portal`
2. Crie o arquivo `.env.local`:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env.local
```

3. Edite `.env.local` com suas credenciais do Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

**Onde encontrar:**
- Acesse seu projeto no [Supabase](https://supabase.com)
- Vá em **Settings > API**
- Copie a **URL** e a **anon public key**

---

### PASSO 2: Instalar Dependências

```bash
cd admin-portal
npm install
```

---

### PASSO 3: Testar Localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

Faça login com um usuário **admin** ou **técnico** do seu sistema.

---

### PASSO 4: Criar Repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Nome do repositório: `admin-portal`
3. Deixe **público** ou **privado**
4. Clique em **Create repository**

5. No terminal, execute:

```bash
git init
git add .
git commit -m "Portal Admin completo"
git branch -M main
git remote add origin https://github.com/Helgonhc/chameiappadm.git
git push -u origin main
```

---

### PASSO 5: Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **"Add New Project"**
3. Selecione o repositório `chameiappadm`
4. Em **Environment Variables**, adicione:

| Nome | Valor |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://seu-projeto.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sua-anon-key` |

5. Clique em **Deploy**
6. Aguarde o deploy (2-3 minutos)

---

### PASSO 6: Configurar Domínio Personalizado

1. Na Vercel, vá em **Settings > Domains**
2. Adicione seu domínio: `admin.seudominio.com`
3. Configure o DNS no seu provedor:

| Tipo | Nome | Valor |
|------|------|-------|
| CNAME | admin | cname.vercel-dns.com |

4. Aguarde a propagação (até 48h, geralmente minutos)

---

## 📧 Email de Boas-Vindas

Quando criar um novo admin/técnico, envie o email com o link do portal.

Use o template em `TEMPLATE_EMAIL_ADMIN_TECNICO.html` no Supabase:
1. Acesse **Authentication > Email Templates**
2. Edite o template de convite
3. Substitua o link pelo seu portal: `https://admin.seudominio.com`

---

## 🔄 Fluxo de Acesso

| Tipo de Usuário | Acesso |
|-----------------|--------|
| **Admin/Técnico** | Portal Web (`admin.seudominio.com`) |
| **Cliente** | Portal do Cliente (`portal.seudominio.com`) |

---

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção local
npm start

# Verificar erros
npm run lint
```

---

## 📁 Estrutura do Projeto

```
admin-portal/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx          # Dashboard principal
│   │   ├── clients/          # Gestão de clientes
│   │   ├── equipments/       # Equipamentos
│   │   ├── orders/           # Ordens de serviço
│   │   ├── tickets/          # Chamados
│   │   ├── quotes/           # Orçamentos
│   │   ├── agenda/           # Agenda/Calendário
│   │   ├── overtime/         # Banco de horas
│   │   ├── inventory/        # Estoque
│   │   ├── chat/             # Chat interno
│   │   ├── notifications/    # Notificações
│   │   ├── users/            # Gestão de usuários
│   │   └── settings/         # Configurações
│   ├── login/
│   │   └── page.tsx          # Tela de login
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── Sidebar.tsx           # Menu lateral
├── lib/
│   └── supabase.ts           # Cliente Supabase
├── store/
│   └── authStore.ts          # Estado de autenticação
├── package.json
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

---

## ❓ Problemas Comuns

### "Erro de autenticação"
- Verifique se as variáveis de ambiente estão corretas
- Confirme que o usuário é admin ou técnico (não cliente)

### "Página em branco"
- Verifique o console do navegador (F12)
- Confirme que o Supabase está acessível

### "Dados não carregam"
- Verifique as políticas RLS no Supabase
- Confirme que o usuário tem permissão

---

## 🆘 Suporte

Se tiver problemas:
1. Verifique as variáveis de ambiente
2. Teste localmente primeiro (`npm run dev`)
3. Verifique os logs na Vercel
4. Confirme as permissões no Supabase
