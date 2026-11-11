/* The visitors' book: signatures live in Supabase (table public.guestbook). */
import { backendReady, getSupabase } from "@/lib/supabase";
import type { VisitorId } from "@/content/visitors";

export interface Signature {
  id: string;
  created_at: string;
  name: string;
  note: string | null;
  visitor: VisitorId;
  hidden?: boolean;
}

export const NAME_MAX = 40;
export const NOTE_MAX = 140;
const LINK = /(https?:\/\/|www\.|\.[a-z]{2,}\/)/i;
const SIGNED_KEY = "feras-studio-signed";

export const guestbookReady = backendReady;

export const validateSignature = (name: string, note: string) => {
  const n = name.trim();
  const t = note.trim();
  if (!n) return "Add your name to sign.";
  if (n.length > NAME_MAX) return `Keep your name under ${NAME_MAX} characters.`;
  if (t.length > NOTE_MAX) return `Keep your note under ${NOTE_MAX} characters.`;
  if (LINK.test(n) || LINK.test(t)) return "Links can't go in the visitors' book.";
  return null;
};

export async function loadSignatures(limit = 60): Promise<Signature[]> {
  const sb = await getSupabase();
  const { data, error } = await sb.from("guestbook").select("id, created_at, name, note, visitor").order("created_at", { ascending: false }).limit(limit);
  if (error) throw error;
  return (data ?? []) as Signature[];
}

export async function signGuestbook(name: string, note: string, visitor: VisitorId) {
  const sb = await getSupabase();
  const row = { name: name.trim(), note: note.trim() || null, visitor };
  const { error } = await sb.from("guestbook").insert(row);
  if (error) throw error;
  try {
    localStorage.setItem(SIGNED_KEY, new Date().toISOString());
  } catch {
    /* storage unavailable */
  }
  return { ...row, id: `local-${Date.now()}`, created_at: new Date().toISOString() } as Signature;
}

export const hasSigned = () => {
  try {
    return !!localStorage.getItem(SIGNED_KEY);
  } catch {
    return false;
  }
};
