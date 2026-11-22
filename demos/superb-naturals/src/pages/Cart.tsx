import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fromKey, img, naira, waLink } from "../data/products";
import { WaIcon } from "../components/ui";
import { BANK, ZONES, zoneById } from "../data/delivery";
import { placeOrder, setQty, useStore } from "../lib/store";

const total = (lines: { slug: string; qty: number }[]) => lines.reduce((t, l) => t + (fromKey(l.slug)?.price ?? 0) * l.qty, 0);

export function Cart() {
  const s = useStore();
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", phone: "", email: "", zone: "", area: "", address: "", note: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const sub = total(s.cart);
  const z = zoneById(f.zone);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const x: Record<string, string> = {};
    if (f.name.trim().length < 2) x.name = "Please enter your name.";
    if (!/^(\+?234|0)[789][01]\d{8}$/.test(f.phone.replace(/[\s-]/g, ""))) x.phone = "Enter a Nigerian number, e.g. 0803 123 4567.";
    if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) x.email = "Check your email address, or leave it empty.";
    if (!z) x.zone = "Choose where we're delivering to.";
    if (f.area.trim().length < 2) x.area = "Which city or area are you in?";
    if (f.address.trim().length < 8) x.address = "Please add your full delivery address.";
    setErr(x);
    if (Object.keys(x).length) return;
    const ref = placeOrder({ name: f.name.trim(), phone: f.phone.trim(), email: f.email.trim(), zone: z!.label, fee: z!.fee, area: f.area.trim(), address: f.address.trim(), note: f.note.trim() });
    nav(`/order/${ref}`);
  };

  if (!s.cart.length)
    return (
      <section className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="text-5xl">🛍️</p>
        <h1 className="mt-4 font-display text-4xl font-semibold">Your bag is empty</h1>
        <p className="mt-3 text-stone">Find what your hair needs, or let the routine finder choose for you.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/shop" className="btn-leaf">Shop</Link>
          <Link to="/routine" className="btn-ghost">Find my routine</Link>
        </div>
      </section>
    );

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const due = sub + (z?.fee ?? 0);
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-5 pt-10 md:grid-cols-[1fr_1.1fr]">
      <div>
        <h1 className="font-display text-5xl font-semibold tracking-tight">Your bag</h1>
        <ul className="mt-8 space-y-3">
          {s.cart.map((l) => {
            const it = fromKey(l.slug);
            if (!it) return null;
            const { p } = it;
            return (
              <li key={l.slug} className="flex items-center gap-4 rounded-3xl bg-paper p-3 ring-1 ring-ink/5">
                <img src={img(p.images[0])} alt="" className="h-20 w-20 rounded-2xl object-cover" />
                <div className="flex-1">
                  <Link to={`/shop/${p.slug}`} className="font-display text-lg font-semibold">{p.name}</Link>
                  <p className="text-sm text-stone">{it.size ? `${it.size} · ` : ""}{naira(it.price)} each</p>
                  <div className="mt-2 flex items-center gap-1">
                    <button className="h-8 w-8 rounded-full bg-cream" onClick={() => setQty(l.slug, l.qty - 1)} aria-label={`One less ${p.name}`}>−</button>
                    <span className="w-7 text-center font-bold">{l.qty}</span>
                    <button className="h-8 w-8 rounded-full bg-cream" onClick={() => setQty(l.slug, l.qty + 1)} aria-label={`One more ${p.name}`}>+</button>
                    <button className="ml-3 text-sm font-semibold text-stone underline" onClick={() => setQty(l.slug, 0)}>Remove</button>
                  </div>
                </div>
                <p className="pr-2 font-display text-lg font-semibold">{naira(it.price * l.qty)}</p>
              </li>
            );
          })}
        </ul>
        <dl className="mt-6 space-y-2 rounded-3xl bg-leaf-soft p-5">
          <div className="flex justify-between"><dt>Products</dt><dd className="font-bold">{naira(sub)}</dd></div>
          <div className="flex justify-between gap-4"><dt>Delivery{z ? ` · ${z.label}` : ""}</dt><dd className="text-right text-sm font-semibold text-leaf-deep">{!z ? "Choose your location" : z.fee !== null ? naira(z.fee) : "Quoted on WhatsApp"}</dd></div>
          <div className="flex justify-between border-t border-leaf/20 pt-2 font-display text-xl"><dt>Total</dt><dd className="font-semibold">{naira(due)}{z && z.fee === null ? " + delivery" : ""}</dd></div>
        </dl>
      </div>

      <form onSubmit={submit} noValidate className="rounded-[2rem] bg-paper p-6 shadow-card ring-1 ring-ink/5 md:p-8">
        <p className="label text-blush">Checkout</p>
        <h2 className="mt-2 font-display text-3xl font-semibold">Where should it go?</h2>
        <div className="mt-6 grid gap-4">
          <Field label="Full name" error={err.name}><input className="field" autoComplete="name" value={f.name} onChange={set("name")} /></Field>
          <Field label="WhatsApp number" error={err.phone}><input className="field" type="tel" inputMode="tel" autoComplete="tel" placeholder="0803 123 4567" value={f.phone} onChange={set("phone")} /></Field>
          <Field label="Email (optional)" error={err.email}><input className="field" type="email" inputMode="email" autoComplete="email" placeholder="For a copy of your order" value={f.email} onChange={set("email")} /></Field>
          <Field label="Delivery location" error={err.zone}>
            <select className="field" value={f.zone} onChange={set("zone")}>
              <option value="">Choose your location</option>
              {ZONES.map((x) => (
                <option key={x.id} value={x.id}>{x.label}{x.fee !== null ? ` · ${naira(x.fee)}` : ""}</option>
              ))}
            </select>
            {z?.note && <span className="mt-1.5 block text-sm text-stone">{z.note}</span>}
          </Field>
          <Field label="City or town" error={err.area}><input className="field" placeholder="e.g. Ikeja" value={f.area} onChange={set("area")} /></Field>
          <Field label="Delivery address" error={err.address}><textarea className="field min-h-24" autoComplete="street-address" value={f.address} onChange={set("address")} /></Field>
          <Field label="Note (optional)"><input className="field" placeholder="Landmark, best time to call…" value={f.note} onChange={set("note")} /></Field>
        </div>
        <div className="mt-6 rounded-2xl bg-butter-soft p-4 text-sm">
          <p className="font-bold">🏦 You'll pay by bank transfer</p>
          <p className="mt-1 text-stone">Next you'll see the account details and your order number. Send your proof of payment on WhatsApp to confirm. Orders are dispatched within 2–3 days after payment is confirmed.</p>
        </div>
        <button type="submit" className="btn-leaf mt-6 w-full !py-4 text-base">Place order · {naira(due)}</button>
        <p className="mt-3 text-center text-xs text-stone">By placing an order you agree to our <Link to="/refund-policy" className="font-semibold underline">refund policy</Link> and <Link to="/delivery" className="font-semibold underline">delivery policy</Link>.</p>
      </form>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm font-semibold text-blush-deep" role="alert">{error}</span>}
    </label>
  );
}

