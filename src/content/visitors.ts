/* Who you can visit as. Each role has its own character and its own route (see journeys.ts). All original characters. */

export type VisitorId = "sketcher" | "builder" | "dreamer" | "client";

export interface VisitorType {
  id: VisitorId;
  name: string;
  line: string; // who this visitor is, shown at the ticket desk
  greeting: string; // shown on the ticket
  skin: string;
  hair: string;
  top: string;
  bottom: string;
  accent: string;
}

export const visitors: VisitorType[] = [
  {
    id: "client",
    name: "Business owner",
    line: "Looking for a website or a digital lift for my business.",
    greeting: "Let's find what your business needs.",
    skin: "#E0AC69",
    hair: "#3B2416",
    top: "#F5ECA7",
    bottom: "#625C55",
    accent: "#282624",
  },
  {
    id: "builder",
    name: "Recruiter",
    line: "Hiring, and here to see the work and the person behind it.",
    greeting: "Here's the work, and who made it.",
    skin: "#C68642",
    hair: "#2B1D14",
    top: "#B9E2D1",
    bottom: "#1E5A46",
    accent: "#F28B79",
  },
  {
    id: "sketcher",
    name: "Designer or developer",
    line: "Here for the process, the details and how things were built.",
    greeting: "Go on, look closely.",
    skin: "#8D5524",
    hair: "#1E1A18",
    top: "#C5B8F1",
    bottom: "#45378A",
    accent: "#282624",
  },
  {
    id: "dreamer",
    name: "Just looking",
    line: "No agenda. Here for the colours, the stories and the walk.",
    greeting: "Take your time in here.",
    skin: "#5C3A21",
    hair: "#7A2E1F",
    top: "#F28B79",
    bottom: "#282624",
    accent: "#F5ECA7",
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
