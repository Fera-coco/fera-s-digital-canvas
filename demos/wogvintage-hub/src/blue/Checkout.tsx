import {useEffect, useState, type FormEvent, type ReactElement} from 'react'
import {Link} from 'react-router-dom'
import {allPieces, formatNaira, newOrderRef, paidText, payAccounts, photo, priceLabel, shop, wa, type Delivery} from '../lib/shop'
import {useBag} from '../lib/bag'
import {BagIcon, ChatIcon, CheckIcon, CloseIcon, CopyIcon} from '../components/Icons'
import {Seo} from '../components/Seo'

const STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'Outside Nigeria',
]
const EMPTY: Delivery = {name: '', phone: '', address: '', city: '', state: '', note: ''}

// Progress is kept on this phone so a customer can leave for their banking app and come back
// to the same order reference and details. It is cleared when they finish.
type Saved = {step: 'details' | 'pay' | 'sent'; ref: string; d: Delivery}
const KEY = 'wog-checkout-v1'
const load = (): Saved | null => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null')
  } catch {
    return null
  }
}
const save = (v: Saved | null) => {
  try {
    if (v) localStorage.setItem(KEY, JSON.stringify(v))
    else localStorage.removeItem(KEY)
  } catch {
    /* storage blocked */
  }
}

