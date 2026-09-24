// Configuration File for CHAMEIAPP Nominal Identity & Platform Settings
// All nominal identities are centralized here to allow future re-branding without structural refactoring.

export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  subtagline: string;
  region: string;
  domain: string;
  social: {
    instagram: string | null;
    whatsapp: string | null;
  };
  merchantsAllowed: string[];
}

export const SITE_CONFIG: SiteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "CHAMEIAPP",
  legalName: process.env.NEXT_PUBLIC_SITE_LEGAL_NAME || "CHAMEIAPP Ofertas Ltda",
  tagline: "Uai, achamos um preço bão no CHAMEIAPP.",
  subtagline: "Ofertas selecionadas para você encontrar boas oportunidades de compra sem perder tempo procurando.",
  region: "Minas Gerais, Brasil",
  domain: process.env.NEXT_PUBLIC_SITE_URL || "https://chameiapp.com.br",
  social: {
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL || null,
    whatsapp: process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP_URL || null,
  },
  merchantsAllowed: ["Amazon", "Mercado Livre"],
};
