// Configuration File for CHAMEIAPP Nominal Identity & Platform Settings

export interface SiteConfig {
  name: string;
  legalName?: string | null;
  tagline: string;
  subtagline: string;
  region: string;
  domain: string;
  amazonAssociateTag: string;
  social: {
    instagram: string | null;
    whatsapp: string | null;
  };
  merchantsAllowed: string[];
}

export const SITE_CONFIG: SiteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "CHAMEIAPP",
  legalName: process.env.NEXT_PUBLIC_SITE_LEGAL_NAME || null,
  tagline: "Achamos as melhores ofertas para você no CHAMEIAPP.",
  subtagline: "Portal independente de ofertas e promoções verificadas da Amazon Brasil, Mercado Livre e principais lojas.",
  region: "Minas Gerais, Brasil",
  domain: process.env.NEXT_PUBLIC_SITE_URL || "https://chameiapp.com.br",
  amazonAssociateTag: process.env.AMAZON_ASSOCIATE_TAG || "chameiapp-20",
  social: {
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL || null,
    whatsapp: process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP_URL || null,
  },
  merchantsAllowed: ["Amazon Brasil", "Mercado Livre"],
};
