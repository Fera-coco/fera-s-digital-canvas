import { cloneElement, useRef, useState, type ReactNode } from "react";
import { applyByWhatsApp, APPLY_EMAIL, CATEGORIES, emptyApplication, submitApplication, type Application } from "@/content/openCall";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<keyof Application, string>>;

const emailOk = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim());
const phoneOk = (v: string) => v.replace(/[^\d]/g, "").length >= 7 && v.trim().length <= 30;

const validate = (a: Application): Errors => {
  const e: Errors = {};
  if (!a.business_name.trim()) e.business_name = "Tell us your business name.";
  if (!a.contact_name.trim()) e.contact_name = "Who should we contact?";
  if (!emailOk(a.email)) e.email = "Enter an email address we can reply to, like name@example.com.";
  if (!phoneOk(a.phone)) e.phone = "Enter a phone or WhatsApp number, with country code if you can.";
  if (!a.country) e.country = "Choose where your business is based.";
  if (!a.category) e.category = "Choose the closest category.";
  if (!a.about.trim()) e.about = "Tell us briefly what your business does.";
  if (!a.goal.trim()) e.goal = "Tell us what you'd like the website to do for you.";
  if (!a.has_domain) e.has_domain = "Let us know if you already have a domain.";
  if (!a.agreed_to_costs) e.agreed_to_costs = "Please confirm you understand who pays for what.";
  return e;
};

const order: (keyof Application)[] = ["contact_name", "email", "phone", "business_name", "country", "category", "about", "goal", "has_domain", "agreed_to_costs"];

