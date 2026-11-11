/*
  Each visitor role walks its own route through the gallery.
  Stops are spot ids from the gallery walk: exhibit slugs, "portrait", "bio",
  "service-A"…"service-D", "prices", "guestbook", "exitdoor".
*/
import type { VisitorId } from "./visitors";
import { exhibits } from "./exhibits";
import { commissions } from "./services";

export interface Journey {
  id: VisitorId;
  routeTitle: string;
  intro: string; // said at the welcome sign
  route: string[]; // empty = free roam
  shortcut: { label: string; to: string }; // on the ticket desk, for visitors in a hurry
  finale: { title: string; text: string; primary: { label: string; to: string }; secondary?: { label: string; to: string } };
}

export const journeys: Record<VisitorId, Journey> = {
  client: {
    id: "client",
    routeTitle: "From idea to website",
    intro: "Your route shows real websites built for businesses, what you can commission, and what it costs.",
    route: ["gracelink-empire", "sweetsips", "service-A", "service-C", "service-D", "prices", "guestbook"],
    shortcut: { label: "In a hurry? See services and prices", to: "/studio" },
    finale: {
      title: "Ready to get your business online?",
      text: "Start a project with Fera's Studio, or apply for one of five free websites in The Open Call.",
      primary: { label: "Start a project", to: "/contact" },
      secondary: { label: "See The Open Call", to: "/open-call" },
    },
  },
  builder: {
    id: "builder",
    routeTitle: "The work and the person",
    intro: "Your route goes through Fera's strongest case studies, then the curator's room with her background and experience.",
    route: ["readsmartly", "we-go", "temu-product-comparison", "gracelink-empire", "portrait", "bio", "guestbook"],
    shortcut: { label: "In a hurry? Meet the curator", to: "/curator" },
    finale: {
      title: "Thinking of working with Fera?",
      text: "Read her full background in the curator's room, or get in touch directly.",
      primary: { label: "Meet the curator", to: "/curator" },
      secondary: { label: "Get in touch", to: "/contact" },
    },
  },
  sketcher: {
    id: "sketcher",
    routeTitle: "Process and craft",
    intro: "Your route stops at every case study, from research and design to the build, then the curator's note on how Fera works.",
    route: ["readsmartly", "we-go", "temu-product-comparison", "sweetsips", "gamerzverse", "gracelink-empire", "bio", "guestbook"],
    shortcut: { label: "In a hurry? Go straight to the case studies", to: "/collection" },
    finale: {
      title: "Want to dig into the details?",
      text: "Every exhibit has a full case study with the process, decisions and screens.",
      primary: { label: "Read the case studies", to: "/collection" },
      secondary: { label: "Say hello", to: "/contact" },
    },
  },
  dreamer: {
    id: "dreamer",
    routeTitle: "Wander freely",
    intro: "No set route for you. Wander, stop wherever something catches your eye, and sign the visitors' book on your way out.",
    route: [],
    shortcut: { label: "In a hurry? See the work as a page", to: "/collection" },
    finale: {
      title: "Hope you enjoyed the walk.",
      text: "Sign the visitors' book before you go, or wander back through the collection.",
      primary: { label: "Sign the visitors' book", to: "/contact#visitors-book" },
      secondary: { label: "See the collection", to: "/collection" },
    },
  },
};

export const getJourney = (id: VisitorId | null | undefined) => journeys[id ?? "dreamer"] ?? journeys.dreamer;

/* ---------- the route slip ---------- */


/** What each stop is called on the slip, and which room it's in. */
export const stopInfo = (id: string): { label: string; room: string } => {
  const ex = exhibits.find((e) => e.slug === id);
  if (ex) return { label: ex.title, room: "Room 01" };
  if (id === "portrait") return { label: "Portrait of the curator", room: "Room 02" };
  if (id === "bio") return { label: "The curator's note", room: "Room 02" };
  if (id.startsWith("service-")) {
    const c = commissions.find((x) => `service-${x.no}` === id);
    return { label: c?.title ?? id, room: "Room 03" };
  }
  if (id === "prices") return { label: "The price list", room: "Room 03" };
  if (id === "guestbook") return { label: "The visitors' book", room: "Room 04" };
  return { label: "Exit door", room: "Room 04" };
};

const PROGRESS_KEY = "feras-studio-route";

/** Ticked stops survive leaving the walk (to a case study, the price list…) and coming back. */
export const loadProgress = (role: VisitorId): string[] => {
  try {
    const raw = JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "null");
    return raw && raw.role === role && Array.isArray(raw.done) ? raw.done : [];
  } catch {
    return [];
  }
};

export const saveProgress = (role: VisitorId, done: string[]) => {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ role, done }));
  } catch {
    /* storage unavailable */
  }
};

/** A fresh ticket means a fresh slip. */
export const resetProgress = (role: VisitorId) => saveProgress(role, []);

export const TICK_EVENT = "feras-studio-ticked";

/** Tick a stop off the slip from anywhere on the site (a case study, the price list…). */
export const markStop = (role: VisitorId, id: string) => {
  const route = journeys[role]?.route ?? [];
  const done = loadProgress(role);
  if (done.includes(id)) return false;
  saveProgress(role, [...done, id]);
  if (route.includes(id)) window.dispatchEvent(new CustomEvent<string>(TICK_EVENT, { detail: id }));
  return true;
};

/* Where the visitor was standing in the walk, so "Back to the gallery walk" returns them there. */
const WALK_KEY = "feras-studio-walk";
export const saveWalkSpot = (x: number) => {
  try {
    sessionStorage.setItem(WALK_KEY, String(Math.round(x)));
  } catch {
    /* storage unavailable */
  }
};
export const loadWalkSpot = (): number | null => {
  try {
    const v = sessionStorage.getItem(WALK_KEY);
    return v ? Number(v) : null;
  } catch {
    return null;
  }
};
