import { NextRequest, NextResponse } from 'next/server';
import { MetadataExtractorService } from '../../../../lib/services/extractor/metadata-extractor.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = body.url;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Por favor, forneça uma URL válida de produto.' },
        { status: 400 }
      );
    }

    const result = await MetadataExtractorService.extractFromUrl(url);

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: result.error || 'Não foi possível extrair dados desta URL.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      extracted: result.data,
    });
  } catch (err: any) {
    console.error('[API Extract URL Error]', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Erro interno ao extrair dados da URL.' },
      { status: 500 }
    );
  }
}
