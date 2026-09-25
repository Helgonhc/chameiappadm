import { NextResponse } from 'next/server';
import { AutoPublisherService } from '../../../../../lib/services/bot/auto-publisher.service';

export async function POST(request: Request) {
  try {
    let customKeywords: string[] | undefined;

    try {
      const body = await request.json();
      if (Array.isArray(body.keywords) && body.keywords.length > 0) {
        customKeywords = body.keywords;
      }
    } catch {
      // Usar palavras-chave padrão se corpo estiver vazio
    }

    const result = await AutoPublisherService.runAutoScan(customKeywords);

    return NextResponse.json({
      success: true,
      message: `Robô executado com sucesso. ${result.publishedCount} ofertas publicadas automaticamente.`,
      result,
    });
  } catch (error: any) {
    console.error('[ApiAutoScan] Erro na automação do robô:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro interno durante a automação do robô de ofertas.',
      },
      { status: 500 }
    );
  }
}
