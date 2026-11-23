/*
  Search and social metadata for every public page.
  Used in two places: the app (updates the head as visitors move between rooms)
  and the build (writes a real HTML file per page so search engines and link
  previews see the right title, description and image without running JavaScript).
  Relative imports only: vite.config.ts imports this file.
*/
import { exhibits, type Exhibit } from "./exhibits";
import { site } from "./site";
import { priceGroups } from "./pricing";

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  heading: string; // plain-text page heading for the no-JavaScript fallback
  image?: string; // site-relative
  imageAlt?: string;
  type?: "website" | "article" | "profile";
  crumb?: string; // breadcrumb label
  noindex?: boolean;
  lang?: "en" | "fr";
  /** The same page in the other language (adds hreflang links). */
  alternate?: string;
  /** Plain text shown to search engines and AI assistants that don't run JavaScript. */
  body?: string[];
  faq?: { q: string; a: string }[];
}

export const OPEN_CALL_FAQ_EN = [
  {
    q: "Is the website really free? Is there a catch?",
    a: "Yes, it's free, and there's no catch. For the five businesses selected through The Open Call, Fera's Studio waives the website design and development fee. The business only pays for its own domain name and hosting, directly to the provider, not to Fera's Studio.",
  },
  {
    q: "Who can apply for a free website?",
    a: "Small businesses in Nigeria and Benin Republic, for example in Lagos, Abuja, Ibadan, Port Harcourt, Cotonou, Porto-Novo or Abomey-Calavi. The website can be in English, French or both.",
  },
  {
    q: "Does my business need to be registered?",
    a: "No. Your business doesn't need to be registered (for example with the CAC) to apply or to have a website.",
  },
  {
    q: "What kind of website do I get?",
    a: "A standard business website, service website or product catalogue that works well on phones and computers, with your products or services, contact details and a WhatsApp button. Complex online shops, custom integrations and inventory systems may need a separate agreement.",
  },
  {
    q: "What is a domain?",
    a: "Your website's address, like yourbrand.com.ng. You pay for it once a year to a domain provider, a bit like rent for your name online.",
  },
  {
    q: "What is hosting?",
    a: "Hosting is where your website lives so people can visit it. If the domain is your address, hosting is the house. For most small business websites it's low-cost, and Fera's Studio explains the options before you pay for anything.",
  },
  {
    q: "Is a website the same as a Google Business Profile?",
    a: "No. A Google Business Profile is your free listing on Google Search and Maps, with your location, opening hours, phone number and reviews. It's separate from your website, but the two work well together.",
  },
  {
    q: "How do I apply?",
    a: "Fill in the short application on https://ferasportfolio.vercel.app/apply. It takes about three minutes, and you can also send it by email or WhatsApp. Each application is reviewed, and a spot is only yours once Fera's Studio confirms it.",
  },
  {
    q: "What does Fera's Studio get in return?",
    a: "The finished website is featured in the Fera's Studio portfolio with the business name, screenshots and link. Confidential materials are never shown.",
  },
];

export const OPEN_CALL_FAQ_FR = [
  {
    q: "Le site web est-il vraiment gratuit ? Y a-t-il un piège ?",
    a: "Oui, il est gratuit, et il n'y a pas de piège. Pour les cinq entreprises sélectionnées dans le cadre de The Open Call, Fera's Studio offre la conception et le développement du site. L'entreprise paie seulement son nom de domaine et son hébergement, directement au fournisseur, pas à Fera's Studio.",
  },
  {
    q: "Qui peut demander un site web gratuit ?",
    a: "Les petites entreprises au Bénin et au Nigeria, par exemple à Cotonou, Porto-Novo, Abomey-Calavi, Parakou, Lagos ou Abuja. Le site peut être en français, en anglais ou dans les deux langues.",
  },
  {
    q: "Mon entreprise doit-elle être enregistrée ?",
    a: "Non. Votre entreprise n'a pas besoin d'être enregistrée officiellement pour postuler ou pour avoir un site web.",
  },
  {
    q: "Quel type de site vais-je recevoir ?",
    a: "Un site vitrine, un site de services ou un catalogue de produits adapté au téléphone et à l'ordinateur, avec vos produits ou services, vos contacts et un bouton WhatsApp. Une boutique en ligne complexe, des intégrations sur mesure ou une gestion de stock peuvent faire l'objet d'un accord séparé.",
  },
  {
    q: "Qu'est-ce qu'un nom de domaine ?",
    a: "C'est l'adresse de votre site, par exemple votremarque.bj ou votremarque.com. Vous le payez une fois par an à un fournisseur de domaines, un peu comme un loyer pour votre nom en ligne.",
  },
  {
    q: "Qu'est-ce que l'hébergement ?",
    a: "L'hébergement, c'est l'endroit où vit votre site pour que les gens puissent le visiter. Si le domaine est votre adresse, l'hébergement est la maison. Pour la plupart des petites entreprises, il coûte peu, et Fera's Studio vous explique les options avant tout paiement.",
  },
  {
    q: "Un site web, est-ce la même chose qu'une fiche Google Business Profile ?",
    a: "Non. Une fiche Google Business Profile est votre présence gratuite sur la recherche Google et Google Maps, avec votre adresse, vos horaires, votre numéro et vos avis. Elle est distincte de votre site web, mais les deux se complètent très bien.",
  },
  {
    q: "Comment postuler ?",
    a: "Remplissez le court formulaire sur https://ferasportfolio.vercel.app/apply, en trois minutes environ, ou envoyez votre demande par e-mail ou WhatsApp. Chaque candidature est étudiée, et une place n'est réservée qu'après confirmation de Fera's Studio.",
  },
  {
    q: "Que reçoit Fera's Studio en échange ?",
    a: "Le site terminé est présenté dans le portfolio de Fera's Studio avec le nom de l'entreprise, des captures d'écran et le lien. Les documents confidentiels ne sont jamais montrés.",
  },
];

