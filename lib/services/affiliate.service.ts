/**
 * AffiliateService - Motor unificado de formatação e conversão de links de afiliados
 * Suporta Amazon Brasil, Mercado Livre, Magalu, Shopee, AliExpress, Casas Bahia, etc.
 */

export interface AffiliateRule {
  merchantSlug: string;
  name: string;
  domains: string[];
  defaultTagParam: string;
  envTagKey: string;
  defaultTagValue: string;
}

export const AFFILIATE_RULES: AffiliateRule[] = [
  {
    merchantSlug: 'amazon',
    name: 'Amazon Brasil',
    domains: ['amazon.com.br', 'amzn.to', 'amazon.com', 'a.co'],
    defaultTagParam: 'tag',
    envTagKey: 'AMAZON_ASSOCIATE_TAG',
    defaultTagValue: 'chameiapp-20',
  },
  {
    merchantSlug: 'mercado-livre',
    name: 'Mercado Livre',
    domains: ['mercadolivre.com.br', 'produto.mercadolivre.com.br', 'mercadolibre.com', 'meli.la'],
    defaultTagParam: 'matt_tool',
    envTagKey: 'MERCADO_LIVRE_AFFILIATE_TAG',
    defaultTagValue: 'helgonhenrique',
  },
  {
    merchantSlug: 'magalu',
    name: 'Magazine Luiza',
    domains: ['magazineluiza.com.br', 'magazinevoce.com.br', 'magalu.me'],
    defaultTagParam: 'partner_id',
    envTagKey: 'MAGALU_PARTNER_ID',
    defaultTagValue: 'chameiapp',
  },
  {
    merchantSlug: 'shopee',
    name: 'Shopee',
    domains: ['shopee.com.br', 'shope.ee'],
    defaultTagParam: 'smtt',
    envTagKey: 'SHOPEE_AFFILIATE_TAG',
    defaultTagValue: 'chameiapp',
  },
];

export const AffiliateService = {
  /**
   * Identifica a loja/merchant a partir de uma URL
   */
  detectMerchant(url: string): AffiliateRule | null {
    if (!url) return null;
    try {
      const lower = url.toLowerCase();
      for (const rule of AFFILIATE_RULES) {
        if (rule.domains.some((domain) => lower.includes(domain))) {
          return rule;
        }
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Converte uma URL normal em uma URL de afiliado formatada com a tag correspondente
   */
  formatAffiliateUrl(rawUrl: string, customTag?: string): string {
    if (!rawUrl || typeof rawUrl !== 'string') return '';
    const cleanUrl = rawUrl.trim();

    try {
      const rule = this.detectMerchant(cleanUrl);

      // Se for Amazon
      if (rule && rule.merchantSlug === 'amazon') {
        const associateTag =
          customTag || process.env.AMAZON_ASSOCIATE_TAG || rule.defaultTagValue;

        // Se for amzn.to ou a.co (link encurtado oficial), preserva a URL e insere tag na query
        if (cleanUrl.includes('amzn.to') || cleanUrl.includes('a.co')) {
          const parsed = new URL(cleanUrl);
          parsed.searchParams.set(rule.defaultTagParam, associateTag);
          return parsed.toString();
        }

        const parsed = new URL(cleanUrl);
        // Limpar parâmetros de rastreamento genéricos de terceiros
        const paramsToClean = ['ascsubtag', 'pf_rd_p', 'pf_rd_r', 'pd_rd_wg', 'pd_rd_r', 'qid', 'sr', 'linkCode'];
        paramsToClean.forEach((p) => parsed.searchParams.delete(p));

        parsed.searchParams.set(rule.defaultTagParam, associateTag);
        return parsed.toString();
      }

      // Se for Mercado Livre
      if (rule && rule.merchantSlug === 'mercado-livre') {
        const tag = customTag || process.env.MERCADO_LIVRE_AFFILIATE_TAG || rule.defaultTagValue;
        if (cleanUrl.includes('meli.la')) {
          return cleanUrl; // Encurtador próprio de afiliado do ML
        }
        try {
          const parsed = new URL(cleanUrl);
          parsed.searchParams.set('matt_tool', tag);
          return parsed.toString();
        } catch {
          return cleanUrl;
        }
      }

      // Se for outra loja mapeada
      if (rule) {
        try {
          const parsed = new URL(cleanUrl);
          const tag = customTag || process.env[rule.envTagKey] || rule.defaultTagValue;
          parsed.searchParams.set(rule.defaultTagParam, tag);
          return parsed.toString();
        } catch {
          return cleanUrl;
        }
      }

      return cleanUrl;
    } catch {
      return rawUrl;
    }
  },

  /**
   * Gera a URL interna de redirecionamento /go/[id]
   */
  buildInternalGoUrl(offerId: string, baseUrl?: string): string {
    const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://chameiapp.com.br');
    return `${origin}/go/${offerId}`;
  },
};
