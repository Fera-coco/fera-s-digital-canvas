/*
  Every claim below is copied from Superb Naturals' own labels or WhatsApp catalogue.
  Prices, sizes and names come from her WhatsApp catalogue (22 Nov 2026).
*/

export const WHATSAPP = "2348020866239";
export const BASE = import.meta.env.BASE_URL;
export const img = (name: string) => `${BASE}img/${name}.webp`;

export type Concern = "growth" | "edges" | "dandruff" | "breakage" | "softness";

export const CONCERNS: { id: Concern; label: string; emoji: string; blurb: string }[] = [
  { id: "growth", label: "Growth & thickness", emoji: "🌱", blurb: "You want more length and fuller hair." },
  { id: "edges", label: "Thin edges", emoji: "✨", blurb: "Your edges need some love." },
  { id: "dandruff", label: "Dandruff & itching", emoji: "🍃", blurb: "Your scalp flakes or itches." },
  { id: "breakage", label: "Breakage", emoji: "💪", blurb: "Your hair snaps or sheds a lot." },
  { id: "softness", label: "Dry, hard hair", emoji: "🧴", blurb: "Your hair feels dry and hard to detangle." },
];

export interface Size {
  label: string;
  price: number;
}

export interface Product {
  slug: string;
  name: string;
  short: string;
  kind: "Oil" | "Wash" | "Butter" | "Kit" | "Tool" | "Beard";
  price: number; // naira, from her WhatsApp catalogue (lowest size if several)
  sizes?: Size[];
  size?: string;
  tagline: string;
  benefits: string[];
  concerns: Concern[];
  step?: number; // place in the wash-day routine
  stepLabel?: string;
  images: string[];
  tone: "leaf" | "blush" | "butter" | "mint";
  includes?: string[];
}