export const DEFAULT_IMAGE = "/og.png";
const DEFAULT_IMAGE_ALT = "Fera's Studio: a digital exhibition of design and development work by Fera.";

export const PAGES = {
  home: {
    path: "/",
    title: "Fera's Studio: website design for small businesses in Nigeria & Benin",
    description:
      "Fera's Studio designs and builds websites, online shops and SEO for small businesses in Nigeria and Benin Republic (Lagos, Cotonou and beyond), in English and French, with prices in naira and CFA.",
    heading: "Fera's Studio: a digital exhibition of design and development work",
  },
  visit: {
    path: "/visit",
    title: "The gallery walk | Fera's Studio",
    description: "Walk through Fera's Studio: an interactive gallery of UX/UI design, product design and web development work by Fera.",
    heading: "The gallery walk",
    crumb: "The gallery walk",
  },
  collection: {
    path: "/collection",
    title: "The Collection: UX/UI and web development portfolio | Fera's Studio",
    description: "Selected work from Fera's Studio: product design, UX/UI case studies, websites and web apps designed and built by Fera.",
    heading: "The Collection",
    crumb: "The Collection",
  },
  curator: {
    path: "/curator",
    title: "About Fera: UX/UI designer & front-end developer | Fera's Studio",
    description:
      "About Fera (Peace Oluwaferanmi Segun-Babs), the UX/UI designer and front-end developer behind Fera's Studio: background, skills and experience.",
    heading: "The Curator: about Fera",
    type: "profile",
    crumb: "The Curator",
  },
  studio: {
    path: "/studio",
    title: "Services & prices: websites, SEO and social media | Fera's Studio",
    description:
      "Fera's Studio services and prices in naira and CFA francs: websites, e-commerce, website audits and SEO, workflow automation, social media and Google Business for businesses in Nigeria and Benin.",
    heading: "The Studio: services and prices",
    crumb: "The Studio",
  },
  contact: {
    path: "/contact",
    title: "Contact Fera | Fera's Studio",
    description: "Start a project with Fera's Studio. Email Fera about your website, product or idea.",
    heading: "The Exit: contact Fera",
    crumb: "Contact",
  },
  openCall: {
    path: "/open-call",
    title: "Free website for small businesses in Nigeria & Benin | The Open Call by Fera's Studio",
    description:
      "Get a free business website: Fera's Studio is designing and building websites for five small businesses in Nigeria and Benin Republic with no design or development fee. Apply online in three minutes.",
    heading: "The Open Call: a free website for five small businesses in Nigeria and Benin",
    crumb: "The Open Call",
    alternate: "/site-web-gratuit",
    body: [
      "The Open Call is a Fera's Studio initiative: five small businesses in Nigeria and Benin Republic get a professionally designed and developed website, free of design and development fees.",
      "Each website is mobile friendly, built around the business, and can include products or services, prices, photos, contact details, a WhatsApp button and a Google-ready setup. The business pays only for its domain name and hosting.",
      "Apply at https://ferasportfolio.vercel.app/apply or message Fera on WhatsApp.",
    ],
    faq: OPEN_CALL_FAQ_EN,
  },
  freeWebsiteFr: {
    path: "/site-web-gratuit",
    title: "Site web gratuit pour petites entreprises au Bénin et au Nigeria | Fera's Studio",
    description:
      "Obtenez un site web gratuit pour votre entreprise : Fera's Studio conçoit et développe le site de cinq petites entreprises au Bénin et au Nigeria, sans frais de conception ni de développement. Candidature en ligne en trois minutes.",
    heading: "The Open Call : un site web gratuit pour cinq petites entreprises au Bénin et au Nigeria",
    crumb: "Site web gratuit",
    lang: "fr",
    alternate: "/open-call",
    body: [
      "The Open Call est une initiative de Fera's Studio, basé à Cotonou : cinq petites entreprises au Bénin et au Nigeria reçoivent un site web professionnel, sans frais de conception ni de développement.",
      "Chaque site est adapté au téléphone, pensé pour l'entreprise, et peut présenter vos produits ou services, vos prix, vos photos, vos contacts, un bouton WhatsApp et une configuration prête pour Google. L'entreprise paie seulement son nom de domaine et son hébergement.",
      "Postulez sur https://ferasportfolio.vercel.app/apply ou écrivez à Fera sur WhatsApp.",
    ],
    faq: OPEN_CALL_FAQ_FR,
  },
  openCallApply: {
    path: "/apply",
    title: "Apply for a free website (Nigeria & Benin): The Open Call | Fera's Studio",
    description:
      "Apply for one of five free websites for businesses in Nigeria and Benin Republic. Three short steps, about three minutes.",
    heading: "Apply for a free website",
    crumb: "Apply",
  },
} satisfies Record<string, PageMeta>;

