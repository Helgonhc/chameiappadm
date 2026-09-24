import { NextRequest, NextResponse } from 'next/server';
import { OfferService } from '../../../lib/services/offer.service';
import { TrackingService } from '../../../lib/services/tracking.service';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ offerId: string }> }
) {
  const { offerId } = await props.params;

  if (!offerId) {
    return NextResponse.redirect(new URL('/ofertas', request.url));
  }

  const offer = await OfferService.getOfferById(offerId);

  if (!offer || offer.status === 'expired' || offer.status === 'archived') {
    return NextResponse.redirect(new URL('/ofertas?error=oferta-expirada', request.url));
  }

  // Coleta dados de analytics / UTM
  const searchParams = request.nextUrl.searchParams;
  const referrer = request.headers.get('referer');
  const utmSource = searchParams.get('utm_source');
  const utmMedium = searchParams.get('utm_medium');
  const utmCampaign = searchParams.get('utm_campaign');

  // Registrar clique assincronamente (sem bloquear o redirecionamento do usuário)
  TrackingService.recordClick({
    offerId: offer.id,
    referrer,
    utmSource,
    utmMedium,
    utmCampaign,
  }).catch((err) => console.error('[Tracking Async Error]', err));

  // Resolver URL com validação de allowlist
  try {
    const targetUrl = TrackingService.resolveTargetUrl(offer);
    return NextResponse.redirect(targetUrl, { status: 307 });
  } catch {
    return NextResponse.redirect(new URL('/ofertas', request.url));
  }
}
