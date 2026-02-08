# 📄 Guia de Configuração: Resend & Vercel

Se segura, Helgon! Aqui está o passo a passo definitivo para você não se perder.

## 1. O E-mail "Bonitão" (Onde ele mora?)

Você **não precisa** colocar o código do e-mail no site do Resend. 
*   **Como funciona:** O código HTML do e-mail já está dentro do seu projeto (no arquivo `backend/services/email.ts`). 
*   **O papel do Resend:** O Resend é apenas o "carteiro". Nosso app entrega a "carta pronta" (o código) e o Resend carimba e entrega na caixa de entrada do cliente.

---

## 2. Configurando na VERCEL (Obrigatório para o site funcionar)

Como você está hospedando lá, a Vercel precisa saber quais são as suas senhas secretas (API Keys), senão o botão de "Assinar" vai dar erro no site oficial.

1.  Acesse o [Dashboard da Vercel](https://vercel.com/dashboard).
2.  Clique no seu projeto (**admin-portal-main**).
3.  Vá em **Settings** (Configurações) > **Environment Variables**.
4.  Adicione as seguintes chaves (copie exatamente os nomes e os valores que estão no seu `.env.local`):
    *   `ASAAS_API_KEY` = (aquela chave longa do Asaas)
    *   `ASAAS_API_URL` = `https://sandbox.asaas.com/api/v3`
    *   `RESEND_API_KEY` = `re_TraxidYF_26NK8JPGGJHeNXvcwbpe9WRH`
    *   `SUPABASE_SERVICE_ROLE_KEY` = (sua chave secreta do Supabase)
5.  Clique em **Save**.
6.  **Importante:** Faça um novo "Deploy" ou dê um `git push` para a Vercel ler essas chaves novas.

---

## 3. Configurando no RESEND (Para o e-mail chegar em todo mundo)

Por enquanto, como você não tem domínio próprio (`@chameiapp.com`), você está no **Modo de Teste**.

1.  **Limitação de Teste:** No modo de teste (sem domínio verificado), você **só consegue enviar e-mails para o seu próprio e-mail** (o que você usou para criar a conta no Resend).
2.  **Para liberar geral:** Quando você comprar seu domínio (ex: no Registro.br ou Hostgator):
    *   Vá em [resend.com/domains](https://resend.com/domains).
    *   Clique em **Add Domain** e coloque seu domínio.
    *   Ele vai te dar uns códigos DNS. Você os coloca onde comprou o domínio.
    *   Assim que ficar "Verified", seu ChameiApp poderá enviar e-mails para qualquer cliente do mundo!

### O domínio da Vercel (`.vercel.app`) serve?
Infelizmente não para e-mail. A Vercel te dá um endereço para as pessoas verem seu site, mas o Resend exige um domínio que você "compre" (como `chameiapp.com`) para deixar você enviar e-mails para outras pessoas.

## 4. Configurando seu Domínio (Registro.br) 🌐

Agora que você comprou o domínio, precisamos avisar ao Registro.br onde o site está (Vercel) e quem entrega os e-mails (Resend).

### Passo A: Conectar à VERCEL
1. No painel da Vercel, vá em **Settings > Domains**.
2. Digite seu domínio (ex: `chameiapp.com`) e clique em **Add**.
3. A Vercel vai te dar dois valores: um **Tipo A** e um **Tipo CNAME**.
4. No Registro.br, vá em **DNS > Configurar Endereçamento** e adicione esses valores lá.

### Passo B: Conectar ao RESEND
1. No Resend, vá em [resend.com/domains](https://resend.com/domains).
2. Adicione seu domínio.
3. Ele vai te dar registros do tipo **MX**, **TXT** e **CNAME**.
4. Adicione todos eles no painel de DNS do Registro.br.

**Me avise quando o domínio estiver "Verified" no Resend para eu fazer esse ajuste final no remetente!** 🚀🫡

## 🚀 Resumo do Funcionamento
*   **Localmente:** O sistema usa o `.env.local`.
*   **Na Vercel:** O sistema usa o que você cadastrar no painel dela.
*   **No Resend:** Ele apenas recebe a ordem do nosso código e despacha.

Pode reiniciar agora! Quando voltar, é só olhar este guia e o arquivo `CONVERSATION_MEMORY.md` que eu criei para você. 😉🔝