export const exhibitMeta = (ex: Exhibit): PageMeta => ({
  path: `/work/${ex.slug}`,
  title: `${ex.title}: ${ex.medium} | Fera's Studio`,
  description: ex.summary,
  heading: `${ex.title}: ${ex.medium}`,
  image: ex.cover.src,
  imageAlt: ex.cover.alt,
  type: "article",
  crumb: ex.title,
});

export const allPages = (): PageMeta[] => [...Object.values(PAGES), ...exhibits.map(exhibitMeta)];

export const abs = (p: string) => `${site.url}${p === "/" ? "/" : p}`;
export const imageFor = (m: PageMeta) => abs(m.image ?? DEFAULT_IMAGE);
export const imageAltFor = (m: PageMeta) => m.imageAlt ?? DEFAULT_IMAGE_ALT;

/* ---------- structured data (schema.org JSON-LD) ---------- */

const PERSON_ID = `${site.url}/#person`;
const WEBSITE_ID = `${site.url}/#website`;
const STUDIO_ID = `${site.url}/#studio`;

/** The studio as a local business, so search engines and AI assistants know what it offers and where. */
const studioNode = () => ({
  "@type": "ProfessionalService",
  "@id": STUDIO_ID,
  name: site.studio,
  url: `${site.url}/`,
  logo: abs("/apple-touch-icon.png"),
  image: abs(DEFAULT_IMAGE),
  description: PAGES.home.description,
  email: site.email,
  telephone: site.phone,
  address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: site.country },
  areaServed: [
    { "@type": "Country", name: "Nigeria" },
    { "@type": "Country", name: "Benin" },
  ],
  availableLanguage: ["English", "French"],
  currenciesAccepted: "NGN, XOF",
  priceRange: "₦20,000 – ₦400,000+",
  founder: { "@id": PERSON_ID },
  sameAs: site.studioProfiles,
  knowsAbout: ["Website design", "Web development", "E-commerce websites", "SEO", "Google Business Profile", "UX/UI design", "Social media design"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Fera's Studio services and prices",
    url: abs("/studio"),
    itemListElement: priceGroups.map((g) => ({
      "@type": "OfferCatalog",
      name: g.title,
      itemListElement: g.items.map((it) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: it.name, description: it.includes },
        priceSpecification: {
          "@type": "PriceSpecification",
          ...(it.from ? { minPrice: it.ngn } : { price: it.ngn }),
          priceCurrency: "NGN",
        },
      })),
    })),
  },
});

export const jsonLd = (m: PageMeta) => {
  const url = abs(m.path);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: `${site.url}/`,
      name: site.studio,
      inLanguage: ["en", "fr"],
      publisher: { "@id": STUDIO_ID },
    },
    studioNode(),
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: site.person,
      alternateName: site.shortName,
      jobTitle: "UX/UI Designer & Front-End Developer",
      url: `${site.url}/curator`,
      email: `mailto:${site.email}`,
      worksFor: { "@id": STUDIO_ID },
      knowsAbout: ["UX design", "UI design", "Product design", "Web development", "Front-end development", "React"],
      sameAs: site.socials.map((s) => s.href),
    },
    {
      "@type": m.type === "profile" ? "ProfilePage" : "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: m.title,
      description: m.description,
      isPartOf: { "@id": WEBSITE_ID },
      inLanguage: m.lang ?? "en",
      primaryImageOfPage: { "@type": "ImageObject", url: imageFor(m) },
      ...(m.type === "profile" ? { mainEntity: { "@id": PERSON_ID } } : { about: { "@id": PERSON_ID } }),
    },
  ];

  if (m.crumb) {
    const parent = m.path.startsWith("/work/") ? [{ name: PAGES.collection.crumb, url: abs(PAGES.collection.path) }] : [];
    const trail = [{ name: "Home", url: `${site.url}/` }, ...parent, { name: m.crumb, url }];
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: trail.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: t.url })),
    });
  }

  if (m.faq?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      inLanguage: m.lang ?? "en",
      mainEntity: m.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }

  if (m.path.startsWith("/work/")) {
    graph.push({
      "@type": "CreativeWork",
      "@id": `${url}#work`,
      name: m.crumb,
      headline: m.heading,
      description: m.description,
      url,
      image: imageFor(m),
      creator: { "@id": PERSON_ID },
      isPartOf: { "@id": WEBSITE_ID },
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
};
