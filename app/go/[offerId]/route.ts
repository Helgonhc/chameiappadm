import { NextRequest, NextResponse } from 'next/server';
import { OfferService } from '../../../lib/services/offer.service';
import { TrackingService } from '../../../lib/services/tracking.service';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ offerId: string }> }
) {
  const { offerId } = await props.params;

  // 1. Validar formato UUID do parâmetro offerId
  if (!offerId || !UUID_REGEX.test(offerId)) {
    return NextResponse.redirect(new URL('/ofertas?error=id-invalido', request.url));
  }

  // 2. Buscar oferta no banco de dados
  const offer = await OfferService.getOfferById(offerId);

  if (!offer) {
    return NextResponse.redirect(new URL('/ofertas?error=oferta-nao-encontrada', request.url));
  }

  // 3. Validação temporal e de status da oferta
  const now = new Date();

  if (offer.status !== 'published') {
    return NextResponse.redirect(new URL('/ofertas?error=oferta-inativa', request.url));
  }

  if (offer.expires_at && new Date(offer.expires_at) <= now) {
    return NextResponse.redirect(new URL('/ofertas?error=oferta-expirada', request.url));
  }

  if (offer.starts_at && new Date(offer.starts_at) > now) {
    return NextResponse.redirect(new URL('/ofertas?error=oferta-futura', request.url));
  }

  // 4. Registrar clique assincronamente (Server-Side)
  const searchParams = request.nextUrl.searchParams;
  const referrer = request.headers.get('referer');
  const utmSource = searchParams.get('utm_source');
  const utmMedium = searchParams.get('utm_medium');
  const utmCampaign = searchParams.get('utm_campaign');

  TrackingService.recordClick({
    offerId: offer.id,
    referrer,
    utmSource,
    utmMedium,
    utmCampaign,
  }).catch((err) => console.error('[Tracking Async Error]', err));

  // 5. Resolver URL de destino (affiliate_url com fallback destination_url + Open Redirect Protection)
  try {
    const targetUrl = TrackingService.resolveTargetUrl(offer);
    return NextResponse.redirect(targetUrl, { status: 307 });
  } catch (err) {
    console.error('[Redirect Error]', err);
    return NextResponse.redirect(new URL('/ofertas?error=destino-invalido', request.url));
  }
}
