/*
  The Open Call: a special exhibition inside Fera's Studio.
  Live availability and project cards come from /public/open-call.json,
  so spots can be updated without touching this code.
*/
import { useEffect, useState } from "react";
import { backendReady, getSupabase } from "@/lib/supabase";

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

type SpotRow = {
  number: number;
  stage: string;
  share_details: boolean;
  business: string | null;
  category: string | null;
  country: string | null;
  note: string | null;
  image: string | null;
  url: string | null;
};

export const rowToSpot = (r: SpotRow): Spot => ({
  number: String(r.number).padStart(2, "0"),
  stage: (STAGES.includes(r.stage as Stage) ? r.stage : "Available") as Stage,
  shareDetails: r.share_details,
  business: r.business ?? undefined,
  category: r.category ?? undefined,
  country: r.country ?? undefined,
  note: r.note ?? undefined,
  image: r.image ?? undefined,
  url: r.url ?? undefined,
});

/* Live from Supabase when connected; otherwise from public/open-call.json. */
const loadFromBackend = async (): Promise<OpenCallData> => {
  const sb = await getSupabase();
  const [spots, settings] = await Promise.all([
    sb.from("open_call_spots").select("*").order("number"),
    sb.from("open_call_settings").select("applications_open").eq("id", 1).maybeSingle(),
  ]);
  if (spots.error) throw spots.error;
  return clean({ applicationsOpen: settings.data?.applications_open !== false, spots: (spots.data as SpotRow[]).map(rowToSpot) });
};

const loadFromFile = async (): Promise<OpenCallData> => {
  const r = await fetch("/open-call.json", { cache: "no-cache" });
  if (!r.ok) throw new Error(String(r.status));
  return clean(await r.json());
};

export function useOpenCall(): OpenCallState {
  const [state, setState] = useState<OpenCallState>({ status: "loading" });
  useEffect(() => {
    let alive = true;
    (backendReady ? loadFromBackend().catch(loadFromFile) : loadFromFile())
      .then((data) => alive && setState({ status: "ready", data }))
      .catch(() => alive && setState({ status: "error" }));
    return () => {
      alive = false;
    };
  }, []);
  return state;
}

/* ---------- Applying on the website ---------- */

export const CATEGORIES = [
  "Fashion and beauty",
  "Retail",
  "Food and hospitality",
  "Service provider",
  "Health and wellness",
  "Education and training",
  "Events and creative",
  "Other",
] as const;

export interface Application {
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  country: "Nigeria" | "Benin Republic" | "";
  category: string;
  about: string;
  goal: string;
  has_domain: "Yes" | "No" | "Not sure" | "";
  links: string;
  agreed_to_costs: boolean;
  agreed_to_feature: boolean;
}

export const emptyApplication: Application = {
  business_name: "",
  contact_name: "",
  email: "",
  phone: "",
  country: "",
  category: "",
  about: "",
  goal: "",
  has_domain: "",
  links: "",
  agreed_to_costs: false,
  agreed_to_feature: false,
};

export const submitApplication = async (a: Application) => {
  const sb = await getSupabase();
  const { error } = await sb.from("open_call_applications").insert({
    ...a,
    business_name: a.business_name.trim(),
    contact_name: a.contact_name.trim(),
    email: a.email.trim(),
    phone: a.phone.trim(),
    category: a.category.trim(),
    about: a.about.trim(),
    goal: a.goal.trim(),
    links: a.links.trim() || null,
  });
  if (error) throw error;
};

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

I agree that Fera's Studio can feature the finished website in its portfolio, including my business name, screenshots and link.

Thank you.`;

const whatsappText = `Hello Fera! I'd like to apply for one of the five free website spots under The Open Call initiative.

Business name:
My country:
Business category:
What my business does:
What I need a website for:
Existing website or social media link:

I'm happy for Fera's Studio to feature the finished website in its portfolio.

I'd love to know the next steps.`;

export const applyByEmail = `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
export const applyByWhatsApp = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;
