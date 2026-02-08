import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Necessário para bypass RLS no webhook

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('🔔 Webhook Asaas recebido:', body.event);

        const { event, payment, subscription } = body;

        // 1. Identificar o ID do cliente ou assinatura
        const asaasCustomerId = payment?.customer || subscription?.customer;
        const asaasSubscriptionId = subscription?.id || payment?.subscription;

        if (!asaasCustomerId) {
            return NextResponse.json({ error: 'Customer ID not found in webhook' }, { status: 400 });
        }

        // 2. Processar eventos principais
        switch (event) {
            case 'PAYMENT_CONFIRMED':
            case 'PAYMENT_RECEIVED':
                console.log(`✅ Pagamento confirmado para o cliente ${asaasCustomerId}`);
                await supabase
                    .from('organizations')
                    .update({
                        subscription_status: 'active',
                        updated_at: new Date().toISOString()
                    })
                    .eq('asaas_customer_id', asaasCustomerId);
                break;

            case 'SUBSCRIPTION_DELETED':
            case 'SUBSCRIPTION_CANCELLED':
                console.log(`❌ Assinatura cancelada: ${asaasSubscriptionId}`);
                await supabase
                    .from('organizations')
                    .update({
                        subscription_status: 'canceled',
                        status: 'suspended',
                        updated_at: new Date().toISOString()
                    })
                    .eq('asaas_subscription_id', asaasSubscriptionId);
                break;

            case 'PAYMENT_OVERDUE':
                console.log(`⚠️ Pagamento atrasado para o cliente ${asaasCustomerId}`);
                await supabase
                    .from('organizations')
                    .update({
                        subscription_status: 'past_due',
                        updated_at: new Date().toISOString()
                    })
                    .eq('asaas_customer_id', asaasCustomerId);
                break;

            default:
                console.log(`ℹ️ Evento ignorado: ${event}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('❌ Erro no Webhook Asaas:', error.message);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}
