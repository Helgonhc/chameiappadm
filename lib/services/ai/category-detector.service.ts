import { SEED_CATEGORIES } from '../seed-data';
import { Category } from '../../types/database';

export const CategoryDetectorService = {
  /**
   * Detecta automaticamente qual das 24 categorias melhor se ajusta ao produto
   */
  detectCategory(title: string, description?: string): Category {
    const text = `${title || ''} ${description || ''}`.toLowerCase();

    // Mapeamento determinístico inteligente por palavras-chave
    if (this.matchKeywords(text, ['echo', 'alexa', 'kindle', 'fire tv', 'firestick', 'dispositivo amazon'])) {
      return this.findCategoryBySlug('dispositivos-amazon');
    }

    if (this.matchKeywords(text, ['ps5', 'playstation', 'xbox', 'nintendo', 'switch', 'gamepad', 'gamer', 'controle sem fio', 'geforce', 'rtx', 'placa de video', 'headset gamer', 'cadeira gamer'])) {
      return this.findCategoryBySlug('itens-gamer');
    }

    if (this.matchKeywords(text, ['iphone', 'galaxy', 'smartphone', 'celular', 'xiaomi', 'redmi', 'poco', 'capinha', 'pelicula', 'carregador turbo', 'carregador sem fio'])) {
      return this.findCategoryBySlug('celulares-e-acessorios');
    }

    if (this.matchKeywords(text, ['notebook', 'laptop', 'macbook', 'dell', 'lenovo', 'acer', 'ssd', 'memoria ram', 'mouse', 'teclado', 'monitor', 'impressora'])) {
      return this.findCategoryBySlug('computadores-e-acessorios');
    }

    if (this.matchKeywords(text, ['smart tv', 'tv 4k', 'televisao', 'fone de ouvido', 'bluetooth', 'airpods', 'soundbar', 'caixa de som', 'jbl', 'home theater'])) {
      return this.findCategoryBySlug('eletronicos-e-tvs');
    }

    if (this.matchKeywords(text, ['air fryer', 'fritadeira', 'cafeteira', 'nespresso', 'dolce gusto', 'batedeira', 'liquidificador', 'panela de pressao', 'geladeira', 'fogao', 'micro-ondas', 'microondas', 'cozinha'])) {
      return this.findCategoryBySlug('cozinha');
    }

    if (this.matchKeywords(text, ['parafusadeira', 'furadeira', 'alicate', 'serra', 'jogo de chaves', 'ferramenta', 'trena', 'solta', 'maleta de ferramentas'])) {
      return this.findCategoryBySlug('ferramentas-e-construcao');
    }

    if (this.matchKeywords(text, ['lampada inteligente', 'tomada smart', 'fechadura digital', 'sensor de presenca', 'casa inteligente', 'hub zigbee'])) {
      return this.findCategoryBySlug('casa-inteligente');
    }

    if (this.matchKeywords(text, ['perfume', 'maquiagem', 'batom', 'shampoo', 'condicionador', 'hidratante', 'protetor solar', 'sabonete', 'cuidado facial'])) {
      return this.findCategoryBySlug('beleza');
    }

    if (this.matchKeywords(text, ['racao', 'cachorro', 'gato', 'pet', 'petshop', 'coleira', 'areia sanitaria', 'petisco'])) {
      return this.findCategoryBySlug('pet-shop');
    }

    if (this.matchKeywords(text, ['fralda', 'pampers', 'huggies', 'carrinho de bebe', 'mamadeira', 'chupeta', 'bebe', 'berco'])) {
      return this.findCategoryBySlug('itens-para-bebe');
    }

    if (this.matchKeywords(text, ['tenis', 'sapato', 'camisa', 'camiseta', 'calca', 'jaqueta', 'vestido', 'bolsa', 'relogio de pulso', 'moda'])) {
      return this.findCategoryBySlug('moda');
    }

    if (this.matchKeywords(text, ['bicicleta', 'bike', 'suplemento', 'whey', 'creatina', 'academia', 'haltere', 'patins', 'bola', 'futebol', 'acampamento'])) {
      return this.findCategoryBySlug('esportes-e-aventura');
    }

    if (this.matchKeywords(text, ['pneu', 'oleo de motor', 'capacete', 'som automotivo', 'carro', 'moto', 'automotivo'])) {
      return this.findCategoryBySlug('automotivo');
    }

    if (this.matchKeywords(text, ['livro', 'hq', 'manga', 'ebook', 'romance', 'biografia', 'box de livros'])) {
      return this.findCategoryBySlug('livros-e-ebooks');
    }

    if (this.matchKeywords(text, ['violao', 'guitarra', 'teclado musical', 'microfone', 'ukulele', 'amplificador', 'bateria musical'])) {
      return this.findCategoryBySlug('instrumentos-musicais');
    }

    if (this.matchKeywords(text, ['caderno', 'caneta', 'resma de papel', 'sulfite', 'estojo', 'calculadora', 'escritorio', 'papelaria'])) {
      return this.findCategoryBySlug('papelaria-e-escritorio');
    }

    if (this.matchKeywords(text, ['lavadora de alta pressao', 'mangueira', 'piscina', 'cortador de grama', 'vaso', 'jardim', 'jardinagem'])) {
      return this.findCategoryBySlug('jardim-e-piscina');
    }

    if (this.matchKeywords(text, ['sabao em po', 'amaciante', 'desinfetante', 'papel higienico', 'detergente', 'veja', 'limpeza'])) {
      return this.findCategoryBySlug('cuidados-pessoais-e-limpeza');
    }

    if (this.matchKeywords(text, ['cerveja', 'vinho', 'whisky', 'cafe', 'chocolate', 'snack', 'alimento', 'bebida', 'azeite'])) {
      return this.findCategoryBySlug('alimentos-e-bebidas');
    }

    if (this.matchKeywords(text, ['lego', 'brinquedo', 'boneco', 'quebra-cabeca', 'jogo de tabuleiro', 'barbie', 'nerf'])) {
      return this.findCategoryBySlug('brinquedos-e-jogos');
    }

    if (this.matchKeywords(text, ['disco de vinil', 'vinil', 'cd musical', 'lp'])) {
      return this.findCategoryBySlug('cd-e-vinil');
    }

    if (this.matchKeywords(text, ['dvd', 'blu-ray', 'bluray', 'filme dvd'])) {
      return this.findCategoryBySlug('dvd-e-blu-ray');
    }

    if (this.matchKeywords(text, ['colchao', 'travesseiro', 'jogo de cama', 'toalha', 'sofa', 'mesa', 'cadeira de escritorio', 'decoracao'])) {
      return this.findCategoryBySlug('casa');
    }

    // Default se nenhuma palavra bater
    return SEED_CATEGORIES[0]; // Alimentos e Bebidas ou primeira da lista
  },

  matchKeywords(text: string, keywords: string[]): boolean {
    return keywords.some((kw) => text.includes(kw.toLowerCase()));
  },

  findCategoryBySlug(slug: string): Category {
    const found = SEED_CATEGORIES.find((c) => c.slug === slug);
    return found || SEED_CATEGORIES[0];
  },
};
