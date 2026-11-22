import { Link } from "react-router-dom";
import { img, movingIn, naira, type Listing } from "../data/listings";
import { ListingCard, cx } from "../components/ui";
import { actions, allListings, useStore } from "../lib/store";

export default function Compare() {
  const store = useStore();
  const all = allListings(store);
  const saved = all.filter((l) => store.saved.includes(l.slug));
  const comparing = all.filter((l) => store.compare.includes(l.slug));

  const rows: [string, (l: Listing) => string][] = [
    ["Price", (l) => naira(l.price) + (l.deal === "rent" ? " / yr" : "")],
    ["Move-in total", (l) => (movingIn(l) ? naira(movingIn(l)!.total) : "Sale")],
    ["Bedrooms", (l) => `${l.beds} bed, ${l.baths} bath`],
    ["Size", (l) => `${l.sqm} m²`],
    ["Power", (l) => l.power],
    ["Water", (l) => l.water],
    ["Rush-hour drive", (l) => `${l.commute.rush} min to ${l.commute.to}`],
    ["Title", (l) => (l.titleDocs ? `${l.titleDocs.filter((d) => d.status === "seen").length} of ${l.titleDocs.length} documents seen` : "Rental")],
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 pt-8 md:px-6">
      <h1 className="font-display text-4xl font-semibold">Your shortlist</h1>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold">Side by side</h2>
          <p className="text-sm text-stone">Up to 3 homes. Add from any listing.</p>
        </div>
        {comparing.length === 0 ? (
          <p className="mt-4 rounded-3xl bg-paper p-6 text-stone shadow-card">Nothing to compare yet. Open a home and tap <span className="font-semibold text-ink">Add to compare</span>.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-3xl bg-paper shadow-card">
            <table className="w-full min-w-[640px] text-left text-[14px]">
              <thead>
                <tr>
                  <th className="w-40 p-4" />
                  {comparing.map((l) => (
                    <th key={l.slug} className="p-4 align-top">
                      <Link to={`/homes/${l.slug}`} className="group block">
                        <img src={img(l.images[0], 500)} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" />
                        <p className="mt-2 font-semibold group-hover:underline">{l.title}</p>
                        <p className="text-[13px] font-normal text-stone">{l.area}</p>
                      </Link>
                      <button onClick={() => actions.toggleCompare(l.slug)} className="mt-1 text-[12px] font-bold text-clay-ink hover:underline">Remove</button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, f], i) => (
                  <tr key={label} className={cx(i % 2 === 0 && "bg-cream/60")}>
                    <th scope="row" className="p-4 font-semibold text-stone">{label}</th>
                    {comparing.map((l) => <td key={l.slug} className="p-4 align-top">{f(l)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">Saved homes</h2>
        {saved.length === 0 ? (
          <p className="mt-4 rounded-3xl bg-paper p-6 text-stone shadow-card">Tap the heart on any home to save it here.</p>
        ) : (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{saved.map((l) => <ListingCard key={l.slug} l={l} />)}</div>
        )}
      </section>
    </main>
  );
}
