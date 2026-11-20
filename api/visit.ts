/*
  Counts a page view for the back room. Same-origin, so it works under the
  site's strict security policy. Adds the visitor's country from Vercel's
  edge (two letters only, never the IP address) and passes it to Supabase.
*/
export const config = { runtime: "edge" };

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ID = /^[a-z0-9]{8,32}$/;
const DEVICES = new Set(["Mobile", "Tablet", "Desktop"]);
const BOTS = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|whatsapp|vercel/i;

const done = (status = 204) => new Response(null, { status, headers: { "cache-control": "no-store" } });

export default async function handler(req: Request) {
  if (req.method !== "POST") return done(405);
  if (!SUPABASE_URL || !SUPABASE_KEY) return done();
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(req.url).host) return done(403);
  if (BOTS.test(req.headers.get("user-agent") ?? "")) return done();

  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > 1000) return done(413);
    body = JSON.parse(text);
  } catch {
    return done(400);
  }

  const path = typeof body.path === "string" ? body.path.split(/[?#]/)[0].slice(0, 200) : "";
  const referrer = typeof body.referrer === "string" && /^[a-z0-9.-]{3,100}$/i.test(body.referrer) ? body.referrer.toLowerCase() : null;
  const device = typeof body.device === "string" && DEVICES.has(body.device) ? body.device : "Desktop";
  const visitor_id = String(body.visitor ?? "");
  const session_id = String(body.session ?? "");
  if (!path.startsWith("/") || !ID.test(visitor_id) || !ID.test(session_id)) return done(400);
  const cc = req.headers.get("x-vercel-ip-country") ?? "";

  await fetch(`${SUPABASE_URL}/rest/v1/site_visits`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, authorization: `Bearer ${SUPABASE_KEY}`, "content-type": "application/json", prefer: "return=minimal" },
    body: JSON.stringify({
      path,
      referrer,
      device,
      country: /^[A-Z]{2}$/.test(cc) ? cc : null,
      visitor_id,
      session_id,
      entry: body.entry === true,
      new_visitor: body.isNew === true,
    }),
  }).catch(() => undefined);
  return done();
}
