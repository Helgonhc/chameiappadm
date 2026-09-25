import { NextResponse } from 'next/server';
import { AutoPublisherService } from '../../../../../lib/services/bot/auto-publisher.service';

export async function POST(request: Request) {
  try {
    let customKeywords: string[] | undefined;
    let targetPlatform: 'all' | 'mercado-livre' | 'amazon' = 'all';

    try {
      const body = await request.json();
      if (Array.isArray(body.keywords) && body.keywords.length > 0) {
        customKeywords = body.keywords;
      }
      if (body.platform && ['all', 'mercado-livre', 'amazon'].includes(body.platform)) {
        targetPlatform = body.platform;
      }
    } catch {
      // Usar palavras-chave e plataforma padrão se corpo estiver vazio
    }

    const result = await AutoPublisherService.runAutoScan(customKeywords, targetPlatform);

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
