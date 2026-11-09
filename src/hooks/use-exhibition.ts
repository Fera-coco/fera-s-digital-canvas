import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { site } from "@/content/site";

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
export function usePageMeta(title: string, description: string, path = "/") {
  useEffect(() => {
    document.title = title;
    const set = (selector: string, attr: string, value: string) => {
      const el = document.head.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };
    set('meta[name="description"]', "content", description);
    set('meta[property="og:title"]', "content", title);
    set('meta[property="og:description"]', "content", description);
    set('meta[property="og:url"]', "content", `${site.url}${path}`);
    set('link[rel="canonical"]', "href", `${site.url}${path}`);
  }, [title, description, path]);
}
