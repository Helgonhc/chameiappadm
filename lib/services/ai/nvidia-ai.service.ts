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
      'meta/llama-3.2-3b-instruct',
      'meta/llama3-70b-instruct',
      'deepseek-ai/deepseek-r1',
      'nvidia/llama-3.1-nemotron-70b-instruct',
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
    const systemPrompt = `Você é o Agente Mestre em Copywriting, Neuromarketing e Vendas do CHAMEIAPP V2, a maior plataforma de ofertas e cupons do Brasil.
Sua missão é gerar textos DE ALTA PERSUASÃO, ULTRA-ATRAENTES, EMOCIONALMENTE IMPACTANTES e de ELEVADÍSSIMA CONVERSÃO em Português do Brasil (PT-BR).

Ao analisar o produto, aplique os princípios de Neuromarketing e Copywriting (Framework AIDA + Gatilhos Mentais de Escassez, Urgência e Prova Social):
1. **Título Magnético** ("optimizedTitle"): Crie um título irresistível com emojis chamativos (🔥, ⚡, 💥), destacando a porcentagem de desconto ou o benefício principal (máx 90 caracteres). Ex: "🔥 IMPERDÍVEL: Smart TV 55 4K com 42% OFF e Frete Grátis!"
2. **Descrição Persuasiva** ("description"): Escreva 2 a 3 parágrafos envolventes usando a fórmula AIDA (Atenção para o desejo/problema -> Interesse nos recursos -> Desejo pela economia brutal -> Chamada para ação).
3. **Copy de WhatsApp/Telegram** ("socialMessage"): Crie uma mensagem viral com emojis marcantes, formatação em negrito, preço anterior riscado, preço promocional, cupom ativo, aviso de estoque limitado ("🚨 PREÇO SUJEITO A ALTERAÇÃO A QUALQUER MOMENTO!") e chamada direta de ação.
4. **Veredicto do Especialista** ("verdict"): 1 a 2 frases entusiasmadas e convincentes do curador de ofertas garantindo que este valor é imperdível.
5. **Destaques Chave** ("highlights"): Array com 3 a 4 bullet points potentes e diretos (ex: ["💥 Economia Real de R$ 450", "🚚 Frete Grátis Garantido", "⭐ Avaliação Máxima dos Clientes", "🔒 Compra Segura na Loja Oficial"]).

Responda ESTRITAMENTE em formato JSON com as seguintes chaves (sem markdown em volta do JSON):
{
  "optimizedTitle": "Título irresistível e persuasivo com emoji e porcentagem de desconto",
  "description": "Descrição envolvente em 2-3 parágrafos destacando dor, benefício, economia e convite à compra",
  "socialMessage": "Mensagem viral para WhatsApp/Telegram com alta carga de urgência, emojis e CTA direto",
  "verdict": "Veredicto entusiasmado e categórico sobre a promoção",
  "highlights": ["Destaque 1", "Destaque 2", "Destaque 3", "Destaque 4"]
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
