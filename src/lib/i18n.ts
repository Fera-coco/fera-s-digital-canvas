/*
  English / French.
  Every visible string goes through t(). English is the source; French lives in
  src/i18n/fr.ts as { "English text": "Texte français" }. Anything missing from the
  dictionary falls back to English, so nothing ever shows blank.
  The language is a module-level setting: changing it remounts the app (see main.tsx).
*/

export type Lang = "en" | "fr";

const KEY = "feras-studio-lang";
const EVENT = "feras-studio-lang";

let lang: Lang = "en";
let dict: Record<string, string> = {};
let patterns: [RegExp, (m: RegExpMatchArray) => string][] = [];

export const getLang = () => lang;

/** Translate a string. Non-strings (numbers, elements, undefined) pass straight through. */
export function t<T>(value: T): T {
  if (lang === "en" || typeof value !== "string") return value;
  const hit = dict[value] ?? dict[value.trim()];
  if (hit !== undefined) return hit as T;
  for (const [re, fn] of patterns) {
    const m = value.match(re);
    if (m) return fn(m) as T;
  }
  return value;
}

/** Translate a template with {placeholders}: tf("{n} of {m} spots left", { n: "03", m: "05" }). */
export function tf(template: string, vars: Record<string, string | number>) {
  return t(template).replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

const loadFrench = async () => {
  if (Object.keys(dict).length) return;
  const mod = await import("@/i18n/fr");
  dict = mod.fr;
  patterns = mod.frPatterns;
};

/** Pick the starting language: saved choice, else French for Benin or French-speaking browsers. */
export const initialLang = (): Lang => {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "fr") return saved;
  } catch {
    /* storage unavailable */
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === "Africa/Porto-Novo" || navigator.language.toLowerCase().startsWith("fr")) return "fr";
  } catch {
    /* ignore */
  }
  return "en";
};

export async function applyLang(next: Lang, persist = false) {
  if (next === "fr") await loadFrench();
  lang = next;
  document.documentElement.lang = next;
  if (persist) {
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable */
    }
  }
  window.dispatchEvent(new CustomEvent<Lang>(EVENT, { detail: next }));
}

export const onLangChange = (fn: (l: Lang) => void) => {
  const h = (e: Event) => fn((e as CustomEvent<Lang>).detail);
  window.addEventListener(EVENT, h);
  return () => window.removeEventListener(EVENT, h);
};

/** Locale for dates and numbers. */
export const locale = () => (lang === "fr" ? "fr-FR" : "en-GB");
