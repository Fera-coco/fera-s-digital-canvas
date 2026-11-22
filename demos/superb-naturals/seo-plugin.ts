/* After the build, write one HTML file per page with its own title, description,
   social preview tags, structured data and readable text. Google and WhatsApp
   link previews read these without running JavaScript.
   Set VITE_SITE_URL (e.g. https://superbnaturals.com.ng) for the live site:
   pages become indexable and a sitemap.xml and robots.txt are written.
   Without it (the demo), every page is marked noindex. */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";
import { allMeta } from "./src/seo/meta";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default function seo(opts: { site?: string; base: string }): Plugin {
  let outDir = "dist";
  return {
    name: "superb-seo",
    apply: "build",
    configResolved(c) {
      outDir = c.build.outDir;
    },
    closeBundle() {
      const live = !!opts.site;
      const site = (opts.site ?? "https://ferasportfolio.vercel.app" + opts.base).replace(/\/$/, "");
      const tpl = readFileSync(join(outDir, "index.html"), "utf8");
      const pages = allMeta(site);
      for (const m of pages) {
        const url = site + (m.path === "/" ? "/" : m.path);
        const image = m.image ? `${site}/img/${m.image}.webp` : `${site}/og.jpg`;
        const head = [
          `<title>${esc(m.title)}</title>`,
          `<meta name="description" content="${esc(m.description)}" />`,
          live ? `<link rel="canonical" href="${url}" />` : `<meta name="robots" content="noindex, nofollow" />`,
          `<meta property="og:type" content="${m.path.startsWith("/shop/") ? "product" : "website"}" />`,
          `<meta property="og:site_name" content="Superb Naturals" />`,
          `<meta property="og:locale" content="en_NG" />`,
          `<meta property="og:title" content="${esc(m.title)}" />`,
          `<meta property="og:description" content="${esc(m.description)}" />`,
          `<meta property="og:url" content="${url}" />`,
          `<meta property="og:image" content="${m.path === "/" ? `${site}/og.jpg` : image}" />`,
          `<meta name="twitter:card" content="summary_large_image" />`,
          ...(m.jsonLd ?? []).map((j) => `<script type="application/ld+json" data-route-ld>${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`),
        ].join("\n    ");
        const html = tpl
          .replace(/<!--seo:start-->[\s\S]*<!--seo:end-->/, head)
          .replace("<!--noscript-->", m.body ? `<noscript>${m.body}</noscript>` : "");
        const dir = m.path === "/" ? outDir : join(outDir, m.path);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, "index.html"), html);
      }
      if (live) {
        writeFileSync(join(outDir, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /cart\nDisallow: /order/\n\nSitemap: ${site}/sitemap.xml\n`);
        const today = new Date().toISOString().slice(0, 10);
        writeFileSync(
          join(outDir, "sitemap.xml"),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
            .map((m) => `  <url><loc>${site}${m.path === "/" ? "/" : m.path}</loc><lastmod>${today}</lastmod></url>`)
            .join("\n")}\n</urlset>\n`,
        );
      }
    },
  };
}
