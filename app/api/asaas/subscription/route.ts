import { NextRequest, NextResponse } from 'next/server';
import { asaasService } from '@/backend/services/asaas';
import { emailService } from '@/backend/services/email';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
    try {
        const { name, email, whatsapp, plan } = await req.json();

        // 1. Mapeamento de Planos para Valores
        const planPrices: Record<string, number> = {
            'Start': 49.90,
            'Professional': 149.90,
            'Business': 349.90
        };

        const value = planPrices[plan] || 49.90;

        // 2. Criar Cliente no Asaas
        const customer = await asaasService.createCustomer({
            name,
            email,
            mobilePhone: whatsapp,
            cpfCnpj: '00000000000' // Placeholder - Sandbox aceita zerado ou podemos pedir no form
        });

        // 3. Criar Assinatura no Asaas
        const subscription = await asaasService.createSubscription({
            customer: customer.id,
            billingType: 'PIX', // Poderiamos deixar o usuário escolher, mas PIX/Boleto é comum no asaas
            value,
            nextDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 dias de trial
            cycle: 'MONTHLY',
            description: `Mensalidade ChameiApp - Plano ${plan}`
        });

        // 4. Criar Organização no Banco de Dados (Trial)
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        const { data: org, error: orgError } = await supabase
            .from('organizations')
            .insert([
                {
                    name,
                    slug: `${slug}-${Date.now().toString().slice(-4)}`,
                    billing_email: email,
                    plan: plan.toLowerCase(),
                    status: 'active', // Ativa por enquanto para permitir o trial
                    subscription_status: 'trialing',
                    asaas_customer_id: customer.id,
                    asaas_subscription_id: subscription.id,
                    next_billing_date: subscription.nextDueDate
                }
            ])
            .select()
            .single();

        if (orgError) {
            console.error('Error creating organization:', orgError);
        }

        // 5. Enviar E-mail de Boas-Vindas (Async para não travar o redirecionamento)
        emailService.sendWelcomeEmail(email, name, plan).catch(e => console.error('Welcome email error:', e));

        return NextResponse.json({
            success: true,
            invoiceUrl: subscription.invoiceUrl || subscription.bankSlipUrl,
            asaasCustomerId: customer.id,
            asaasSubscriptionId: subscription.id,
            organizationId: org?.id
        });

    } catch (error: any) {
        console.error('API Subscription Error:', error);
        return NextResponse.json({ error: error.message || 'Falha ao criar assinatura' }, { status: 500 });
    }
}
