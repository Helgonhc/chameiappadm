-- ==========================================================
-- CHAMEIAPP: ASAAS PAYMENT INTEGRATION
-- ==========================================================

-- Adicionar colunas de faturamento à tabela de organizações
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'organizations') THEN
        
        -- ID do Cliente no Asaas
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='organizations' AND column_name='asaas_customer_id') THEN
            ALTER TABLE public.organizations ADD COLUMN asaas_customer_id TEXT;
        END IF;

        -- ID da Assinatura no Asaas
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='organizations' AND column_name='asaas_subscription_id') THEN
            ALTER TABLE public.organizations ADD COLUMN asaas_subscription_id TEXT;
        END IF;

        -- Status da Assinatura (active, trialing, past_due, canceled, etc)
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='organizations' AND column_name='subscription_status') THEN
            ALTER TABLE public.organizations ADD COLUMN subscription_status TEXT DEFAULT 'trialing';
        END IF;

        -- Data do próximo vencimento
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='organizations' AND column_name='next_billing_date') THEN
            ALTER TABLE public.organizations ADD COLUMN next_billing_date TIMESTAMP WITH TIME ZONE;
        END IF;

    END IF;
END $$;

-- Comentários para documentação do Schema
COMMENT ON COLUMN public.organizations.asaas_customer_id IS 'ID único do cliente no gateway Asaas';
COMMENT ON COLUMN public.organizations.asaas_subscription_id IS 'ID da assinatura recorrente no Asaas';
COMMENT ON COLUMN public.organizations.subscription_status IS 'Status atual da assinatura sincronizado via Webhook';
