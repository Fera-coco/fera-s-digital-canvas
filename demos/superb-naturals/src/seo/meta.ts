/* Page titles, descriptions and structured data, shared by the app (at runtime)
   and the build step (which writes a real HTML file per page for Google and
   WhatsApp link previews). Nothing here may invent facts: prices, sizes and
   benefits come from the product data. */
import { products, naira, type Product } from "../data/products";
import { REFUND_POLICY, ZONES } from "../data/delivery";

export const BRAND = "Superb Naturals";
export const LEGAL = "Superb Natural Beauty Ventures";
export const PHONE = "+2348020866239";

export type Meta = {
  path: string; // route path without base, e.g. "/shop/mini-kit"
  title: string;
  description: string;
  image?: string; // file name in /img, without extension
  jsonLd?: object[];
  body?: string; // plain HTML for <noscript>, so the page has real text without JavaScript
};

const sizeOf = (p: Product) => p.size ?? p.sizes?.map((s) => s.label).join(" / ");
const priceOf = (p: Product) => (p.sizes ? `from ${naira(p.price)}` : naira(p.price));

export const productMeta = (p: Product, site: string): Meta => {
  const size = sizeOf(p);
  const desc = `${p.name}${size ? ` (${size})` : ""} by Superb Naturals, ${priceOf(p)}. ${p.tagline} ${p.benefits.slice(0, 2).join(". ")}${p.benefits.length ? "." : ""} Delivery across Nigeria.`
    .replace(/\.\./g, ".")
    .slice(0, 300);
  const offers = (p.sizes ?? [{ label: p.size ?? "", price: p.price }]).map((s) => ({
    "@type": "Offer",
    price: s.price,
    priceCurrency: "NGN",
    ...(s.label ? { name: s.label } : {}),
    url: `${site}/shop/${p.slug}`,
    seller: { "@type": "Organization", name: BRAND },
  }));
  return {
    path: `/shop/${p.slug}`,
    title: `${p.name}${size ? ` ${size}` : ""} | ${priceOf(p)} | ${BRAND}`,
    description: desc,
    image: p.images[0],
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: p.name,
        description: [p.tagline, ...p.benefits].join(" "),
        image: p.images.map((i) => `${site}/img/${i}.webp`),
        brand: { "@type": "Brand", name: BRAND },
        offers: offers.length === 1 ? offers[0] : { "@type": "AggregateOffer", priceCurrency: "NGN", lowPrice: Math.min(...offers.map((o) => o.price)), highPrice: Math.max(...offers.map((o) => o.price)), offerCount: offers.length, offers },
      },
      breadcrumb(site, [["Shop", "/shop"], [p.name, `/shop/${p.slug}`]]),
    ],
    body: `<h1>${p.name}</h1><p>${priceOf(p)}${size ? ` · ${size}` : ""}</p><p>${p.tagline}</p><ul>${p.benefits.map((b) => `<li>${b}</li>`).join("")}</ul>${p.includes ? `<p>Includes: ${p.includes.join(", ")}</p>` : ""}<p>For external use only.</p>`,
  };
};

const breadcrumb = (site: string, items: [string, string][]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [["Home", "/"], ...items].map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${site}${path === "/" ? "/" : path}` })),
});

const list = (site: string) => `<ul>${products.map((p) => `<li><a href="${site}/shop/${p.slug}">${p.name}</a>, ${priceOf(p)}</li>`).join("")}</ul>`;

export function allMeta(site: string): Meta[] {
  const store = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: BRAND,
    legalName: LEGAL,
    url: `${site}/`,
    logo: `${site}/img/logo.webp`,
    image: `${site}/og.jpg`,
    telephone: PHONE,
    slogan: "Unlock your hair full potential",
    description: "Natural hair care products made with raw herbs and active oils: hair growth oil, edge oil, anti-dandruff shampoo, conditioner, hair growth butter and beard care.",
    areaServed: ["NG", "GB", "US", "CA", "EU"],
    contactPoint: { "@type": "ContactPoint", telephone: PHONE, contactType: "customer service", availableLanguage: ["en"] },
  };
  return [
    {
      path: "/",
      title: `${BRAND} | Natural Hair Growth Oil, Edge Oil & Hair Care in Nigeria`,
      description: "Shop natural hair care from Superb Naturals: hair growth oil, essential edge oil, anti-dandruff shampoo, conditioner, 3X hair growth butter, kits and beard care. Made with raw herbs. Delivery across Nigeria and abroad.",
      image: "hair-pink",
      jsonLd: [store, { "@context": "https://schema.org", "@type": "WebSite", name: BRAND, url: `${site}/` }],
      body: `<h1>Superb Naturals: unlock your hair's full potential</h1><p>Natural hair care made with raw herbs and over 10 active oils. Delivery across Nigeria and internationally. Pay by bank transfer.</p>${list(site)}`,
    },
    {
      path: "/shop",
      title: `Shop Natural Hair Care Products | ${BRAND}`,
      description: "All Superb Naturals products and prices in naira: hair growth oil (50ml and 100ml), essential edge oil, shampoo, conditioner, hair growth butter, mini and medium kits, scalp massager and beard care.",
      image: "full-set",
      jsonLd: [{ "@context": "https://schema.org", "@type": "ItemList", itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${site}/shop/${p.slug}`, name: p.name })) }, breadcrumb(site, [["Shop", "/shop"]])],
      body: `<h1>Shop all products</h1>${list(site)}`,
    },
    {
      path: "/routine",
      title: `Find Your Hair Care Routine | ${BRAND}`,
      description: "Answer three quick questions about your hair and get a routine built from the Superb Naturals range, in the order to use it.",
      image: "hair-puff",
      body: "<h1>Find your hair care routine</h1><p>Three quick questions: what your hair needs, how you wear it and how often you wash it.</p>",
    },
    {
      path: "/delivery",
      title: `Delivery Fees Across Nigeria & International Shipping | ${BRAND}`,
      description: `Superb Naturals delivers nationwide across Nigeria and internationally. Delivery from ${naira(Math.min(...ZONES.filter((z) => z.fee).map((z) => z.fee!)))}. Orders dispatched within 2–3 days after payment is confirmed.`,
      body: `<h1>Delivery</h1><table>${ZONES.filter((z) => z.fee).map((z) => `<tr><td>${z.label}</td><td>${naira(z.fee!)}</td></tr>`).join("")}</table><p>International delivery is quoted on WhatsApp.</p>`,
    },
    {
      path: "/refund-policy",
      title: `Refund & Return Policy | ${BRAND}`,
      description: "Read the Superb Naturals refund and return policy: wrong or damaged products, order cancellation, delivery fees and international orders.",
      body: `<h1>Refund & return policy</h1>${REFUND_POLICY.map((s) => `<h2>${s.title}</h2><ul>${s.points.map((x) => `<li>${x}</li>`).join("")}</ul>`).join("")}`,
    },
    ...products.map((p) => productMeta(p, site)),
  ];
}
