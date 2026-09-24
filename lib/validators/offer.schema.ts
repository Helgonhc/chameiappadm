import { z } from 'zod';

export const offerSchema = z.object({
  title: z.string().min(5, 'Título deve ter pelo menos 5 caracteres').max(255),
  slug: z.string().min(3).max(280).optional(),
  description: z.string().optional().nullable(),
  category_id: z.string().uuid('Categoria inválida'),
  merchant_id: z.string().uuid('Loja inválida'),
  current_price: z.number().positive('Preço atual deve ser maior que zero'),
  previous_price: z.number().positive().optional().nullable(),
  coupon_code: z.string().max(50).optional().nullable(),
  image_url: z.string().url('URL da imagem inválida'),
  destination_url: z.string().url('URL de destino inválida'),
  affiliate_url: z.string().url('URL de afiliado inválida').optional().nullable(),
  featured: z.boolean().default(false),
  free_shipping: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'expired', 'archived']).default('published'),
  expires_at: z.string().optional().nullable(),
});

export type OfferInput = z.infer<typeof offerSchema>;

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  subject: z.string().min(3, 'Assunto é obrigatório'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
