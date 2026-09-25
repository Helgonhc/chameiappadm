import { AutoPublisherService } from '../lib/services/bot/auto-publisher.service';
import { OfferService } from '../lib/services/offer.service';
import { SEED_CATEGORIES } from '../lib/services/seed-data';

async function seedAllCategories() {
  console.log('🚀 Iniciando varredura automatizada para popular no mínimo 10 produtos por categoria (24 categorias)...\n');

  const categoriesMap = AutoPublisherService.CATEGORY_KEYWORDS_MAP;
  let totalAdded = 0;

  for (const cat of SEED_CATEGORIES) {
    const existing = await OfferService.getOffersByCategoryId(cat.id);
    console.log(`📌 Categoria: '${cat.name}' (${cat.slug}) | Ofertas atuais: ${existing.length}`);

    const keywords = categoriesMap[cat.slug] || [cat.name];
    console.log(`   [Bot Auto] Buscando com palavras-chave: ${keywords.slice(0, 4).join(', ')}...`);

    const scanRes = await AutoPublisherService.runAutoScan(keywords, 'mercado-livre');
    totalAdded += scanRes.publishedCount;
    
    const updatedCount = existing.length + scanRes.publishedCount;
    console.log(`   ✅ ${scanRes.publishedCount} novas ofertas publicadas! Total em '${cat.name}': ${updatedCount}\n`);
  }

  console.log(`🎉 Processo concluído! Total de ${totalAdded} novas ofertas reais e ativas publicadas com sucesso!`);
}

seedAllCategories();