export function BlueCheckout() {
  const bag = useBag()
  const saved = load()
  const [step, setStep] = useState<Saved['step']>(saved?.step || 'details')
  const [ref, setRef] = useState(saved?.ref || '')
  const [d, setD] = useState<Delivery>(saved?.d || EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof Delivery, string>>>({})

  const items = bag.items.map((b) => allPieces.find((p) => p.id === b.id)).filter((p): p is NonNullable<typeof p> => !!p && !p.sold)
  const total = items.reduce((s, p) => s + (p.price || 0), 0)

  useEffect(() => {
    save(step === 'details' && !ref ? null : {step, ref, d})
  }, [step, ref, d])

  const set = (k: keyof Delivery) => (e: {target: {value: string}}) => {
    setD((x) => ({...x, [k]: e.target.value}))
    if (errors[k]) setErrors((x) => ({...x, [k]: undefined}))
  }

  const continueToPay = (e: FormEvent) => {
    e.preventDefault()
    const er: typeof errors = {}
    if (d.name.trim().length < 2) er.name = 'Enter your full name.'
    if (!/^\+?[\d\s-]{10,16}$/.test(d.phone.trim())) er.phone = 'Enter a number we can reach you on, e.g. 0803 123 4567.'
    if (d.address.trim().length < 6) er.address = 'Enter the street address for delivery.'
    if (d.city.trim().length < 2) er.city = 'Enter your city or town.'
    if (!d.state) er.state = 'Choose your state.'
    setErrors(er)
    if (Object.keys(er).length) {
      setTimeout(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
      return
    }
    setD((x) => Object.fromEntries(Object.entries(x).map(([k, v]) => [k, v.trim()])) as Delivery)
    setRef((r) => r || newOrderRef())
    setStep('pay')
    window.scrollTo({top: 0})
  }

  const sent = wa(paidText(ref, items, total, d))
  const finish = () => {
    bag.clear()
    save(null)
  }

  if (items.length === 0 && step !== 'sent') {
    return (
      <Page>
        <div className="mt-8 border-2 border-dashed border-ink/40 bg-mist px-6 py-12">
          <BagIcon className="size-8 text-cobalt" />
          <p className="mt-3 font-wide text-2xl text-cobalt">Your bag is empty</p>
          <p className="mt-1 text-muted">Pick a shirt off the rail and check out here.</p>
          <Link to="/#rail" className="mt-6 inline-flex rounded-full border-2 border-ink bg-sun px-6 py-3 font-bold shadow-[3px_3px_0_var(--color-ink)]">
            Back to the rail
          </Link>
        </div>
      </Page>
    )
  }

  return (
    <Page>
      <ol className="mt-6 grid grid-cols-3 gap-2 text-xs font-bold sm:text-sm" aria-label="Checkout steps">
        {['Delivery details', 'Pay by transfer', 'Send receipt'].map((t, i) => {
          const at = step === 'details' ? 0 : step === 'pay' ? 1 : 2
          return (
            <li key={t} aria-current={i === at ? 'step' : undefined} className={`border-t-4 pt-2 ${i <= at ? 'border-cobalt text-ink' : 'border-line text-muted'}`}>
              {i + 1}. {t}
            </li>
          )
        })}
      </ol>

      <div className="mt-8 grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-start">
        {/* The bag */}
        <section aria-labelledby="bag-h" className="md:sticky md:top-24">
          <h2 id="bag-h" className="font-wide text-xl">
            Your shirts
          </h2>
          <ul className="mt-3 divide-y-2 divide-ink/10 border-y-2 border-ink">
            {items.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-3">
                <img src={photo(p.photos[0], 480)} alt="" width={60} height={75} className="h-[75px] w-[60px] border-2 border-ink bg-mist object-cover" />
                <div className="min-w-0 flex-1">
                  <Link to={`/piece/${p.slug}`} className="font-semibold leading-tight hover:text-cobalt">
                    {p.name}
                  </Link>
                  <p className="text-sm text-muted">{priceLabel(p.price)}</p>
                </div>
                {step === 'details' ? (
                  <button type="button" onClick={() => bag.remove(p.id)} aria-label={`Remove ${p.name}`} className="rounded-full p-2 text-muted hover:bg-mist hover:text-tomato">
                    <CloseIcon />
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1">
            <div className="flex justify-between font-wide text-xl">
              <dt>Shirts total</dt>
              <dd className="text-cobalt">{formatNaira(total)}</dd>
            </div>
            <div className="flex justify-between text-sm text-muted">
              <dt>Delivery</dt>
              <dd>Confirmed on WhatsApp after payment</dd>
            </div>
          </dl>
          {step === 'details' ? (
            <Link to="/#rail" className="mt-4 inline-block text-sm font-bold text-cobalt hover:underline">
              Add another shirt
            </Link>
          ) : null}
        </section>

        {/* Steps */}
        <section aria-live="polite">
          {step === 'details' ? (
            <form onSubmit={continueToPay} noValidate className="border-2 border-ink bg-white p-5 shadow-[5px_5px_0_var(--color-ink)] sm:p-7">
              <h2 className="font-wide text-2xl text-cobalt">Where should it go?</h2>
              <p className="mt-1 text-sm text-muted">These go into your WhatsApp message to {shop.shopName}. Nothing is sent until you send it.</p>
              <div className="mt-5 grid gap-4">
                <Field label="Full name" error={errors.name}>
                  <input value={d.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} />
                </Field>
                <Field label="Phone number" hint="Your WhatsApp number is best" error={errors.phone}>
                  <input value={d.phone} onChange={set('phone')} type="tel" inputMode="tel" autoComplete="tel" aria-invalid={!!errors.phone} />
                </Field>
                <Field label="Delivery address" error={errors.address}>
                  <textarea value={d.address} onChange={set('address')} rows={2} autoComplete="street-address" aria-invalid={!!errors.address} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="City or town" error={errors.city}>
                    <input value={d.city} onChange={set('city')} autoComplete="address-level2" aria-invalid={!!errors.city} />
                  </Field>
                  <Field label="State" error={errors.state}>
                    <select value={d.state} onChange={set('state')} autoComplete="address-level1" aria-invalid={!!errors.state}>
                      <option value="">Choose a state</option>
                      {STATES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Note (optional)" hint="Landmark, best time to deliver">
                  <textarea value={d.note} onChange={set('note')} rows={2} maxLength={300} />
                </Field>
              </div>
              <button type="submit" className="mt-6 w-full rounded-full border-2 border-ink bg-sun px-6 py-4 text-lg font-bold shadow-[3px_3px_0_var(--color-ink)] hover:bg-white">
                Continue to payment
              </button>
            </form>
          ) : null}

          {step === 'pay' ? (
            <div className="border-2 border-ink bg-white p-5 shadow-[5px_5px_0_var(--color-ink)] sm:p-7">
              <h2 className="font-wide text-2xl text-cobalt">Pay by bank transfer</h2>
              <p className="mt-1 text-muted">Transfer the exact amount below, then send your receipt on WhatsApp.</p>

              <div className="mt-5 grid gap-px overflow-hidden border-2 border-ink bg-ink">
                <Row label="Amount" value={formatNaira(total)} copy={String(total)} big />
                <Row label="Order reference" hint="Use this as your transfer narration" value={ref} copy={ref} />
                {payAccounts().length ? (
                  <>
                    <div className="bg-cream px-4 py-2.5 text-sm">
                      Pay into {payAccounts().length > 1 ? 'either account' : 'this account'}. Account name: <strong>{payAccounts()[0].accountName}</strong>
                    </div>
                    {payAccounts().map((b) => (
                      <Row key={b.accountNumber} label={b.bankName} value={b.accountNumber} copy={b.accountNumber} big />
                    ))}
                  </>
                ) : (
                  <div className="bg-cream px-4 py-4">
                    <p className="font-bold">Bank details coming soon</p>
                    <p className="text-sm text-muted">This is a demo. {shop.shopName}'s account details appear here once confirmed.</p>
                  </div>
                )}
              </div>

              <ol className="mt-6 space-y-2 text-[0.97rem]">
                <li><strong>1.</strong> Transfer {formatNaira(total)} with <strong>{ref}</strong> as the narration.</li>
                <li><strong>2.</strong> Screenshot your payment receipt.</li>
                <li><strong>3.</strong> Tap the button below and attach the receipt in WhatsApp before you send.</li>
              </ol>

              <a
                href={sent}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setStep('sent')}
                className="mt-6 flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-whatsapp px-6 py-4 text-lg font-bold text-white shadow-[3px_3px_0_var(--color-ink)] hover:bg-whatsapp-deep"
              >
                <ChatIcon /> I've paid: send receipt
              </a>
              <p className="mt-3 text-center text-sm text-muted">Delivery price is confirmed on WhatsApp once {shop.shopName} sees your address.</p>
              <button type="button" onClick={() => setStep('details')} className="mx-auto mt-4 block text-sm font-bold text-cobalt hover:underline">
                Edit delivery details
              </button>
            </div>
          ) : null}

          {step === 'sent' ? (
            <div className="border-2 border-ink bg-white p-5 shadow-[5px_5px_0_var(--color-ink)] sm:p-7">
              <span className="grid size-14 place-items-center rounded-full border-2 border-ink bg-whatsapp text-white">
                <CheckIcon className="size-7" />
              </span>
              <h2 className="mt-4 font-wide text-2xl text-cobalt">Almost done</h2>
              <p className="mt-2">
                In WhatsApp, <strong>attach your payment receipt</strong> and send the message. {shop.shopName} will reply with your delivery price and track your order with reference <strong>{ref}</strong>.
              </p>
              <div className="mt-6 grid gap-3">
                <a href={sent} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-whatsapp px-6 py-3.5 font-bold text-white">
                  <ChatIcon /> Open WhatsApp again
                </a>
                <Link to="/" onClick={finish} className="rounded-full border-2 border-ink bg-sun px-6 py-3.5 text-center font-bold shadow-[3px_3px_0_var(--color-ink)]">
                  Sent. Clear my bag
                </Link>
                <button type="button" onClick={() => setStep('pay')} className="text-sm font-bold text-cobalt hover:underline">
                  Back to payment details
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </Page>
  )
}

function Page({children}: {children: React.ReactNode}) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <Seo title={`Checkout | ${shop.shopName}`} description="Pay by transfer and send your receipt and address on WhatsApp." path="/checkout" />
      <h1 className="font-wide text-4xl text-cobalt sm:text-5xl">Checkout</h1>
      {children}
    </div>
  )
}

function Row({label, hint, value, copy, big}: {label: string; hint?: string; value: string; copy?: string; big?: boolean}) {
  const [done, setDone] = useState(false)
  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(copy || value)
      setDone(true)
      setTimeout(() => setDone(false), 1500)
    } catch {
      /* clipboard blocked */
    }
  }
  return (
    <div className="flex items-center justify-between gap-3 bg-white px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm text-muted">
          {label}
          {hint ? <span className="block text-xs">{hint}</span> : null}
        </p>
        <p className={`font-bold ${big ? 'font-wide text-2xl' : 'text-lg'}`}>{value}</p>
      </div>
      {copy ? (
        <button type="button" onClick={doCopy} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1.5 text-sm font-bold hover:bg-sun">
          <CopyIcon /> <span aria-live="polite">{done ? 'Copied' : 'Copy'}</span>
        </button>
      ) : null}
    </div>
  )
}

function Field({label, hint, error, children}: {label: string; hint?: string; error?: string; children: ReactElement}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold">
        {label}
        {hint ? <span className="ml-1.5 font-normal text-muted">{hint}</span> : null}
      </span>
      <span className="field contents">{children}</span>
      {error ? (
        <span role="alert" className="text-sm font-semibold text-tomato">
          {error}
        </span>
      ) : null}
    </label>
  )
}