/* The application, styled as a visitor's card from the exhibition. */
const ApplyForm = () => {
  const [a, setA] = useState<Application>(emptyApplication);
  const [errors, setErrors] = useState<Errors>({});
  const [phase, setPhase] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [trap, setTrap] = useState(""); // honeypot: real people never see this field
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof Application>(k: K, v: Application[K]) => {
    setA((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate(a);
    setErrors(e);
    const first = order.find((k) => e[k]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setPhase("sending");
    try {
      if (!trap) await submitApplication(a);
      setPhase("sent");
      requestAnimationFrame(() => doneRef.current?.focus());
    } catch {
      setPhase("failed");
    }
  };

  if (phase === "sent") {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="ticket relative mt-10 max-w-3xl bg-paper p-8 outline-none md:p-12">
        <p className="label text-stone">Application received · The Open Call</p>
        <p className="display mt-4 text-[clamp(2.4rem,5vw,4rem)]">
          Thank you, <em className="italic">{a.contact_name.trim().split(" ")[0]}</em>.
        </p>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/85">
          {a.business_name.trim()}'s application is now with Fera's Studio. Applying doesn't reserve a spot: Fera will
          review it and reply by email or WhatsApp. The counter above only changes when a business is confirmed.
        </p>
        <span aria-hidden className="absolute right-6 top-6 md:right-10 md:top-10">
          <span className="oc-reveal oc-stamp is-seen block rounded-md border-2 border-coral px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-coral-ink" style={{ "--stamp-rot": "-10deg" } as React.CSSProperties}>
            Received
          </span>
        </span>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="frame relative mt-10 max-w-4xl bg-paper p-6 md:p-10">
      <p className="label text-stone">Application card · all fields marked * are required</p>

      {/* honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this empty
          <input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </label>
      </div>

      <Group title="About you" no="i.">
        <Field label="Your name *" name="contact_name" error={errors.contact_name}>
          <input name="contact_name" autoComplete="name" value={a.contact_name} onChange={(e) => set("contact_name", e.target.value)} maxLength={120} />
        </Field>
        <Field label="Email *" name="email" error={errors.email}>
          <input name="email" type="email" autoComplete="email" inputMode="email" value={a.email} onChange={(e) => set("email", e.target.value)} maxLength={200} />
        </Field>
        <Field label="Phone or WhatsApp number *" name="phone" error={errors.phone} hint="Include your country code, e.g. +234 or +229.">
          <input name="phone" type="tel" autoComplete="tel" inputMode="tel" value={a.phone} onChange={(e) => set("phone", e.target.value)} maxLength={30} />
        </Field>
      </Group>

      <Group title="About your business" no="ii.">
        <Field label="Business name *" name="business_name" error={errors.business_name}>
          <input name="business_name" autoComplete="organization" value={a.business_name} onChange={(e) => set("business_name", e.target.value)} maxLength={120} />
        </Field>
        <fieldset className="sm:col-span-2" aria-describedby={errors.country ? "err-country" : undefined}>
          <legend className="label mb-3 text-stone">Where is your business based? *</legend>
          <div className="flex flex-wrap gap-3">
            {(["Nigeria", "Benin Republic"] as const).map((c) => (
              <label key={c} className={cn("cursor-pointer rounded-full border-2 px-5 py-2.5 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2", a.country === c ? "border-ink bg-ink text-cream" : "border-ink/25 hover:border-ink")}>
                <input type="radio" name="country" value={c} checked={a.country === c} onChange={() => set("country", c)} className="sr-only" />
                Business in {c}
              </label>
            ))}
          </div>
          {errors.country && <ErrorText id="err-country">{errors.country}</ErrorText>}
        </fieldset>
        <Field label="Business category *" name="category" error={errors.category}>
          <select name="category" value={a.category} onChange={(e) => set("category", e.target.value)}>
            <option value="">Choose one</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Existing website or social media link" name="links" hint="Optional. Instagram, TikTok, Facebook or an old site.">
          <input name="links" value={a.links} onChange={(e) => set("links", e.target.value)} maxLength={500} placeholder="instagram.com/yourbusiness" />
        </Field>
        <Field label="What does your business do? *" name="about" error={errors.about} wide>
          <textarea name="about" rows={3} value={a.about} onChange={(e) => set("about", e.target.value)} maxLength={1500} />
        </Field>
      </Group>

      <Group title="Your website" no="iii.">
        <Field label="What would you like your website to achieve? *" name="goal" error={errors.goal} wide hint="For example: show my products, take enquiries, look more professional.">
          <textarea name="goal" rows={3} value={a.goal} onChange={(e) => set("goal", e.target.value)} maxLength={1500} />
        </Field>
        <fieldset className="sm:col-span-2" aria-describedby={errors.has_domain ? "err-has_domain" : undefined}>
          <legend className="label mb-3 text-stone">Do you already have a domain (like yourbusiness.com)? *</legend>
          <div className="flex flex-wrap gap-2">
            {(["Yes", "No", "Not sure"] as const).map((d) => (
              <label key={d} className={cn("cursor-pointer rounded-full border-2 px-4 py-2 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2", a.has_domain === d ? "border-ink bg-ink text-cream" : "border-ink/25 hover:border-ink")}>
                <input type="radio" name="has_domain" value={d} checked={a.has_domain === d} onChange={() => set("has_domain", d)} className="sr-only" />
                {d}
              </label>
            ))}
          </div>
          {errors.has_domain && <ErrorText id="err-has_domain">{errors.has_domain}</ErrorText>}
        </fieldset>
      </Group>

      <div className="mt-8 border-t border-ink/10 pt-6">
        <label className={cn("flex cursor-pointer items-start gap-3 rounded-sm p-3", errors.agreed_to_costs ? "bg-coral-soft/50" : "bg-butter-soft")}>
          <input
            type="checkbox"
            name="agreed_to_costs"
            checked={a.agreed_to_costs}
            onChange={(e) => set("agreed_to_costs", e.target.checked)}
            aria-invalid={!!errors.agreed_to_costs}
            aria-describedby={errors.agreed_to_costs ? "err-agreed_to_costs" : undefined}
            className="mt-1 h-5 w-5 shrink-0 accent-ink"
          />
          <span className="leading-relaxed">
            I understand that website design and development are free, while domain registration, hosting and any agreed
            third-party costs are my responsibility. *
          </span>
        </label>
        {errors.agreed_to_costs && <ErrorText id="err-agreed_to_costs">{errors.agreed_to_costs}</ErrorText>}
      </div>

      {phase === "failed" && (
        <div role="alert" className="mt-6 rounded-sm border-l-4 border-coral bg-coral-soft/40 p-4 text-sm leading-relaxed">
          <strong className="font-semibold">Your application didn't go through.</strong> Please check your connection and try
          again, or apply by <a href={applyByWhatsApp} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">WhatsApp</a> or{" "}
          <a href={`mailto:${APPLY_EMAIL}`} className="underline underline-offset-2">email</a> instead.
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={phase === "sending"} className="btn-ink px-8 py-4 text-base disabled:cursor-wait disabled:opacity-70">
          {phase === "sending" ? "Sending your application…" : "Submit application"} <span aria-hidden>→</span>
        </button>
        <a href={applyByWhatsApp} target="_blank" rel="noopener noreferrer" className="link-underline text-sm text-stone">
          Questions first? Chat with Fera on WhatsApp ↗
        </a>
      </div>
    </form>
  );
};

/* ---------- pieces ---------- */

const Group = ({ title, no, children }: { title: string; no: string; children: ReactNode }) => (
  <section className="mt-8 border-t border-ink/10 pt-6 first-of-type:mt-6">
    <h3 className="flex items-baseline gap-3 font-serif text-2xl">
      <span className="font-serif text-base italic text-stone">{no}</span> {title}
    </h3>
    <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
  </section>
);

const Field = ({ label, name, error, hint, wide, children }: { label: string; name: string; error?: string; hint?: string; wide?: boolean; children: React.ReactElement<Record<string, unknown>> }) => {
  const id = `f-${name}`;
  const desc = [hint && `${id}-hint`, error && `err-${name}`].filter(Boolean).join(" ") || undefined;
  const control = cloneElement(children, {
    id,
    "aria-invalid": !!error,
    "aria-describedby": desc,
    className: cn(
      "mt-2 w-full rounded-sm border-0 border-b-2 bg-cream/70 px-3 py-2.5 text-base outline-none transition-colors focus:bg-cream",
      error ? "border-coral-ink" : "border-ink/25 focus:border-ink",
    ),
  });
  return (
    <div className={cn(wide && "sm:col-span-2")}>
      <label htmlFor={id} className="label text-stone">
        {label}
      </label>
      {control}
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-stone">
          {hint}
        </p>
      )}
      {error && <ErrorText id={`err-${name}`}>{error}</ErrorText>}
    </div>
  );
};

const ErrorText = ({ id, children }: { id: string; children: ReactNode }) => (
  <p id={id} className="mt-1.5 text-sm text-coral-ink">
    {children}
  </p>
);

export default ApplyForm;
