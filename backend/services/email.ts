const RESEND_API_KEY = process.env.RESEND_API_KEY;

export const emailService = {
  /**
   * Envia e-mail de boas-vindas para novos leads/clientes
   */
  async sendWelcomeEmail(to: string, userName: string, planName: string) {
    if (!RESEND_API_KEY) {
      console.warn('RESEND_API_KEY não configurada. E-mail de boas-vindas não enviado.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo ao ChameiApp</title>
        <style>
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #4f46e5 0%, #10b981 100%); padding: 60px 40px; text-align: center; color: white; }
          .content { padding: 40px; color: #1e293b; line-height: 1.6; }
          .footer { padding: 30px; background-color: #f1f5f9; text-align: center; color: #64748b; font-size: 12px; }
          .btn { display: inline-block; padding: 18px 36px; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; border-radius: 16px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-top: 20px; transition: transform 0.2s; }
          .plan-badge { display: inline-block; padding: 4px 12px; background-color: #10b9811a; color: #10b981; border-radius: 99px; font-size: 10px; font-weight: 900; text-transform: uppercase; margin-bottom: 20px; }
          h1 { margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; font-style: italic; }
          p { font-size: 16px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin-bottom: 10px;">ChameiApp</h1>
            <p style="opacity: 0.8; font-weight: 500; font-size: 14px; letter-spacing: 2px;">SISTEMA OPERACIONAL PREMUM</p>
          </div>
          <div class="content text-center">
            <div class="plan-badge">Plano ${planName} Ativado</div>
            <h2 style="font-size: 24px; font-weight: 800; color: #0f172a; margin-top: 0;">Olá, ${userName}! 🚀</h2>
            <p>Estamos muito empolgados em ter você conosco! Sua conta de teste foi criada com sucesso e seu ambiente já está sendo configurado.</p>
            <p>A partir de agora, você tem acesso total às ferramentas que vão transformar a gestão da sua empresa e maximizar seus lucros.</p>
            
            <div style="background-color: #f8fafc; border-radius: 16px; padding: 20px; margin: 30px 0; border: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 14px; font-weight: 600;">O QUE FAZER AGORA?</p>
              <ul style="text-align: left; padding-left: 20px; font-size: 14px; margin-top: 15px;">
                <li>Acesse o dashboard com seu e-mail.</li>
                <li>Cadastre seu primeiro técnico.</li>
                <li>Crie uma Ordem de Serviço de teste.</li>
              </ul>
            </div>

            <a href="https://admin.chameiapp.com/login" class="btn">Acessar Meu Painel Agora</a>
          </div>
          <div class="footer">
            <p style="margin-bottom: 5px;">&copy; 2026 ChameiApp - Por Helgon Henrique</p>
            <p>Este e-mail foi enviado automaticamente após sua solicitação de demo.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'ChameiApp <onboarding@resend.dev>',
          to: [to],
          subject: `Bem-vindo ao Futuro, ${userName.split(' ')[0]}! 🚀`,
          html: htmlContent,
        }),
      });

      const data = await res.json();
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao enviar e-mail via Resend:', error);
      return { success: false, error };
    }
  }
};
