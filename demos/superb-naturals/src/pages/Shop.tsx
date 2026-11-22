import { useSearchParams } from "react-router-dom";
import { CONCERNS, products, type Concern } from "../data/products";
import { ProductCard } from "../components/ui";
import ConcernIcon from "../components/ConcernIcon";
import { Heart } from "../components/icons";
import { useStore } from "../lib/store";

const KINDS = ["All", "Oil", "Wash", "Butter", "Kit", "Tool", "Beard"] as const;

export default function Shop() {
  const [q, setQ] = useSearchParams();
  const s = useStore();
  const concern = q.get("concern") as Concern | null;
  const kind = q.get("kind") ?? "All";
  const loved = q.get("saved") === "1";
  const list = products.filter(
    (p) => (!concern || p.concerns.includes(concern)) && (kind === "All" || p.kind === kind) && (!loved || s.loved.includes(p.slug)),
  );
  const setParam = (k: string, v: string | null) => {
    const n = new URLSearchParams(q);
    if (v) n.set(k, v);
    else n.delete(k);
    setQ(n, { replace: true });
  };
  const c = CONCERNS.find((x) => x.id === concern);
  return (
    <section className="mx-auto max-w-6xl px-5 pt-10">
      <h1 className="font-display text-5xl font-semibold tracking-tight">{c ? `For ${c.label.toLowerCase()}` : loved ? "Your favourites" : kind === "Beard" ? "For the men" : "All products"}</h1>

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by concern">
        <Chip on={!concern} onClick={() => setParam("concern", null)}>Everything</Chip>
        {CONCERNS.map((x) => (
          <Chip key={x.id} on={concern === x.id} onClick={() => setParam("concern", concern === x.id ? null : x.id)}>
            <span className="inline-flex items-center gap-1.5"><ConcernIcon id={x.id} size={17} /> {x.label}</span>
          </Chip>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by type">
        {KINDS.map((k) => (
          <button key={k} onClick={() => setParam("kind", k === "All" ? null : k)} aria-pressed={kind === k} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${kind === k ? "bg-ink text-white" : "text-stone hover:bg-ink/5"}`}>
            {({ All: "All types", Oil: "Oils", Wash: "Shampoo & conditioner", Butter: "Butter", Kit: "Kits", Tool: "Tools", Beard: "For men" } as const)[k]}
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-ink/15" />
        <button onClick={() => setParam("saved", loved ? null : "1")} aria-pressed={loved} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${loved ? "bg-blush text-white" : "text-stone hover:bg-ink/5"}`}>
          <span className="inline-flex items-center gap-1.5"><Heart size={15} filled={loved} /> Saved ({s.loved.length})</span>
        </button>
      </div>

      <p className="mt-8 text-sm text-stone">{list.length} product{list.length === 1 ? "" : "s"}</p>
      {list.length ? (
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {list.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-3xl bg-paper p-10 text-center ring-1 ring-ink/10">
          <p className="font-display text-2xl">Nothing here yet.</p>
          <p className="mt-2 text-stone">{loved ? "Tap the heart on any product to save it." : "Try another filter."}</p>
        </div>
      )}
    </section>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={on} className={`rounded-full px-4 py-2.5 text-sm font-bold transition ${on ? "bg-leaf text-white" : "bg-paper ring-1 ring-ink/10 hover:ring-ink/30"}`}>
      {children}
    </button>
  );
}
