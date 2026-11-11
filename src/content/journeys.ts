/*
  Each visitor role walks its own route through the gallery.
  Stops are spot ids from the gallery walk: exhibit slugs, "portrait", "bio",
  "service-A"…"service-D", "prices", "guestbook", "exitdoor".
*/
import type { VisitorId } from "./visitors";

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
