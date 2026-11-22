import { useState } from "react";
import { Link } from "react-router-dom";
import { IMG, agents, img, movingIn, naira, short, type Area, type Kind, type Listing } from "../data/listings";
import { FeeBar, cx } from "../components/ui";
import { actions, allListings, useStore, type Enquiry } from "../lib/store";

const STATUSES: Enquiry["status"][] = ["New", "Contacted", "Inspection booked", "Closed"];
const STATUS_CLS: Record<Enquiry["status"], string> = {
  New: "bg-clay text-white",
  Contacted: "bg-gold-soft text-ink",
  "Inspection booked": "bg-forest-soft text-forest",
  Closed: "bg-sand text-stone",
};

export default function Dashboard() {
  const store = useStore();
  const all = allListings(store);
  const [tab, setTab] = useState<"enquiries" | "listings" | "add">("enquiries");
  const newCount = store.enquiries.filter((e) => e.status === "New").length;
  const booked = store.enquiries.filter((e) => e.status === "Inspection booked").length;

  return (
    <main className="mx-auto max-w-7xl px-4 pt-8 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label">Owner dashboard · demo</p>
          <h1 className="mt-1 font-display text-4xl font-semibold">Good morning, Brightdoor team</h1>
        </div>
        <button onClick={actions.reset} className="text-sm font-semibold text-stone underline-offset-2 hover:underline">Reset demo data</button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["New enquiries", newCount, "text-clay"],
          ["Inspections booked", booked, "text-forest"],
          ["Live listings", all.filter((l) => l.status === "Available").length, "text-ink"],
          ["Under offer", all.filter((l) => l.status === "Under offer").length, "text-ink"],
        ].map(([t, v, c]) => (
          <div key={t as string} className="rounded-2xl bg-paper p-4 shadow-card">
            <p className="label">{t}</p>
            <p className={cx("mt-1 font-display text-4xl font-semibold", c as string)}>{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-1 overflow-x-auto rounded-full bg-paper p-1 shadow-card sm:w-fit" role="tablist">
        {([["enquiries", `Enquiries (${store.enquiries.length})`], ["listings", `Listings (${all.length})`], ["add", "+ Add a listing"]] as const).map(([k, t]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cx("shrink-0 rounded-full px-4 py-2 text-sm font-bold", tab === k ? "bg-forest text-cream" : "text-ink/70")}>{t}</button>
        ))}
      </div>

      {tab === "enquiries" && (
        <div className="mt-5 space-y-3">
          {store.enquiries.map((e) => {
            const l = all.find((x) => x.slug === e.slug);
            return (
              <div key={e.id} className="grid gap-3 rounded-2xl bg-paper p-4 shadow-card md:grid-cols-[1fr_1.2fr_auto] md:items-center">
                <div>
                  <p className="font-bold">{e.name} <span className="font-normal text-stone">· {e.phone}</span></p>
                  <p className="text-[13px] text-stone">{e.at} · {e.kind}{e.when ? ` for ${e.when}` : ""}</p>
                </div>
                <div className="text-sm">
                  {l ? <Link to={`/homes/${l.slug}`} className="font-semibold hover:underline">{l.title}, {l.area}</Link> : <span className="text-stone">Listing removed</span>}
                  {e.message && <p className="text-stone">"{e.message}"</p>}
                </div>
                <label className="flex items-center gap-2">
                  <span className="sr-only">Status</span>
                  <select value={e.status} onChange={(ev) => actions.setEnquiryStatus(e.id, ev.target.value as Enquiry["status"])} className={cx("rounded-full border-0 px-3 py-1.5 text-[13px] font-bold", STATUS_CLS[e.status])}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
              </div>
            );
          })}
        </div>
      )}

      {tab === "listings" && (
        <div className="mt-5 overflow-x-auto rounded-2xl bg-paper shadow-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-stone">
              <tr><th className="p-4">Home</th><th className="p-4">Price</th><th className="p-4">Move-in total</th><th className="p-4">Agent</th><th className="p-4">Status</th><th className="p-4" /></tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {all.map((l) => (
                <tr key={l.slug}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={img(l.images[0], 160)} alt="" className="h-12 w-16 rounded-lg object-cover" />
                      <div><Link to={`/homes/${l.slug}`} className="font-semibold hover:underline">{l.title}</Link><p className="text-stone">{l.area}</p></div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold">{short(l.price)}{l.deal === "rent" && <span className="font-normal text-stone">/yr</span>}</td>
                  <td className="p-4">{movingIn(l) ? short(movingIn(l)!.total) : "–"}</td>
                  <td className="p-4">{agents[l.agent].name}</td>
                  <td className="p-4"><span className={cx("rounded-full px-2.5 py-1 text-[12px] font-bold", l.status === "Available" ? "bg-forest-soft text-forest" : "bg-gold-soft")}>{l.status}</span></td>
                  <td className="p-4 text-right"><button onClick={() => actions.hideListing(l.slug)} className="text-[13px] font-bold text-clay-ink hover:underline">Take down</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "add" && <AddListing onDone={() => setTab("listings")} />}
    </main>
  );
}

const AREAS: Area[] = ["Lekki Phase 1", "Ikoyi", "Victoria Island", "Ikate", "Ajah", "Yaba", "Gbagada", "Ikeja GRA"];
const KINDS: Kind[] = ["Flat", "Mini flat", "Terrace duplex", "Semi-detached duplex", "Detached duplex"];

function AddListing({ onDone }: { onDone: () => void }) {
  const [f, setF] = useState({
    title: "", area: "Lekki Phase 1" as Area, kind: "Flat" as Kind, price: 4_000_000, beds: 2, baths: 2, sqm: 90,
    serviceCharge: 400_000, agencyPct: 10, legalPct: 10, caution: 400_000, power: "Prepaid meter", photo: "lightLiving" as keyof typeof IMG,
  });
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));
  const preview: Listing = {
    slug: "new-" + Date.now(), title: f.title || "New listing", deal: "rent", kind: f.kind, area: f.area, street: f.area, price: f.price,
    beds: f.beds, baths: f.baths, sqm: f.sqm, images: [f.photo, "whiteKitchen", "plantBedroom"], serviceCharge: f.serviceCharge, agencyPct: f.agencyPct,
    legalPct: f.legalPct, caution: f.caution, power: f.power, water: "Borehole", security: "Gated", commute: { to: "Victoria Island", offPeak: 25, rush: 60 },
    features: [], about: "Added from the owner dashboard.", agent: "tolu", listedDaysAgo: 0, verified: false, status: "Available",
  };
  const m = movingIn(preview)!;
  const num = (k: keyof typeof f) => ({ type: "number", min: 0, className: "field", value: f[k] as number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(k, Number(e.target.value) as never) });

  return (
    <form
      className="mt-5 grid gap-6 lg:grid-cols-[1fr_360px]"
      onSubmit={(e) => {
        e.preventDefault();
        actions.addListing({ ...preview, slug: `${f.beds}-bed-${f.kind}-${f.area}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"), listedDaysAgo: 1 });
        onDone();
      }}
    >
      <div className="grid gap-4 rounded-3xl bg-paper p-6 shadow-card sm:grid-cols-2">
        <label className="sm:col-span-2"><span className="label">Title</span><input required className="field mt-1" placeholder="e.g. Newly built 2-bed flat" value={f.title} onChange={(e) => set("title", e.target.value)} /></label>
        <label><span className="label">Area</span><select className="field mt-1" value={f.area} onChange={(e) => set("area", e.target.value as Area)}>{AREAS.map((a) => <option key={a}>{a}</option>)}</select></label>
        <label><span className="label">Type</span><select className="field mt-1" value={f.kind} onChange={(e) => set("kind", e.target.value as Kind)}>{KINDS.map((a) => <option key={a}>{a}</option>)}</select></label>
        <label><span className="label">Rent per year (₦)</span><input {...num("price")} /></label>
        <label><span className="label">Service charge (₦)</span><input {...num("serviceCharge")} /></label>
        <label><span className="label">Agency fee (%)</span><input {...num("agencyPct")} /></label>
        <label><span className="label">Legal fee (%)</span><input {...num("legalPct")} /></label>
        <label><span className="label">Caution deposit (₦)</span><input {...num("caution")} /></label>
        <label><span className="label">Power</span><input className="field mt-1" value={f.power} onChange={(e) => set("power", e.target.value)} /></label>
        <label><span className="label">Bedrooms</span><input {...num("beds")} /></label>
        <label><span className="label">Bathrooms</span><input {...num("baths")} /></label>
        <fieldset className="sm:col-span-2">
          <legend className="label">Cover photo</legend>
          <div className="mt-2 flex gap-2 overflow-x-auto">
            {(["lightLiving", "brickLiving", "curvedBlock", "facade", "yardHouse"] as const).map((k) => (
              <button type="button" key={k} onClick={() => set("photo", k)} aria-pressed={f.photo === k} className={cx("shrink-0 overflow-hidden rounded-xl border-2", f.photo === k ? "border-clay" : "border-transparent")}>
                <img src={img(k, 200)} alt="" className="h-16 w-24 object-cover" />
              </button>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-stone">On a live site you upload your own photos here.</p>
        </fieldset>
      </div>
      <aside className="h-fit rounded-3xl bg-forest p-6 text-cream shadow-card lg:sticky lg:top-24">
        <p className="label !text-gold">What renters will see</p>
        <p className="mt-2 font-display text-4xl font-semibold">{naira(m.total)}</p>
        <p className="text-sm text-cream/70">move-in total, worked out for you</p>
        <div className="mt-4"><FeeBar l={preview} /></div>
        <ul className="mt-4 space-y-1.5 text-sm">
          {m.lines.map((x) => <li key={x.key} className="flex justify-between gap-2"><span className="text-cream/75">{x.label}</span><span className="font-semibold">{naira(x.amount)}</span></li>)}
        </ul>
        <button className="btn mt-6 w-full bg-gold text-ink hover:bg-cream">Publish listing</button>
      </aside>
    </form>
  );
}
