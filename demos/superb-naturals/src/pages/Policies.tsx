import { Link } from "react-router-dom";
import { DELIVERY_POLICY, INTERNATIONAL, INTERNATIONAL_BASIS, REFUND_POLICY, ZONES } from "../data/delivery";
import { naira, waLink } from "../data/products";
import { WaIcon } from "../components/ui";

export function Delivery() {
  return (
    <section className="mx-auto max-w-3xl px-5 pt-10">
      <h1 className="font-display text-5xl font-semibold tracking-tight">We deliver nationwide and internationally</h1>

      <h2 className="mt-12 font-display text-3xl font-semibold">Nigeria delivery rates</h2>
      <div className="mt-5 overflow-hidden rounded-3xl bg-paper ring-1 ring-ink/10">
        <table className="w-full text-left">
          <thead className="bg-leaf-soft text-sm">
            <tr>
              <th className="px-5 py-3 font-bold">Location</th>
              <th className="px-5 py-3 text-right font-bold">Delivery fee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {ZONES.filter((z) => z.fee !== null).map((z) => (
              <tr key={z.id}>
                <td className="px-5 py-3.5">{z.label}</td>
                <td className="px-5 py-3.5 text-right font-display text-lg font-semibold">{naira(z.fee!)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-stone">Somewhere else in Nigeria? Your fee is confirmed on WhatsApp.</p>

      <h2 className="mt-12 font-display text-3xl font-semibold">International delivery</h2>
      <p className="mt-3 text-stone">We ship internationally to customers in:</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {INTERNATIONAL.map((c) => (
          <li key={c} className="rounded-full bg-paper px-4 py-2 text-sm font-semibold ring-1 ring-ink/10">{c}</li>
        ))}
      </ul>
      <p className="mt-5 text-stone">International shipping fees are calculated based on:</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {INTERNATIONAL_BASIS.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      <a className="btn-leaf mt-6" href={waLink("Hello Superb Naturals 👋 I'd like an international delivery quote.")} target="_blank" rel="noopener noreferrer">
        <WaIcon /> Get an international quote
      </a>

      <h2 className="mt-12 font-display text-3xl font-semibold">Delivery policy</h2>
      <ol className="mt-5 space-y-3">
        {DELIVERY_POLICY.map((x, i) => (
          <li key={x} className="flex gap-4 rounded-2xl bg-paper p-4 ring-1 ring-ink/5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-leaf font-bold text-white">{i + 1}</span>
            <span className="pt-1">{x}</span>
          </li>
        ))}
      </ol>
      <p className="mt-8 text-sm text-stone">
        See also our <Link to="/refund-policy" className="font-bold text-leaf underline underline-offset-4">refund & return policy</Link>.
      </p>
    </section>
  );
}

export function Refunds() {
  return (
    <section className="mx-auto max-w-3xl px-5 pt-10">
      <h1 className="font-display text-5xl font-semibold tracking-tight">Refund & return policy</h1>
      <p className="mt-5 text-lg leading-relaxed text-stone">
        At Superb Naturals, customer satisfaction is important to us. We are committed to providing quality hair care products and excellent service. Please read our refund policy before placing an order.
      </p>
      <div className="mt-10 space-y-4">
        {REFUND_POLICY.map((s, i) => (
          <div key={s.title} className="rounded-3xl bg-paper p-6 ring-1 ring-ink/5">
            <h2 className="font-display text-2xl font-semibold">
              <span className="text-blush">{i + 1}.</span> {s.title}
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
              {s.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-3xl bg-butter-soft p-6">
        <p className="label">Important notice</p>
        <p className="mt-2 leading-relaxed">Please inspect your order immediately upon delivery and contact us promptly if there is any issue.</p>
      </div>
      <p className="mt-8 text-center font-display text-2xl">Thank you for choosing Superb Naturals. <br className="sm:hidden" /><span className="italic text-blush">Healthy Hair. Happy You.</span></p>
      <p className="mt-6 text-center">
        <a className="btn-ghost" href={waLink("Hello Superb Naturals 👋 I have an issue with my order.")} target="_blank" rel="noopener noreferrer">
          <WaIcon /> Report an issue on WhatsApp
        </a>
      </p>
    </section>
  );
}
