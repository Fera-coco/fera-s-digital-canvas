export const site = {
  studio: "Fera's Studio",
  person: "Peace Oluwaferanmi Segun-Babs",
  shortName: "Fera",
  role: "UX/UI designer & front-end developer",
  url: "https://ferasportfolio.vercel.app",
  email: "ferrababs@gmail.com",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/peace-segun-babs-961bbb365" },
    { label: "GitHub", href: "https://github.com/Fera-coco" },
  ],
} as const;

export const rooms = [
  { id: "entrance", no: "00", label: "Entrance", short: "Home" },
  { id: "collection", no: "01", label: "The Collection", short: "Work" },
  { id: "curator", no: "02", label: "The Curator", short: "About" },
  { id: "studio", no: "03", label: "The Studio", short: "Services" },
  { id: "exit", no: "04", label: "The Exit", short: "Contact" },
] as const;

export type RoomId = (typeof rooms)[number]["id"];

export const mailto = (subject: string, body = "") =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}${
    body ? `&body=${encodeURIComponent(body)}` : ""
  }`;
