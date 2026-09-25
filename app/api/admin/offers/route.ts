import { NextRequest, NextResponse } from 'next/server';
import { OfferService } from '../../../../lib/services/offer.service';
import { AffiliateService } from '../../../../lib/services/affiliate.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get('status') || 'all') as any;
    const searchQuery = searchParams.get('query') || undefined;

    const offers = await OfferService.getAllOffersForAdmin({
      status,
      searchQuery,
    });

    return NextResponse.json({ success: true, offers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID da oferta é obrigatório' }, { status: 400 });
    }

    if (action === 'toggle-status') {
      const res = await OfferService.toggleOfferStatus(id, updates.status);
      return NextResponse.json(res);
    }

    if (action === 'toggle-featured') {
      const res = await OfferService.toggleOfferFeatured(id, updates.featured);
      return NextResponse.json(res);
    }

    const res = await OfferService.updateOffer(id, updates);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID da oferta é obrigatório' }, { status: 400 });
    }

    const res = await OfferService.deleteOffer(id);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Se for requisição de teste/conversão de link
    if (body.action === 'format-link') {
      const formatted = AffiliateService.formatAffiliateUrl(body.url);
      const merchant = AffiliateService.detectMerchant(body.url);
      return NextResponse.json({
        success: true,
        formattedUrl: formatted,
        merchantName: merchant?.name || 'Não identificado',
      });
    }

    const res = await OfferService.createOffer(body);
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
