import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import { backendReady, getSupabase } from "@/lib/supabase";
import { CATEGORIES, rowToSpot, STAGES, type Stage } from "@/content/openCall";
import { usePageMeta } from "@/hooks/use-exhibition";
import { cn } from "@/lib/utils";

/*
  The back office for The Open Call.
  Only users listed in open_call_admins can read or change anything here;
  the database enforces that, not just this page.
*/

const STATUSES = ["New", "Reviewing", "Shortlisted", "Accepted", "Declined"] as const;
type Status = (typeof STATUSES)[number];
const statusTone: Record<Status, string> = {
  New: "bg-butter",
  Reviewing: "bg-lavender",
  Shortlisted: "bg-blush",
  Accepted: "bg-mint",
  Declined: "bg-wall text-stone",
};

interface AppRow {
  id: string;
  created_at: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  country: string;
  category: string;
  about: string;
  goal: string;
  has_domain: string;
  links: string | null;
  agreed_to_costs: boolean;
  status: Status;
  admin_note: string | null;
  spot: number | null;
}

interface SpotRow {
  number: number;
  stage: Stage;
  share_details: boolean;
  business: string | null;
  category: string | null;
  country: string | null;
  note: string | null;
  image: string | null;
  url: string | null;
}

const fmtDate = (s: string) => new Date(s).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const waLink = (phone: string, name: string) =>
  `https://wa.me/${phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(`Hi ${name.split(" ")[0]}, this is Fera from Fera's Studio about your Open Call application.`)}`;

/* ------------------------------------------------------------------ */

const OpenCallAdmin = () => {
  usePageMeta("Back office · The Open Call | Fera's Studio", "Staff only.", "/open-call/admin");
  useEffect(() => {
    const m = document.createElement("meta");
    m.name = "robots";
    m.content = "noindex, nofollow";
    document.head.appendChild(m);
    return () => m.remove();
  }, []);

  const [sb, setSb] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [booting, setBooting] = useState(backendReady);

  useEffect(() => {
    if (!backendReady) return;
    let unsub: (() => void) | undefined;
    getSupabase()
      .then(async (client) => {
        setSb(client);
        const { data } = await client.auth.getSession();
        setSession(data.session);
        const sub = client.auth.onAuthStateChange((_e, s) => setSession(s));
        unsub = () => sub.data.subscription.unsubscribe();
      })
      .finally(() => setBooting(false));
    return () => unsub?.();
  }, []);

  useEffect(() => {
    if (!sb || !session) return setIsAdmin(null);
    sb.from("open_call_admins")
      .select("user_id")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [sb, session]);

  return (
    <main id="main" className="min-h-[100svh] pb-24 pt-[calc(var(--header-h)+2.5rem)]">
      <div className="gallery-x">
        <p className="label flex items-center gap-2 text-stone">
          <span className="h-2 w-2 rounded-full bg-coral" aria-hidden /> Staff only · The Open Call
        </p>
        <h1 className="display mt-3 text-[clamp(2.6rem,6vw,4.6rem)]">
          The back <em className="italic">office</em>
        </h1>

        {!backendReady ? (
          <Notice title="The back office isn't connected yet.">
            Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in Vercel, then redeploy. The README has the
            full setup.
          </Notice>
        ) : booting ? (
          <p className="label mt-10 animate-pulse text-stone" role="status">
            Opening the back office…
          </p>
        ) : !session || !sb ? (
          sb && <Login sb={sb} />
        ) : isAdmin === null ? (
          <p className="label mt-10 animate-pulse text-stone" role="status">
            Checking your pass…
          </p>
        ) : !isAdmin ? (
          <Notice title="This account doesn't have a staff pass.">
            You're signed in as {session.user.email}, but it isn't on the admin list.{" "}
            <button type="button" className="underline underline-offset-4" onClick={() => sb.auth.signOut()}>
              Sign out
            </button>
          </Notice>
        ) : (
          <Dashboard sb={sb} email={session.user.email ?? ""} />
        )}
      </div>
    </main>
  );
};

/* ------------------------------------------------------------------ */

const Notice = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mt-10 max-w-2xl bg-paper p-6 leading-relaxed">
    <p className="font-serif text-2xl">{title}</p>
    <p className="mt-2 text-ink/85">{children}</p>
  </div>
);