export const products: Product[] = [
  {
    slug: "hair-growth-oil",
    name: "Hair Growth Oil",
    short: "Growth Oil",
    kind: "Oil",
    price: 7000,
    sizes: [
      { label: "50ml", price: 7000 },
      { label: "100ml", price: 10500 },
    ],
    tagline: "Infused with raw herbs and over 10 active oils.",
    benefits: ["Promotes faster and thicker hair growth", "Reduces dandruff", "Stops itching and breakage"],
    concerns: ["growth", "dandruff", "breakage"],
    step: 3,
    stepLabel: "Oil the scalp",
    images: ["growth-oil-trio", "growth-oil-pair", "growth-oil-hand", "hair-pink"],
    tone: "leaf",
  },
  {
    slug: "essential-edge-oil",
    name: "Essential Edge Oil",
    short: "Edge Oil",
    kind: "Oil",
    price: 8000,
    size: "30ml",
    tagline: "Raw herbs and over 10 active oils, made for your edges.",
    benefits: ["Boosts edge growth", "Promotes a healthy scalp and reduces dandruff", "Reduces itching and breakage"],
    concerns: ["edges", "dandruff", "breakage"],
    step: 4,
    stepLabel: "Finish the edges",
    images: ["edge-oil-trio", "edge-oil-hand"],
    tone: "blush",
  },
  {
    slug: "shampoo-conditioner",
    name: "Shampoo & Conditioner Set",
    short: "Wash Duo",
    kind: "Wash",
    price: 8000,
    size: "500ml each",
    tagline: "Deeply nourishes hair. The wash-day pair.",
    benefits: ["Cleans hair and scalp, and exfoliates dead skin cells", "Stops itching and dandruff", "Promotes softness, strengthens and detangles", "Prevents hair damage"],
    concerns: ["dandruff", "softness", "breakage"],
    step: 1,
    stepLabel: "Cleanse & condition",
    images: ["shampoo-conditioner-sun", "shampoo-conditioner-garden", "conditioner-close"],
    tone: "mint",
    includes: ["Anti-Dandruff Shampoo (500ml)", "Moisturizing Conditioner (500ml)"],
  },
  {
    slug: "anti-dandruff-shampoo",
    name: "Anti-Dandruff Shampoo",
    short: "Shampoo",
    kind: "Wash",
    price: 4000,
    size: "500ml",
    tagline: "Deeply cleanses hair. A clean scalp is where healthy hair starts.",
    benefits: ["Cleans hair and scalp", "Exfoliates dead skin cells", "Stops itching and dandruff", "Prevents hair damage"],
    concerns: ["dandruff"],
    images: ["shampoo-conditioner-sun", "shampoo-conditioner-garden"],
    tone: "mint",
  },
  {
    slug: "moisturizing-conditioner",
    name: "Moisturizing Conditioner",
    short: "Conditioner",
    kind: "Wash",
    price: 4000,
    size: "500ml",
    tagline: "For all hair types.",
    benefits: ["Promotes healthy hair growth", "Promotes softness", "Helps to strengthen and detangle hair", "Prevents hair damage"],
    concerns: ["softness", "breakage", "growth"],
    images: ["conditioner-close", "shampoo-conditioner-sun"],
    tone: "butter",
  },
  {
    slug: "hair-growth-butter",
    name: "3X Hair Growth Butter",
    short: "Growth Butter",
    kind: "Butter",
    price: 7500,
    size: "250g",
    tagline: "Infused with raw herbs and over 10 active oils.",
    benefits: ["Promotes thicker hair growth", "Prevents hair loss", "Repairs damaged and dry hair"],
    concerns: ["growth", "breakage", "softness"],
    step: 2,
    stepLabel: "Moisturise & seal",
    images: ["butter-stack", "butter-close", "full-set"],
    tone: "butter",
  },
  {
    slug: "mini-kit",
    name: "Mini Kit",
    short: "Mini Kit",
    kind: "Kit",
    price: 15000,
    tagline: "The easy way to start your routine.",
    benefits: ["Nourishes the hair and scalp", "Helps reduce breakage", "Promotes healthy hair growth"],
    concerns: ["growth", "breakage", "dandruff", "softness"],
    images: ["mini-kit"],
    tone: "blush",
    includes: ["Anti-Dandruff Shampoo", "Conditioner", "A small bottle of oil"],
  },
  {
    slug: "medium-kit",
    name: "Medium Kit",
    short: "Medium Kit",
    kind: "Kit",
    price: 26000,
    tagline: "The full wash-day routine in one go.",
    benefits: ["Promotes healthy hair growth", "Everything from wash day to scalp oiling"],
    concerns: ["growth", "breakage", "dandruff", "softness"],
    images: ["full-set", "conditioner-close", "butter-close"],
    tone: "leaf",
    includes: ["Conditioner", "Anti-Dandruff Shampoo", "Hair Growth Oil", "3X Hair Growth Butter"],
  },
  {
    slug: "scalp-massager",
    name: "Scalp Massager",
    short: "Scalp Massager",
    kind: "Tool",
    price: 4000,
    tagline: "A scalp massager and shampoo brush with soft bristles.",
    benefits: ["Works shampoo into the scalp", "Massages while you oil"],
    concerns: [],
    images: ["scalp-massager"],
    tone: "blush",
  },
  {
    slug: "dermal-roller",
    name: "Dermal Roller",
    short: "Dermal Roller",
    kind: "Tool",
    price: 7000,
    tagline: "A roller with three replaceable heads.",
    benefits: [],
    concerns: [],
    images: ["dermal-roller", "dermal-roller-beard"],
    tone: "mint",
  },
  {
    slug: "beard-oil",
    name: "Beard Oil",
    short: "Beard Oil",
    kind: "Beard",
    price: 10000,
    tagline: "100% natural, made for the men.",
    benefits: ["Nutrient-rich oils promote a fuller, thicker-looking beard", "Adds a healthy, non-greasy shine", "Moisturises the skin and helps prevent beard dandruff"],
    concerns: [],
    images: ["beard-oil"],
    tone: "butter",
  },
  {
    slug: "beard-wash-combo",
    name: "Beard Wash Combo",
    short: "Beard Combo",
    kind: "Beard",
    price: 5000,
    tagline: "Beard wash and beard conditioner.",
    benefits: ["Beard wash and conditioner together"],
    concerns: [],
    images: ["beard-wash"],
    tone: "leaf",
    includes: ["Beard Wash", "Beard Conditioner"],
  },
];

/* Cart keys are "slug" or "slug@size". */
export const keyOf = (slug: string, size?: string) => (size ? `${slug}@${size}` : slug);
export const fromKey = (key: string) => {
  const [slug, size] = key.split("@");
  const p = products.find((x) => x.slug === slug);
  if (!p) return null;
  const sz = size ? p.sizes?.find((x) => x.label === size) : undefined;
  return { p, size: sz?.label ?? p.size, price: sz?.price ?? p.price, label: sz ? `${p.name} (${sz.label})` : p.name };
};
export const bySlug = (s?: string) => products.find((p) => p.slug === s);

export const routine = products.filter((p) => p.step).sort((a, b) => (a.step ?? 0) - (b.step ?? 0));

export const naira = (n: number) => "₦" + n.toLocaleString("en-NG");

export const toneBg: Record<Product["tone"], string> = {
  leaf: "bg-leaf-soft",
  blush: "bg-blush-soft",
  butter: "bg-butter-soft",
  mint: "bg-mint-soft",
};

export const waLink = (text: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
