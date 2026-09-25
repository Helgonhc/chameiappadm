import crypto from 'crypto';

export interface AmazonPaapiItem {
  asin: string;
  title: string;
  currentPrice: number;
  previousPrice: number | null;
  imageUrl: string;
  detailPageUrl: string;
}

export const AmazonPaapiService = {
  /**
   * Verifica se a API da Amazon PA-API 5.0 está configurada nas variáveis de ambiente
   */
  isConfigured(): boolean {
    return Boolean(
      process.env.AMAZON_ACCESS_KEY &&
      process.env.AMAZON_SECRET_KEY &&
      process.env.AMAZON_ASSOCIATE_TAG
    );
  },

  /**
   * Busca detalhes oficiais do produto via Amazon Product Advertising API 5.0 (GetItems)
   */
  async getItemByAsin(asin: string): Promise<AmazonPaapiItem | null> {
    if (!this.isConfigured() || !asin) {
      return null;
    }

    const accessKey = process.env.AMAZON_ACCESS_KEY!;
    const secretKey = process.env.AMAZON_SECRET_KEY!;
    const associateTag = process.env.AMAZON_ASSOCIATE_TAG!;

    const host = 'webservices.amazon.com.br';
    const region = 'us-east-1';
    const path = '/paapi5/getitems';

    const payload = JSON.stringify({
      ItemIds: [asin],
      Resources: [
        'ItemInfo.Title',
        'Offers.Listings.Price',
        'Offers.Listings.SavingBasis',
        'Images.Primary.Large',
      ],
      PartnerTag: associateTag,
      PartnerType: 'Associates',
      Marketplace: 'www.amazon.com.br',
    });

    try {
      const headers = this.createSignatureHeaders({
        host,
        region,
        path,
        payload,
        accessKey,
        secretKey,
      });

      const response = await fetch(`https://${host}${path}`, {
        method: 'POST',
        headers,
        body: payload,
      });

      if (!response.ok) {
        console.warn('[AmazonPaapi] Erro na requisição PA-API:', response.status, await response.text());
        return null;
      }

      const data = await response.json();
      const item = data.ItemsResult?.Items?.[0];

      if (!item) return null;

      const title = item.ItemInfo?.Title?.DisplayValue || '';
      const listing = item.Offers?.Listings?.[0];
      const currentPrice = listing?.Price?.Amount || 0;
      const previousPrice = listing?.SavingBasis?.Amount || null;
      const imageUrl = item.Images?.Primary?.Large?.URL || `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`;
      const detailPageUrl = item.DetailPageURL || `https://www.amazon.com.br/dp/${asin}?tag=${associateTag}`;

      return {
        asin,
        title,
        currentPrice,
        previousPrice,
        imageUrl,
        detailPageUrl,
      };
    } catch (err) {
      console.warn('[AmazonPaapi] Falha ao consultar PA-API da Amazon:', err);
      return null;
    }
  },

  /**
   * Assinatura AWS Signature Version 4 para a PA-API 5.0 da Amazon
   */
  createSignatureHeaders(opts: {
    host: string;
    region: string;
    path: string;
    payload: string;
    accessKey: string;
    secretKey: string;
  }) {
    const service = 'ProductAdvertisingAPI';
    const algorithm = 'AWS4-HMAC-SHA256';
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.substring(0, 8);

    const canonicalHeaders =
      `content-encoding:amz-1.0\n` +
      `content-type:application/json; charset=utf-8\n` +
      `host:${opts.host}\n` +
      `x-amz-date:${amzDate}\n` +
      `x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems\n`;

    const signedHeaders = 'content-encoding;content-type;host;x-amz-date;x-amz-target';
    const payloadHash = crypto.createHash('sha256').update(opts.payload).digest('hex');

    const canonicalRequest =
      `POST\n` +
      `${opts.path}\n` +
      `\n` +
      `${canonicalHeaders}\n` +
      `${signedHeaders}\n` +
      `${payloadHash}`;

    const credentialScope = `${dateStamp}/${opts.region}/${service}/aws4_request`;
    const stringToSign =
      `${algorithm}\n` +
      `${amzDate}\n` +
      `${credentialScope}\n` +
      crypto.createHash('sha256').update(canonicalRequest).digest('hex');

    const kDate = crypto.createHmac('sha256', `AWS4${opts.secretKey}`).update(dateStamp).digest();
    const kRegion = crypto.createHmac('sha256', kDate).update(opts.region).digest();
    const kService = crypto.createHmac('sha256', kRegion).update(service).digest();
    const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
    const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

    const authorizationHeader = `${algorithm} Credential=${opts.accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    return {
      'content-encoding': 'amz-1.0',
      'content-type': 'application/json; charset=utf-8',
      'host': opts.host,
      'x-amz-date': amzDate,
      'x-amz-target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems',
      'Authorization': authorizationHeader,
    };
  },
};
