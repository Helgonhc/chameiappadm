const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';

async function fetchAsaas(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${ASAAS_API_URL}${endpoint}`, {
        ...options,
        headers: {
            'access_token': ASAAS_API_KEY || '',
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        console.error(`Asaas API Error [${endpoint}]:`, data);
        throw data;
    }

    return data;
}

export const asaasService = {
    /**
     * Cria um cliente no Asaas
     */
    async createCustomer(data: {
        name: string;
        cpfCnpj: string;
        email?: string;
        phone?: string;
        mobilePhone?: string;
    }) {
        return fetchAsaas('/customers', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Cria uma assinatura recorrente
     */
    async createSubscription(data: {
        customer: string;
        billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX';
        value: number;
        nextDueDate: string;
        cycle: 'MONTHLY' | 'YEARLY';
        description: string;
    }) {
        return fetchAsaas('/subscriptions', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Busca detalhes de uma assinatura
     */
    async getSubscription(id: string) {
        return fetchAsaas(`/subscriptions/${id}`, {
            method: 'GET',
        });
    }
};
