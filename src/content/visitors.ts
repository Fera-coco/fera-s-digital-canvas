/* The visitors you can walk the exhibition as. All original characters. */

export type VisitorId = "sketcher" | "builder" | "dreamer" | "client";

export interface VisitorType {
  id: VisitorId;
  name: string;
  line: string; // a one-line personality, shown at the ticket desk
  greeting: string; // shown on the ticket
  skin: string;
  hair: string;
  top: string;
  bottom: string;
  accent: string;
}

export const visitors: VisitorType[] = [
  {
    id: "sketcher",
    name: "The Sketcher",
    line: "Notices every font choice. Brought a sketchbook.",
    greeting: "Enjoy the details.",
    skin: "#8D5524",
    hair: "#1E1A18",
    top: "#C5B8F1",
    bottom: "#45378A",
    accent: "#282624",
  },
  {
    id: "builder",
    name: "The Builder",
    line: "Opens dev tools on every website. Wants to see how it works.",
    greeting: "Go on, inspect everything.",
    skin: "#C68642",
    hair: "#2B1D14",
    top: "#B9E2D1",
    bottom: "#1E5A46",
    accent: "#F28B79",
  },
  {
    id: "dreamer",
    name: "The Dreamer",
    line: "Here for the colours, the stories and the vibes.",
    greeting: "Take your time in here.",
    skin: "#5C3A21",
    hair: "#7A2E1F",
    top: "#F28B79",
    bottom: "#282624",
    accent: "#F5ECA7",
  },
  {
    id: "client",
    name: "The Client",
    line: "Has a project in mind. Looking for the right designer.",
    greeting: "The exit has a guestbook. Use it.",
    skin: "#E0AC69",
    hair: "#3B2416",
    top: "#F5ECA7",
    bottom: "#625C55",
    accent: "#282624",
  },
];

const KEY = "feras-studio-visitor";

export const loadVisitor = (): VisitorId | null => {
  try {
    const v = window.localStorage.getItem(KEY);
    return visitors.some((x) => x.id === v) ? (v as VisitorId) : null;
  } catch {
    return null;
  }
};

export const saveVisitor = (id: VisitorId) => {
  try {
    window.localStorage.setItem(KEY, id);
  } catch {
    /* storage unavailable: the choice lives for this visit only */
  }
};

export const getVisitor = (id: VisitorId | null | undefined) => visitors.find((v) => v.id === id) ?? visitors[0];
