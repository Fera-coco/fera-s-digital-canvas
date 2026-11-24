import {Link} from 'react-router-dom'
import {shop} from '../lib/shop'
import {Seo} from '../components/Seo'

export function NotFound({piece}: {piece?: boolean}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Seo title={`Not found | ${shop.shopName}`} description="This page could not be found." />
      <p className="font-display text-[clamp(5rem,22vw,10rem)] leading-none text-gold">404</p>
      <h1 className="mt-2 font-display text-3xl text-crimson">{piece ? 'This piece is no longer listed' : 'This page is not on the rail'}</h1>
      <p className="mt-2 max-w-[46ch] text-muted">{piece ? 'It may have sold or been taken down. ' : ''}Everything for sale is on the main rail.</p>
      <Link to="/#rail" className="mt-6 inline-flex rounded-full bg-crimson px-5 py-3 font-semibold text-cream hover:bg-oxblood">
        See the rail
      </Link>
    </section>
  )
}
