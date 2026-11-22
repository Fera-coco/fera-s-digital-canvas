import { useSyncExternalStore } from "react";
import { listings as seed, type Listing } from "../data/listings";

/* A tiny local store for the demo: saved homes, compare list, enquiries and
   listings added from the dashboard. Everything stays in this browser. */

export type Enquiry = {
  id: string;
  slug: string;
  name: string;
  phone: string;
  kind: "Inspection" | "Question" | "Report";
  when?: string;
  message?: string;
  status: "New" | "Contacted" | "Inspection booked" | "Closed";
  at: string;
};

type State = { saved: string[]; compare: string[]; enquiries: Enquiry[]; added: Listing[]; hidden: string[] };

const KEY = "brightdoor-demo-v1";
const sampleEnquiries: Enquiry[] = [
  { id: "e1", slug: "3-bed-flat-lekki-phase-1", name: "Adaeze N.", phone: "0803 000 0000", kind: "Inspection", when: "Sat, 10:00", status: "New", at: "Today, 9:12" },
  { id: "e2", slug: "mini-flat-yaba", name: "Kunle S.", phone: "0812 000 0000", kind: "Question", message: "Is the caution refundable in full?", status: "Contacted", at: "Yesterday" },
  { id: "e3", slug: "4-bed-semi-detached-lekki-sale", name: "Mrs Bello", phone: "0705 000 0000", kind: "Inspection", when: "Mon, 14:00", status: "Inspection booked", at: "2 days ago" },
];

const read = (): State => {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "null");
    if (s) return s;
  } catch {
    /* storage unavailable */
  }
  return { saved: [], compare: [], enquiries: sampleEnquiries, added: [], hidden: [] };
};

let state: State = read();
const subs = new Set<() => void>();
const set = (fn: (s: State) => State) => {
  state = fn(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  subs.forEach((f) => f());
};
const subscribe = (f: () => void) => {
  subs.add(f);
  return () => subs.delete(f);
};

export const useStore = () => useSyncExternalStore(subscribe, () => state);
export const allListings = (s: State) => [...s.added, ...seed].filter((l) => !s.hidden.includes(l.slug));

export const actions = {
  toggleSaved: (slug: string) =>
    set((s) => ({ ...s, saved: s.saved.includes(slug) ? s.saved.filter((x) => x !== slug) : [...s.saved, slug] })),
  toggleCompare: (slug: string) =>
    set((s) => ({
      ...s,
      compare: s.compare.includes(slug) ? s.compare.filter((x) => x !== slug) : [...s.compare, slug].slice(-3),
    })),
  addEnquiry: (e: Omit<Enquiry, "id" | "status" | "at">) =>
    set((s) => ({ ...s, enquiries: [{ ...e, id: crypto.randomUUID(), status: "New", at: "Just now" }, ...s.enquiries] })),
  setEnquiryStatus: (id: string, status: Enquiry["status"]) =>
    set((s) => ({ ...s, enquiries: s.enquiries.map((e) => (e.id === id ? { ...e, status } : e)) })),
  addListing: (l: Listing) => set((s) => ({ ...s, added: [l, ...s.added] })),
  hideListing: (slug: string) => set((s) => ({ ...s, hidden: [...s.hidden, slug], added: s.added.filter((l) => l.slug !== slug) })),
  reset: () => set(() => ({ saved: [], compare: [], enquiries: sampleEnquiries, added: [], hidden: [] })),
};
