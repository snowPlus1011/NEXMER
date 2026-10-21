export type Language = "zh" | "en";
export type Localized = string | { zh: string; en: string };
export type DetailBlock =
  | { type: "image"; image: Localized; alt?: Localized; caption?: Localized }
  | { type: "text"; title?: Localized; body?: Localized };
export interface Product { id: string; category: string; name: Localized; summary: Localized; tag: Localized; image: string; details: DetailBlock[]; detailsLayout?: "spaced" | "seamless" }
export interface Category { id: string; name: Localized; description: Localized; image: string; imagePosition?: string }
export interface ContentData {
  navigation: { brand: string; siteTitle: Localized; tagline: Localized; defaultLanguage: string; background: string; logo: string; links: { id: string; label: Localized }[]; contactLabel: Localized };
  about: { eyebrow: Localized; title: Localized; sentences: Localized[]; primaryLabel: Localized; secondaryLabel: Localized; image: string; background: string; imageAlt: Localized; imageCaption: Localized; imageLabel: Localized };
  products: { eyebrow: Localized; title: Localized; description: Localized; viewAllLabel: Localized; detailsLabel: Localized; background: string };
  categories: { eyebrow: Localized; title: Localized; background: string; items: Category[] };
  support: { eyebrow: Localized; title: Localized; description: Localized; email: string; whatsapp: string; whatsappQrImage: string; whatsappQrLabel: Localized; whatsappQrAlt: Localized; background: string; contactTitle: Localized };
  catalog: Product[]; featured: Product[];
}
export function localize(value: Localized | undefined, language: Language): string {
  if (typeof value === "string") return value;
  return value?.[language] || value?.zh || value?.en || "";
}