export function OrderDone() {
  const { ref } = useParams();
  const s = useStore();
  const o = s.orders.find((x) => x.ref === ref);
  const [copied, setCopied] = useState(false);
  const [copiedAcct, setCopiedAcct] = useState(false);
  if (!o)
    return (
      <section className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl">Order not found on this device.</h1>
        <Link to="/shop" className="btn-leaf mt-6">Back to the shop</Link>
      </section>
    );
  const products = total(o.lines);
  const amount = products + (o.fee ?? 0);
  const summary = `Hello Superb Naturals 👋 I just placed order ${o.ref}.\n${o.lines.map((l) => `• ${l.qty} × ${fromKey(l.slug)?.label}`).join("\n")}\nProducts: ${naira(products)}\nDelivery (${o.zone}): ${o.fee !== null ? naira(o.fee) : "please quote"}\nTotal: ${naira(amount)}${o.fee === null ? " + delivery" : ""}\nPaid to: ${BANK.bank} ${BANK.number}\nName: ${o.name}\nDeliver to: ${o.address}, ${o.area}\nHere is my proof of payment:`;
  return (
    <section className="mx-auto max-w-2xl px-5 pt-12 text-center">
      <p className="text-6xl">💚</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight">Thank you, {o.name.split(" ")[0]}!</h1>
      <p className="mt-3 text-lg text-stone">Your order number is</p>
      <button
        className="mt-2 inline-flex items-center gap-3 rounded-full bg-paper px-6 py-3 font-display text-2xl font-semibold ring-1 ring-ink/10"
        onClick={() => {
          navigator.clipboard?.writeText(o.ref).then(() => setCopied(true), () => {});
        }}
      >
        {o.ref} <span className="text-sm font-sans font-bold text-leaf">{copied ? "Copied ✓" : "Copy"}</span>
      </button>

      <div className="mt-10 rounded-[2rem] bg-paper p-6 text-left shadow-card ring-1 ring-ink/5 md:p-8">
        <p className="label text-blush">Step 1 · Transfer</p>
        <p className="mt-2 font-display text-4xl font-semibold">{naira(amount)}</p>
        <p className="text-sm text-stone">{o.fee !== null ? `Products ${naira(products)} + delivery to ${o.zone} ${naira(o.fee)}` : `Products only. Delivery to ${o.zone} will be quoted on WhatsApp before you pay for it.`}</p>
        <dl className="mt-5 grid gap-2 rounded-2xl border-2 border-dashed border-leaf/30 bg-leaf-soft/50 p-4 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-stone">Bank</dt><dd className="font-bold">{BANK.bank}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-stone">Account name</dt><dd className="font-bold">{BANK.name}</dd></div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-stone">Account number</dt>
            <dd className="flex items-center gap-2 font-display text-lg font-bold">
              {BANK.number}
              <button type="button" className="rounded-full bg-white px-2.5 py-1 font-sans text-xs font-bold text-leaf ring-1 ring-leaf/30" onClick={() => navigator.clipboard?.writeText(BANK.number).then(() => setCopiedAcct(true), () => {})}>
                {copiedAcct ? "Copied ✓" : "Copy"}
              </button>
            </dd>
          </div>
          <div className="flex justify-between gap-4"><dt className="text-stone">Narration</dt><dd className="font-bold">{o.ref}</dd></div>
        </dl>
        <p className="label mt-8 text-blush">Step 2 · Send your proof</p>
        <p className="mt-2 text-stone">Send a screenshot of your transfer on WhatsApp. Your order details are already written for you.</p>
        <a className="btn-leaf mt-5 w-full !py-4 text-base" href={waLink(summary)} target="_blank" rel="noopener noreferrer">
          <WaIcon /> Send proof on WhatsApp
        </a>
        <p className="mt-4 text-sm text-stone">Superb Naturals will confirm your payment on WhatsApp. Orders are dispatched within 2–3 days after payment is confirmed.</p>
        <a className="btn-ghost mt-4 w-full !py-3.5" href={waLink(`Hello Superb Naturals 👋 I'd like an update on my order ${o.ref}.`)} target="_blank" rel="noopener noreferrer">
          Track my order on WhatsApp
        </a>
      </div>
      <Link to="/shop" className="mt-8 inline-block font-bold text-leaf underline underline-offset-4">Keep shopping</Link>
    </section>
  );
}
