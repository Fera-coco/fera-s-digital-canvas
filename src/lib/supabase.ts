import type { SupabaseClient } from "@supabase/supabase-js";

/*
  The Open Call backend (Supabase). Loaded only when needed, so the rest of
  the site doesn't pay for it. If the two environment variables aren't set,
  the site falls back to public/open-call.json and email/WhatsApp applications.
*/
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const backendReady = Boolean(url && key);

let client: Promise<SupabaseClient> | null = null;
export const getSupabase = () => {
  if (!backendReady) return Promise.reject(new Error("The Open Call backend isn't configured yet."));
  client ??= import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(url!, key!, { auth: { persistSession: true, storageKey: "feras-studio-admin" } }),
  );
  return client;
};
