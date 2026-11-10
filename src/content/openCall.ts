/*
  The Open Call: a special exhibition inside Fera's Studio.
  Live availability and project cards come from /public/open-call.json,
  so spots can be updated without touching this code.
*/
import { useEffect, useState } from "react";

export const OPEN_CALL_PATH = "/open-call";
export const TOTAL_SPOTS = 5;

export const STAGES = [
  "Available",
  "Application received",
  "Confirmed",
  "Discovery",
  "Design",
  "Development",
  "Review",
  "Ready to launch",
  "Launched",
] as const;
export type Stage = (typeof STAGES)[number];

/* A spot is only taken once Fera has confirmed the business. */
export const isTaken = (stage: Stage) => STAGES.indexOf(stage) >= STAGES.indexOf("Confirmed");

export interface Spot {
  number: string;
  stage: Stage;
  shareDetails?: boolean;
  business?: string;
  category?: string;
  country?: string;
  note?: string;
  image?: string;
  url?: string;
}

export interface OpenCallData {
  applicationsOpen: boolean;
  spots: Spot[];
}

const clean = (raw: unknown): OpenCallData => {
  const r = (raw ?? {}) as Partial<OpenCallData>;
  const list = Array.isArray(r.spots) ? r.spots : [];
  const spots: Spot[] = Array.from({ length: TOTAL_SPOTS }, (_, i) => {
    const s = (list[i] ?? {}) as Partial<Spot>;
    const stage = STAGES.includes(s.stage as Stage) ? (s.stage as Stage) : "Available";
    return { ...s, number: String(i + 1).padStart(2, "0"), stage };
  });
  return { applicationsOpen: r.applicationsOpen !== false, spots };
};

export type OpenCallState = { status: "loading" } | { status: "error" } | { status: "ready"; data: OpenCallData };

export function useOpenCall(): OpenCallState {
  const [state, setState] = useState<OpenCallState>({ status: "loading" });
  useEffect(() => {
    let alive = true;
    fetch("/open-call.json", { cache: "no-cache" })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((json) => alive && setState({ status: "ready", data: clean(json) }))
      .catch(() => alive && setState({ status: "error" }));
    return () => {
      alive = false;
    };
  }, []);
  return state;
}

export const summarise = (d: OpenCallData) => {
  const taken = d.spots.filter((s) => isTaken(s.stage)).length;
  const remaining = TOTAL_SPOTS - taken;
  return { taken, remaining, open: d.applicationsOpen && remaining > 0 };
};

/* ---------- Applying ---------- */

export const APPLY_EMAIL = "ferrababs@gmail.com";
export const WHATSAPP_NUMBER = "2348100350910";
export const WHATSAPP_DISPLAY = "+234 810 035 0910";

const emailSubject = "Application for The Open Call – Five Free Websites";
const emailBody = `Hello Fera's Studio,

I'd like to apply for one of the five available website development spots.

Business name:
Contact person's name:
Country:
Business category:
What does my business do?
What would I like my website to achieve?
Do I currently have a domain?
Existing website or social media link:

I understand that website design and development are free, while domain registration, hosting and any applicable third-party costs are my responsibility.

Thank you.`;

const whatsappText = `Hello Fera! I'd like to apply for one of the five free website spots under The Open Call initiative.

Business name:
My country:
Business category:
What my business does:
What I need a website for:
Existing website or social media link:

I'd love to know the next steps.`;

export const applyByEmail = `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
export const applyByWhatsApp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;
