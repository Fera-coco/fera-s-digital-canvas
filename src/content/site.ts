/** WhatsApp number in international format without +, used for wa.me links. */
export const WHATSAPP_NUMBER = "2348100350910";

export const site = {
  studio: "Fera's Studio",
  person: "Peace Oluwaferanmi Segun-Babs",
  shortName: "Fera",
  role: "UX/UI designer & front-end developer",
  url: "https://ferasportfolio.vercel.app",
  email: "ferrababs@gmail.com",
  phone: "+2348100350910",
  city: "Cotonou",
  country: "BJ",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/peace-segun-babs-961bbb365" },
    { label: "TikTok", href: "https://www.tiktok.com/@feras.studio" },
  ],
  /** The studio's own profiles (used in search data so Google and AI assistants connect them to the site). */
  studioProfiles: [
    "https://www.tiktok.com/@feras.studio",
    "https://www.linkedin.com/company/146996330/",
  ],
} as const;

export const rooms = [
  { id: "entrance", path: "/", no: "00", label: "Ticket desk", short: "Home", tone: "#282624", blurb: "Pick a visitor and walk the gallery." },
  { id: "collection", path: "/collection", no: "01", label: "The Collection", short: "Work", tone: "#C5B8F1", blurb: "Selected exhibits, from shipped builds to design studies." },
  { id: "curator", path: "/curator", no: "02", label: "The Curator", short: "About", tone: "#B9E2D1", blurb: "Who's behind the studio, and how she works." },
  { id: "studio", path: "/studio", no: "03", label: "The Studio", short: "Services", tone: "#F5ECA7", blurb: "What you can commission from Fera's Studio." },
  { id: "contact", path: "/contact", no: "04", label: "The Exit", short: "Contact", tone: "#F28B79", blurb: "Leave a note in the guestbook." },
] as const;

export type Room = (typeof rooms)[number];
export type RoomId = Room["id"];

export const roomFor = (pathname: string): Room | undefined =>
  pathname.startsWith("/work/") ? rooms[1] : rooms.find((r) => r.path === pathname);

export const nextRoom = (id: RoomId): Room => rooms[(rooms.findIndex((r) => r.id === id) + 1) % rooms.length];

export const mailto = (subject: string, body = "") =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}${
    body ? `&body=${encodeURIComponent(body)}` : ""
  }`;

/* The gallery walk sits between the ticket desk and the rooms. */
export const WALK = { path: "/visit", label: "The gallery walk", tone: "#C5B8F1" } as const;
