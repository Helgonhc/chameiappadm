/**
 * NvidiaAiService - Serviço de Inteligência Artificial do CHAMEIAPP V2
 * Conectado à API oficial da NVIDIA NIM (endpoints OpenAI-Compatible)
 * Modelo padrão: meta/llama-3.1-70b-instruct ou nvidia/llama-3.1-nemotron-70b-instruct
 */

export interface ProductCopyInput {
  title: string;
  currentPrice: number;
  previousPrice?: number | null;
  merchantName?: string;
  categoryName?: string;
  couponCode?: string | null;
  freeShipping?: boolean;
  destinationUrl?: string;
  rawDescription?: string;
}

export interface GeneratedOfferCopy {
  optimizedTitle: string;
  description: string;
  socialMessage: string;
  verdict: string;
  highlights: string[];
}

export const NvidiaAiService = {
  getApiKey(): string {
    return process.env.NVIDIA_API_KEY || '';
  },

  getModel(): string {
    return process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct';
  },

  /**
   * Executa chamada segura ao endpoint de Chat Completions da NVIDIA API com fallback automático de modelos
   */
  async callNvidiaApi(systemPrompt: string, userPrompt: string): Promise<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('NVIDIA_API_KEY não está configurada no servidor.');
    }

    const candidateModels = [
      this.getModel(),
      'nvidia/llama-3.1-nemotron-70b-instruct',
      'meta/llama-3.1-8b-instruct',
      'mistralai/mistral-7b-instruct-v0.3',
    ];

    // Remover duplicados
    const modelsToTry = Array.from(new Set(candidateModels));
    const endpoint = 'https://integrate.api.nvidia.com/v1/chat/completions';

    let lastError = '';

    for (const model of modelsToTry) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.5,
            max_tokens: 1024,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data?.choices?.[0]?.message?.content;
          if (content) {
            return content.trim();
          }
        } else {
          lastError = await response.text();
          console.warn(`[NVIDIA API Warning] Modelo ${model} falhou (${response.status}): ${lastError}. Tentando próximo...`);
        }
      } catch (err: any) {
        lastError = err.message || String(err);
      }
    }

    throw new Error(`Erro na API da NVIDIA após tentar modelos alternativos: ${lastError}`);
  },

  /**
   * Agente Especialista em Copywriting & Marketing de Ofertas
   * Gera título persuasivo, descrição detalhada, texto para WhatsApp e veredicto da oferta.
   */
  async generateOfferCopy(input: ProductCopyInput): Promise<GeneratedOfferCopy> {
    const systemPrompt = `Você é o Agente Especialista em Copywriting e E-commerce do CHAMEIAPP V2, a principal plataforma de ofertas e cupons do Brasil.
Sua missão é gerar textos persuasivos, atraentes, de alta conversão e otimizados em Português do Brasil (PT-BR) para produtos em promoção.

Responda ESTRITAMENTE em formato JSON com as seguintes chaves (sem markdown em volta do JSON):
{
  "optimizedTitle": "Título limpo, atrativo e chamativo para a oferta (máx 90 caracteres)",
  "description": "Descrição persuasiva em parágrafos simples destacando os pontos fortes do produto, economia real e motivo da compra",
  "socialMessage": "Mensagem formatada com emojis para grupos de WhatsApp/Telegram com CTA persuasivo",
  "verdict": "Veredicto curto (1-2 frases) sobre se a promoção vale muito a pena",
  "highlights": ["Destaque 1 em poucas palavras", "Destaque 2", "Destaque 3"]
}`;

    const discountPercent =
      input.previousPrice && input.previousPrice > input.currentPrice
        ? Math.round(((input.previousPrice - input.currentPrice) / input.previousPrice) * 100)
        : 0;

    const userPrompt = `Produto: ${input.title}
Loja: ${input.merchantName || 'Não informada'}
Categoria: ${input.categoryName || 'Não informada'}
Preço Atual: R$ ${input.currentPrice.toFixed(2)}
${input.previousPrice ? `Preço Anterior: R$ ${input.previousPrice.toFixed(2)} (${discountPercent}% OFF)` : ''}
${input.couponCode ? `Cupom: ${input.couponCode}` : ''}
${input.freeShipping ? 'Frete Grátis: SIM' : ''}
${input.rawDescription ? `Descrição do produto: ${input.rawDescription}` : ''}

Por favor, gere a copy perfeita em JSON conforme as instruções.`;

    try {
      const rawResult = await this.callNvidiaApi(systemPrompt, userPrompt);
      
      // Tenta extrair o bloco JSON da resposta
      let cleanJson = rawResult;
      const jsonMatch = rawResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanJson = jsonMatch[0];
      }

      const parsed = JSON.parse(cleanJson);

      return {
        optimizedTitle: parsed.optimizedTitle || input.title,
        description: parsed.description || `Confira esta incrível oferta do produto ${input.title}!`,
        socialMessage: parsed.socialMessage || `🔥 *PROMOÇÃO IMPERDÍVEL!*\n\n📦 ${input.title}\n💰 Por apenas R$ ${input.currentPrice.toFixed(2)}\n\n👉 Aproveite no ChameiApp!`,
        verdict: parsed.verdict || 'Oferta verificada com preço promocional atrativo.',
        highlights: Array.isArray(parsed.highlights) ? parsed.highlights : ['Melhor preço', 'Oferta verificada'],
      };
    } catch (err: any) {
      console.error('[NvidiaAiService] Falha ao gerar copy:', err);

      // Fallback gracioso em caso de indisponibilidade da API
      return {
        optimizedTitle: input.title,
        description: `Garanta agora ${input.title} com o melhor preço e procedência garantida na loja ${input.merchantName || 'parceira'}.`,
        socialMessage: `🔥 *OFERTA NO CHAMEIAPP!*\n\n📦 *${input.title}*\n💰 *R$ ${input.currentPrice.toFixed(2)}*\n\n👉 Pegar promoção!`,
        verdict: 'Oferta com preço promocional.',
        highlights: ['Preço Promocional', 'Compra Segura'],
      };
    }
  },

  /**
   * Agente de Revisão e SEO de Produtos
   */
  async generateSeoSummary(title: string, category: string): Promise<string> {
    const systemPrompt = `Você é um especialista em SEO para e-commerce no Brasil. Escreva uma meta descrição persuasiva de 140 a 160 caracteres em PT-BR para um produto.`;
    const userPrompt = `Produto: ${title}\nCategoria: ${category}`;

    try {
      return await this.callNvidiaApi(systemPrompt, userPrompt);
    } catch {
      return `Confira as melhores ofertas para ${title} no ChameiApp. Economize com cupons e descontos verificados diariamente!`;
    }
  },
};
