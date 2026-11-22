import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { allMeta } from "./meta";

/* Keeps the title, description, canonical link and structured data in step
   with the page the visitor is on (the build step writes the same values
   into each page's HTML for crawlers that don't run JavaScript). */
const SITE = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ?? location.origin + import.meta.env.BASE_URL.replace(/\/$/, "");
const META = allMeta(SITE);

const setTag = (sel: string, attr: string, key: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(sel);
  if (!el) {
    el = document.createElement(sel.startsWith("link") ? "link" : "meta") as HTMLMetaElement;
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute(sel.startsWith("link") ? "href" : "content", value);
};

export function useRouteMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const path = pathname.replace(/\/$/, "") || "/";
    const m = META.find((x) => x.path === path) ?? (path.startsWith("/order") || path === "/cart" ? { path, title: "Your bag | Superb Naturals", description: META[0].description } : META[0]);
    document.title = m.title;
    setTag('meta[name="description"]', "name", "description", m.description);
    setTag('meta[property="og:title"]', "property", "og:title", m.title);
    setTag('meta[property="og:description"]', "property", "og:description", m.description);
    setTag('meta[property="og:url"]', "property", "og:url", SITE + (path === "/" ? "/" : path));
    setTag('link[rel="canonical"]', "rel", "canonical", SITE + (path === "/" ? "/" : path));
    document.querySelectorAll("script[data-route-ld]").forEach((s) => s.remove());
    (m as { jsonLd?: object[] }).jsonLd?.forEach((j) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.dataset.routeLd = "";
      s.textContent = JSON.stringify(j);
      document.head.appendChild(s);
    });
  }, [pathname]);
}
