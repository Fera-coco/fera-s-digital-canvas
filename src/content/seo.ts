/*
  Search and social metadata for every public page.
  Used in two places: the app (updates the head as visitors move between rooms)
  and the build (writes a real HTML file per page so search engines and link
  previews see the right title, description and image without running JavaScript).
  Relative imports only: vite.config.ts imports this file.
*/
import { exhibits, type Exhibit } from "./exhibits";
import { site } from "./site";

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
}

export const DEFAULT_IMAGE = "/og.png";
const DEFAULT_IMAGE_ALT = "Fera's Studio: a digital exhibition of design and development work by Fera.";

export const PAGES = {
  home: {
    path: "/",
    title: "Fera's Studio: UX/UI design & web development by Fera",
    description:
      "Fera's Studio is the digital exhibition of Peace Oluwaferanmi Segun-Babs (Fera), a UX/UI designer and front-end developer in Nigeria designing and building websites, products and interfaces.",
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
    title: "Website design & development services | Fera's Studio",
    description:
      "Commission Fera's Studio for website design and development, UX/UI and product design, redesigns, landing pages and ordering flows.",
    heading: "The Studio: services",
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
    title: "The Open Call: five free websites for businesses in Nigeria & Benin Republic | Fera's Studio",
    description:
      "Five businesses in Nigeria and Benin Republic will get a professionally designed and developed website with no development fee. Apply online for The Open Call by Fera's Studio.",
    heading: "The Open Call: five businesses, five websites",
    crumb: "The Open Call",
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

export const jsonLd = (m: PageMeta) => {
  const url = abs(m.path);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: `${site.url}/`,
      name: site.studio,
      inLanguage: "en",
      publisher: { "@id": PERSON_ID },
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: site.person,
      alternateName: site.shortName,
      jobTitle: "UX/UI Designer & Front-End Developer",
      url: `${site.url}/curator`,
      email: `mailto:${site.email}`,
      worksFor: { "@type": "Organization", name: site.studio, url: `${site.url}/` },
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
      inLanguage: "en",
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