const inputCls = "mt-1.5 w-full rounded-sm border-0 border-b-2 border-ink/25 bg-cream/70 px-3 py-2 outline-none focus:border-ink focus:bg-cream";

const Login = ({ sb }: { sb: SupabaseClient }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setErr("That email and password didn't match. Try again.");
  };
  return (
    <form onSubmit={submit} className="ticket mt-10 max-w-md bg-paper p-7">
      <p className="label text-stone">Show your staff pass</p>
      <label className="mt-5 block">
        <span className="label text-stone">Email</span>
        <input className={inputCls} type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label className="mt-4 block">
        <span className="label text-stone">Password</span>
        <input className={inputCls} type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {err && (
        <p role="alert" className="mt-4 text-sm text-coral-ink">
          {err}
        </p>
      )}
      <button type="submit" disabled={busy} className="btn-ink mt-6 disabled:opacity-60">
        {busy ? "Checking…" : "Enter the back office"}
      </button>
    </form>
  );
};

/* ------------------------------------------------------------------ */

const Dashboard = ({ sb, email }: { sb: SupabaseClient; email: string }) => {
  const [tab, setTab] = useState<"apps" | "spots">("apps");
  const [apps, setApps] = useState<AppRow[] | null>(null);
  const [spots, setSpots] = useState<SpotRow[] | null>(null);
  const [open, setOpen] = useState(true);
  const [loadErr, setLoadErr] = useState("");
  const [toast, setToast] = useState("");

  const flash = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(""), 2600);
  };

  const load = useCallback(async () => {
    setLoadErr("");
    const [a, s, st] = await Promise.all([
      sb.from("open_call_applications").select("*").order("created_at", { ascending: false }),
      sb.from("open_call_spots").select("*").order("number"),
      sb.from("open_call_settings").select("applications_open").eq("id", 1).maybeSingle(),
    ]);
    if (a.error || s.error) return setLoadErr("Couldn't load the back office. Refresh to try again.");
    setApps(a.data as AppRow[]);
    setSpots(s.data as SpotRow[]);
    setOpen(st.data?.applications_open !== false);
  }, [sb]);

  useEffect(() => {
    load();
  }, [load]);

  const taken = useMemo(() => (spots ?? []).filter((s) => STAGES.indexOf(s.stage) >= STAGES.indexOf("Confirmed")).length, [spots]);
  const newCount = (apps ?? []).filter((a) => a.status === "New").length;

  const toggleOpen = async () => {
    const { error } = await sb.from("open_call_settings").update({ applications_open: !open }).eq("id", 1);
    if (error) return flash("Couldn't change that. Try again.");
    setOpen(!open);
    flash(!open ? "Applications are open." : "Applications are closed.");
  };

  return (
    <div className="mt-8">
      {/* summary bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-ink/15 py-4">
        <dl className="flex flex-wrap gap-x-8 gap-y-2">
          <Stat k="Applications" v={apps?.length ?? "…"} />
          <Stat k="New" v={apps ? newCount : "…"} />
          <Stat k="Spots taken" v={spots ? `${taken} of 5` : "…"} />
        </dl>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <button type="button" onClick={toggleOpen} className={cn("rounded-full px-4 py-2 font-medium", open ? "bg-mint" : "bg-ink text-cream")}>
            Applications {open ? "open" : "closed"} · switch
          </button>
          <Link to="/open-call" className="link-underline">
            View public page
          </Link>
          <span className="text-stone">{email}</span>
          <button type="button" onClick={() => sb.auth.signOut()} className="link-underline">
            Sign out
          </button>
        </div>
      </div>

      <div role="tablist" aria-label="Back office sections" className="mt-6 flex gap-2">
        {(
          [
            ["apps", "Applications"],
            ["spots", "The five spots"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn("rounded-full px-5 py-2 text-sm", tab === id ? "bg-ink text-cream" : "border border-ink/25")}
          >
            {label}
          </button>
        ))}
      </div>

      {loadErr && (
        <p role="alert" className="mt-6 text-coral-ink">
          {loadErr}
        </p>
      )}

      {tab === "apps" ? (
        <Applications sb={sb} apps={apps} spots={spots} onChange={load} flash={flash} />
      ) : (
        <Spots sb={sb} spots={spots} onChange={load} flash={flash} />
      )}

      {toast && (
        <div role="status" className="dialog-in fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm text-cream shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
};

const Stat = ({ k, v }: { k: string; v: string | number }) => (
  <div>
    <dt className="label text-stone">{k}</dt>
    <dd className="font-serif text-3xl">{v}</dd>
  </div>
);

/* ------------------------------------------------------------------ */

const Applications = ({
  sb,
  apps,
  spots,
  onChange,
  flash,
}: {
  sb: SupabaseClient;
  apps: AppRow[] | null;
  spots: SpotRow[] | null;
  onChange: () => void;
  flash: (m: string) => void;
}) => {
  const [filter, setFilter] = useState<Status | "All">("All");
  const [openId, setOpenId] = useState<string | null>(null);
  if (!apps) return <p className="label mt-8 animate-pulse text-stone">Loading applications…</p>;
  const list = filter === "All" ? apps : apps.filter((a) => a.status === filter);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
        {(["All", ...STATUSES] as const).map((s) => {
          const n = s === "All" ? apps.length : apps.filter((a) => a.status === s).length;
          return (
            <button key={s} type="button" aria-pressed={filter === s} onClick={() => setFilter(s)} className={cn("rounded-full px-3 py-1.5 text-sm", filter === s ? "bg-ink text-cream" : "bg-paper")}>
              {s} <span className="opacity-60">{n}</span>
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <p className="mt-10 font-serif text-2xl italic text-stone">{apps.length ? "Nothing in this pile." : "No applications yet. They'll appear here as they arrive."}</p>
      ) : (
        <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
          {list.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                aria-expanded={openId === a.id}
                onClick={() => setOpenId(openId === a.id ? null : a.id)}
                className="grid w-full grid-cols-[1fr_auto] items-center gap-3 py-4 text-left md:grid-cols-[2fr_1.4fr_1fr_auto]"
              >
                <span>
                  <span className="block font-serif text-xl leading-tight">{a.business_name}</span>
                  <span className="text-sm text-stone">
                    {a.contact_name} · {a.country}
                  </span>
                </span>
                <span className="hidden text-sm text-stone md:block">{a.category}</span>
                <span className="hidden text-sm text-stone md:block">{fmtDate(a.created_at)}</span>
                <span className={cn("rounded-full px-3 py-1 text-xs font-medium", statusTone[a.status])}>{a.status}</span>
              </button>
              {openId === a.id && <AppDetail sb={sb} a={a} spots={spots} onChange={onChange} flash={flash} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const AppDetail = ({ sb, a, spots, onChange, flash }: { sb: SupabaseClient; a: AppRow; spots: SpotRow[] | null; onChange: () => void; flash: (m: string) => void }) => {
  const [status, setStatus] = useState<Status>(a.status);
  const [note, setNote] = useState(a.admin_note ?? "");
  const [spot, setSpot] = useState<string>(a.spot ? String(a.spot) : "");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    const { error } = await sb
      .from("open_call_applications")
      .update({ status, admin_note: note.trim() || null, spot: spot ? Number(spot) : null })
      .eq("id", a.id);
    setBusy(false);
    if (error) return flash("Couldn't save. Try again.");
    flash("Saved.");
    onChange();
  };

  const placeInSpot = async () => {
    if (!spot) return;
    setBusy(true);
    const { error } = await sb
      .from("open_call_spots")
      .update({ stage: "Confirmed", business: a.business_name, category: a.category, country: a.country, share_details: false, updated_at: new Date().toISOString() })
      .eq("number", Number(spot));
    if (!error) await sb.from("open_call_applications").update({ status: "Accepted", spot: Number(spot), admin_note: note.trim() || null }).eq("id", a.id);
    setBusy(false);
    if (error) return flash("Couldn't fill that spot. Try again.");
    setStatus("Accepted");
    flash(`Spot ${spot.padStart(2, "0")} confirmed for ${a.business_name}. Details stay private until you share them.`);
    onChange();
  };

  const remove = async () => {
    if (!window.confirm(`Delete ${a.business_name}'s application permanently? This can't be undone.`)) return;
    const { error } = await sb.from("open_call_applications").delete().eq("id", a.id);
    if (error) return flash("Couldn't delete. Try again.");
    flash("Application deleted.");
    onChange();
  };

  const spotTaken = (n: number) => {
    const s = spots?.find((x) => x.number === n);
    return s && STAGES.indexOf(s.stage) >= STAGES.indexOf("Confirmed") ? s.business || "taken" : null;
  };

  return (
    <div className="grid gap-8 bg-paper p-5 md:grid-cols-[1.4fr_1fr] md:p-7">
      <dl className="grid gap-4 text-[0.95rem] sm:grid-cols-2">
        <Info k="Contact" v={a.contact_name} />
        <Info k="Email" v={<a className="underline underline-offset-2" href={`mailto:${a.email}?subject=${encodeURIComponent("Your Open Call application · Fera's Studio")}`}>{a.email}</a>} />
        <Info k="Phone / WhatsApp" v={a.phone} />
        <Info k="Country · category" v={`${a.country} · ${a.category}`} />
        <Info k="Has a domain" v={a.has_domain} />
        <Info k="Links" v={a.links ? <LinkOut href={a.links} /> : "None given"} />
        <Info k="What the business does" v={a.about} wide />
        <Info k="What the website should achieve" v={a.goal} wide />
        <Info k="Agreed to cover domain and hosting" v={a.agreed_to_costs ? "Yes" : "No"} />
        <Info k="Received" v={fmtDate(a.created_at)} />
      </dl>

      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <a href={waLink(a.phone, a.contact_name)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-mint px-4 py-2 text-sm font-medium">
            WhatsApp {a.contact_name.split(" ")[0]} ↗
          </a>
          <a href={`mailto:${a.email}?subject=${encodeURIComponent("Your Open Call application · Fera's Studio")}`} className="rounded-full bg-lavender px-4 py-2 text-sm font-medium">
            Email ↗
          </a>
          <a href={`tel:${a.phone.replace(/[^\d+]/g, "")}`} className="rounded-full border border-ink/25 px-4 py-2 text-sm">
            Call
          </a>
        </div>
        <label className="block">
          <span className="label text-stone">Status</span>
          <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as Status)}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label text-stone">Private note</span>
          <textarea className={inputCls} rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Only you can see this." />
        </label>
        <label className="block">
          <span className="label text-stone">Spot</span>
          <select className={inputCls} value={spot} onChange={(e) => setSpot(e.target.value)}>
            <option value="">Not assigned</option>
            {[1, 2, 3, 4, 5].map((n) => {
              const t = spotTaken(n);
              return (
                <option key={n} value={n} disabled={!!t && a.spot !== n}>
                  Spot {String(n).padStart(2, "0")}
                  {t ? ` (${t})` : ""}
                </option>
              );
            })}
          </select>
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={save} disabled={busy} className="btn-ink disabled:opacity-60">
            Save
          </button>
          {spot && (
            <button type="button" onClick={placeInSpot} disabled={busy} className="btn bg-coral text-ink disabled:opacity-60">
              Confirm into spot {spot.padStart(2, "0")}
            </button>
          )}
        </div>
        <button type="button" onClick={remove} className="text-sm text-stone underline underline-offset-4">
          Delete application
        </button>
      </div>
    </div>
  );
};

const LinkOut = ({ href }: { href: string }) => {
  const url = /^https?:\/\//i.test(href) ? href : `https://${href}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer nofollow" className="break-all underline underline-offset-2">
      {href} ↗
    </a>
  );
};

const Info = ({ k, v, wide }: { k: string; v: React.ReactNode; wide?: boolean }) => (
  <div className={cn(wide && "sm:col-span-2")}>
    <dt className="label text-stone">{k}</dt>
    <dd className="mt-1 whitespace-pre-wrap break-words">{v}</dd>
  </div>
);

/* ------------------------------------------------------------------ */

const Spots = ({ sb, spots, onChange, flash }: { sb: SupabaseClient; spots: SpotRow[] | null; onChange: () => void; flash: (m: string) => void }) => {
  if (!spots) return <p className="label mt-8 animate-pulse text-stone">Loading spots…</p>;
  return (
    <div className="mt-6">
      <p className="max-w-2xl text-stone">
        These show publicly on the Open Call page. A spot counts as taken from <strong className="text-ink">Confirmed</strong> onwards.
        Business details only appear once <strong className="text-ink">Share publicly</strong> is on.
      </p>
      <ol className="mt-6 grid gap-5 lg:grid-cols-2">
        {spots.map((s) => (
          <SpotEditor key={s.number} sb={sb} s={s} onChange={onChange} flash={flash} />
        ))}
      </ol>
    </div>
  );
};

const SpotEditor = ({ sb, s, onChange, flash }: { sb: SupabaseClient; s: SpotRow; onChange: () => void; flash: (m: string) => void }) => {
  const [f, setF] = useState(s);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof SpotRow>(k: K, v: SpotRow[K]) => setF((p) => ({ ...p, [k]: v }));
  const t = (v: string) => v.trim() || null;
  const preview = rowToSpot(f);

  const save = async () => {
    setBusy(true);
    const { error } = await sb
      .from("open_call_spots")
      .update({
        stage: f.stage,
        share_details: f.share_details,
        business: t(f.business ?? ""),
        category: t(f.category ?? ""),
        country: t(f.country ?? ""),
        note: t(f.note ?? ""),
        image: t(f.image ?? ""),
        url: t(f.url ?? ""),
        updated_at: new Date().toISOString(),
      })
      .eq("number", s.number);
    setBusy(false);
    if (error) return flash("Couldn't save that spot.");
    flash(`Spot ${preview.number} saved. It's live on the page.`);
    onChange();
  };

  const clear = () =>
    setF({ ...f, stage: "Available", share_details: false, business: null, category: null, country: null, note: null, image: null, url: null });

  return (
    <li className="bg-paper p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="display text-4xl">Spot {preview.number}</p>
        <span className={cn("rounded-full px-3 py-1 text-xs", STAGES.indexOf(f.stage) >= 2 ? "bg-lavender" : "bg-mint-soft text-mint-ink")}>{f.stage}</span>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="label text-stone">Stage</span>
          <select className={inputCls} value={f.stage} onChange={(e) => set("stage", e.target.value as Stage)}>
            {STAGES.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label className="flex items-end gap-3 pb-2">
          <input type="checkbox" className="h-5 w-5 accent-ink" checked={f.share_details} onChange={(e) => set("share_details", e.target.checked)} />
          <span>Share publicly (the business agreed)</span>
        </label>
        <TextIn label="Business name" v={f.business} on={(v) => set("business", v)} />
        <label className="block">
          <span className="label text-stone">Category</span>
          <input className={inputCls} list="oc-categories" value={f.category ?? ""} onChange={(e) => set("category", e.target.value)} />
        </label>
        <label className="block">
          <span className="label text-stone">Country</span>
          <select className={inputCls} value={f.country ?? ""} onChange={(e) => set("country", e.target.value || null)}>
            <option value="">Not set</option>
            <option>Nigeria</option>
            <option>Benin Republic</option>
          </select>
        </label>
        <TextIn label="Live website URL" v={f.url} on={(v) => set("url", v)} placeholder="https://" />
        <TextIn label="Preview image path" v={f.image} on={(v) => set("image", v)} placeholder="/open-call/business.webp" />
        <label className="block sm:col-span-2">
          <span className="label text-stone">Progress note (public when shared)</span>
          <textarea className={inputCls} rows={2} value={f.note ?? ""} onChange={(e) => set("note", e.target.value)} placeholder="Website design is complete. Development is now underway." />
        </label>
      </div>
      <datalist id="oc-categories">
        {CATEGORIES.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={busy} className="btn-ink disabled:opacity-60">
          {busy ? "Saving…" : "Save spot"}
        </button>
        <button type="button" onClick={clear} className="text-sm text-stone underline underline-offset-4">
          Reset to available
        </button>
      </div>
    </li>
  );
};

const TextIn = ({ label, v, on, placeholder }: { label: string; v: string | null; on: (v: string) => void; placeholder?: string }) => (
  <label className="block">
    <span className="label text-stone">{label}</span>
    <input className={inputCls} value={v ?? ""} onChange={(e) => on(e.target.value)} placeholder={placeholder} />
  </label>
);

export default OpenCallAdmin;
