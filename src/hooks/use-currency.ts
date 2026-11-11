import { useCallback, useEffect, useState } from "react";
import type { Currency } from "@/content/pricing";

const STORE = "feras-studio-currency";
const EVENT = "feras-studio-currency";

/* Visitors in Benin (or reading in French) see CFA first; everyone else sees naira. The choice is remembered and shared across the site. */
const initial = (): Currency => {
  try {
    const saved = localStorage.getItem(STORE);
    if (saved === "NGN" || saved === "XOF") return saved;
  } catch {
    /* storage unavailable */
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === "Africa/Porto-Novo" || navigator.language.toLowerCase().startsWith("fr")) return "XOF";
  } catch {
    /* ignore */
  }
  return "NGN";
};

export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>("NGN");
  useEffect(() => {
    setCurrency(initial());
    const sync = (e: Event) => setCurrency((e as CustomEvent<Currency>).detail);
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  const choose = useCallback((c: Currency) => {
    try {
      localStorage.setItem(STORE, c);
    } catch {
      /* storage unavailable */
    }
    window.dispatchEvent(new CustomEvent<Currency>(EVENT, { detail: c }));
  }, []);
  return [currency, choose] as const;
}
