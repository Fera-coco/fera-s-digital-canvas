import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { abs, imageAltFor, imageFor, jsonLd, type PageMeta } from "@/content/seo";
import { t } from "@/lib/i18n";

/** Reveal anything marked data-reveal as it enters the viewport. */
export function useReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!document.documentElement.classList.contains("motion-ok")) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const els = document.querySelectorAll("[data-reveal]:not(.is-in)");
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
}

/** Scroll to top on new pages, or to the hash target when one is given. */
export function useScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      // wait a frame so the destination page has rendered
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView();
      });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
}

/** Per-page title, description and canonical URL for SEO and sharing. */
/** Keep the document head in step with the room: title, description, canonical, social cards and structured data. */
export function usePageMeta(m: PageMeta) {
  useEffect(() => {
    const title = t(m.title);
    const description = t(m.description);
    document.title = title;
    const head = document.head;
    const meta = (key: "name" | "property", id: string, value: string) => {
      let el = head.querySelector<HTMLMetaElement>(`meta[${key}="${id}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(key, id);
        head.appendChild(el);
      }
      el.setAttribute("content", value);
    };
    const url = abs(m.path);
    meta("name", "description", description);
    meta("name", "robots", m.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    meta("property", "og:title", title);
    meta("property", "og:description", description);
    meta("property", "og:url", url);
    meta("property", "og:type", m.type ?? "website");
    meta("property", "og:image", imageFor(m));
    meta("property", "og:image:alt", imageAltFor(m));
    meta("name", "twitter:title", title);
    meta("name", "twitter:description", description);
    meta("name", "twitter:image", imageFor(m));
    head.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
    const ld = head.querySelector<HTMLScriptElement>("script#ld-json");
    if (ld) ld.textContent = JSON.stringify(jsonLd(m));
  }, [m]);
}
