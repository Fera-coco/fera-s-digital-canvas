/*
  Every claim below is copied from Superb Naturals' own labels or WhatsApp catalogue.
  Only one real price is known so far (Mini kit, ₦15,000). Everything else shows
  "Price coming soon" until Honeybell sends her price list. Never fill in a guess.
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

export interface Product {
  slug: string;
  name: string;
  short: string;
  kind: "Oil" | "Wash" | "Butter" | "Kit";
  price: number | null; // naira; null = not sent yet
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
    price: null,
    tagline: "Infused with raw herbs and over 10 active oils.",
    benefits: ["Promotes faster and thicker hair growth", "Reduces dandruff", "Stops itching and breakage"],
    concerns: ["growth", "dandruff", "breakage"],
    step: 4,
    stepLabel: "Oil the scalp",
    images: ["growth-oil-trio", "growth-oil-pair", "growth-oil-hand", "hair-pink"],
    tone: "leaf",
  },
  {
    slug: "essential-edge-oil",
    name: "Essential Edge Oil",
    short: "Edge Oil",
    kind: "Oil",
    price: null,
    tagline: "Raw herbs and over 10 active oils, made for your edges.",
    benefits: ["Boosts edge growth", "Promotes a healthy scalp and reduces dandruff", "Reduces itching and breakage"],
    concerns: ["edges", "dandruff", "breakage"],
    step: 5,
    stepLabel: "Finish the edges",
    images: ["edge-oil-trio", "edge-oil-hand"],
    tone: "blush",
  },
  {
    slug: "anti-dandruff-shampoo",
    name: "Anti-Dandruff Shampoo",
    short: "Shampoo",
    kind: "Wash",
    price: null,
    tagline: "A clean scalp is where healthy hair starts.",
    benefits: ["Cleans hair and scalp", "Exfoliates dead skin cells", "Stops itching and dandruff", "Prevents hair damage"],
    concerns: ["dandruff"],
    step: 1,
    stepLabel: "Cleanse",
    images: ["shampoo-conditioner-garden", "full-set"],
    tone: "mint",
  },
  {
    slug: "conditioner",
    name: "Conditioner",
    short: "Conditioner",
    kind: "Wash",
    price: null,
    tagline: "For all hair types.",
    benefits: ["Promotes healthy hair growth", "Promotes softness", "Helps to strengthen and detangle hair", "Prevents hair damage"],
    concerns: ["softness", "breakage", "growth"],
    step: 2,
    stepLabel: "Condition",
    images: ["conditioner-close", "shampoo-conditioner-garden", "full-set"],
    tone: "butter",
  },
  {
    slug: "3x-hair-growth-butter",
    name: "3X Hair Growth Butter",
    short: "Growth Butter",
    kind: "Butter",
    price: null,
    tagline: "Infused with raw herbs and active oils.",
    benefits: ["Nourishes hair for growth", "Helps restore damaged hair", "Reduces itching and breakage"],
    concerns: ["growth", "breakage", "softness"],
    step: 3,
    stepLabel: "Moisturise & seal",
    images: ["butter-close", "full-set", "butter-jar"],
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
];

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
