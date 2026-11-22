import { useSyncExternalStore } from "react";

/* Cart, wishlist and the last routine-quiz answer for the demo.
   Everything stays in the visitor's own browser. */

export type Line = { slug: string; qty: number };
export type Order = { ref: string; lines: Line[]; name: string; phone: string; address: string; area: string; zone: string; email: string; fee: number | null; note: string; at: string };
type State = { cart: Line[]; loved: string[]; orders: Order[] };

const KEY = `superb-naturals-${import.meta.env.VITE_THEME ?? "bloom"}-v4`;
const empty: State = { cart: [], loved: [], orders: [] };

const read = (): State => {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "null");
    if (s && Array.isArray(s.cart)) return { ...empty, ...s };
  } catch {
    /* storage unavailable */
  }
  return empty;
};

let state: State = read();
const subs = new Set<() => void>();
const set = (fn: (s: State) => State) => {
  state = fn(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
  subs.forEach((f) => f());
};

export const useStore = () =>
  useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => state,
  );

export const addToCart = (slug: string, qty = 1) =>
  set((s) => {
    const hit = s.cart.find((l) => l.slug === slug);
    const cart = hit ? s.cart.map((l) => (l.slug === slug ? { ...l, qty: Math.min(20, l.qty + qty) } : l)) : [...s.cart, { slug, qty }];
    return { ...s, cart };
  });

export const setQty = (slug: string, qty: number) =>
  set((s) => ({ ...s, cart: qty <= 0 ? s.cart.filter((l) => l.slug !== slug) : s.cart.map((l) => (l.slug === slug ? { ...l, qty: Math.min(20, qty) } : l)) }));

export const toggleLove = (slug: string) =>
  set((s) => ({ ...s, loved: s.loved.includes(slug) ? s.loved.filter((x) => x !== slug) : [...s.loved, slug] }));

export const placeOrder = (o: Omit<Order, "ref" | "at" | "lines">) => {
  const ref = "SN-" + Math.random().toString(36).slice(2, 7).toUpperCase();
  set((s) => ({ ...s, orders: [{ ...o, ref, lines: s.cart, at: new Date().toISOString() }, ...s.orders].slice(0, 10), cart: [] }));
  return ref;
};

export const cartCount = (s: State) => s.cart.reduce((n, l) => n + l.qty, 0);
