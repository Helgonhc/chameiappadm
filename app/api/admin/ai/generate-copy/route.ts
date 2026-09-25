import { NextRequest, NextResponse } from 'next/server';
import { NvidiaAiService, ProductCopyInput } from '../../../../../lib/services/ai/nvidia-ai.service';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ProductCopyInput;

    if (!body.title || body.currentPrice === undefined) {
      return NextResponse.json(
        { success: false, error: 'Título e preço atual são obrigatórios para gerar o texto.' },
        { status: 400 }
      );
    }

    const copyResult = await NvidiaAiService.generateOfferCopy(body);

    return NextResponse.json({
      success: true,
      copy: copyResult,
      modelUsed: NvidiaAiService.getModel(),
    });
  } catch (err: any) {
    console.error('[API AI Generate Copy Error]', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Erro interno ao processar texto com a NVIDIA AI.' },
      { status: 500 }
    );
  }
}
