import fs from "node:fs";
import path from "node:path";
import type { Plugin, ResolvedConfig } from "vite";
import { abs, allPages, imageAltFor, imageFor, jsonLd, PAGES, type PageMeta } from "../src/content/seo";
import { site } from "../src/content/site";

/*
  Writes search-friendly HTML for every public page.
  - index.html gets the home page's tags (dev and build).
  - After the build, each page gets its own file (e.g. dist/open-call.html,
    dist/work/readsmartly.html) with its own title, description, canonical URL,
    social card and structured data. Vercel serves these through cleanUrls,
    so crawlers and link previews get the right details without JavaScript.
  - sitemap.xml is generated from the same list, so it never goes stale.
*/

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const headFor = (m: PageMeta) => {
  const url = abs(m.path);
  const img = imageFor(m);
  const isPng = img.endsWith(".png");
  return [
    `<!--seo:start-->`,
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="robots" content="${m.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${m.type ?? "website"}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta property="og:image:alt" content="${esc(imageAltFor(m))}" />`,
    ...(isPng ? [`<meta property="og:image:width" content="1200" />`, `<meta property="og:image:height" content="630" />`] : []),
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${img}" />`,
    `<script type="application/ld+json" id="ld-json">${JSON.stringify(jsonLd(m)).replace(/</g, "\\u003c")}</script>`,
    `<!--seo:end-->`,
  ].join("\n    ");
};

const noscriptFor = (m: PageMeta) => {
  const links = allPages()
    .filter((p) => p.path !== m.path && !p.noindex)
    .map((p) => `<li><a href="${p.path}">${esc(p.crumb ?? "Home")}</a></li>`)
    .join("");
  return `<!--noscript:start-->
    <noscript>
      <main style="font-family: Georgia, serif; padding: 2rem; max-width: 40rem">
        <h1>${esc(m.heading)}</h1>
        <p>${esc(m.description)}</p>
        <p>Fera's Studio needs JavaScript to open the full exhibition. You can reach Fera at <a href="mailto:${site.email}">${site.email}</a>.</p>
        <nav aria-label="Pages"><ul>${links}</ul></nav>
      </main>
    </noscript>
    <!--noscript:end-->`;
};

const render = (html: string, m: PageMeta) =>
  html
    .replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, headFor(m))
    .replace(/<!--noscript:start-->[\s\S]*?<!--noscript:end-->/, noscriptFor(m));

const sitemap = () => {
  const today = new Date().toISOString().slice(0, 10);
  const urls = allPages()
    .filter((p) => !p.noindex)
    .map((p) => {
      const priority =
        p.path === "/" ? "1.0" : p.path === "/open-call" || p.path === "/collection" ? "0.9" : p.path.startsWith("/work/") ? "0.8" : "0.7";
      return `  <url><loc>${abs(p.path)}</loc><lastmod>${today}</lastmod><priority>${priority}</priority></url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

export default function seoPages(): Plugin {
  let config: ResolvedConfig;
  return {
    name: "feras-studio-seo",
    configResolved(c) {
      config = c;
    },
    transformIndexHtml: {
      order: "post",
      handler: (html) => render(html, PAGES.home),
    },
    closeBundle() {
      if (config.command !== "build") return;
      const out = path.resolve(config.root, config.build.outDir);
      const indexFile = path.join(out, "index.html");
      if (!fs.existsSync(indexFile)) return;
      const template = fs.readFileSync(indexFile, "utf8");
      for (const m of allPages()) {
        if (m.path === "/") continue;
        const file = path.join(out, `${m.path.slice(1)}.html`);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, render(template, m));
      }
      fs.writeFileSync(path.join(out, "sitemap.xml"), sitemap());
    },
  };
}
