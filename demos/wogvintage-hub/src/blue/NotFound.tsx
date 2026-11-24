import {Link} from 'react-router-dom'
import {shop} from '../lib/shop'
import {Seo} from '../components/Seo'

export function BlueNotFound({piece}: {piece?: boolean}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Seo title={`Not found | ${shop.shopName}`} description="This page could not be found." />
      <p className="font-wide text-[clamp(5rem,22vw,10rem)] leading-none text-sun [-webkit-text-stroke:2px_var(--color-ink)]">404</p>
      <h1 className="mt-3 font-wide text-3xl text-cobalt">{piece ? 'This piece is off the rail' : 'Nothing hanging here'}</h1>
      <p className="mt-2 max-w-[46ch] text-muted">{piece ? 'It may have sold or been taken down. ' : ''}Everything for sale is on the rail.</p>
      <Link to="/#rail" className="mt-6 inline-flex rounded-full border-2 border-ink bg-sun px-5 py-3 font-bold shadow-[3px_3px_0_var(--color-ink)]">
        Back to the rail
      </Link>
    </section>
  )
}
