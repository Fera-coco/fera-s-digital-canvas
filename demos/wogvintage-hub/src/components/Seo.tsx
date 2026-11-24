import {BASE} from '../lib/shop'

type Props = {title: string; description: string; path?: string; image?: string; type?: 'website' | 'product'; jsonLd?: object}

// React 19 places these in <head>. Every page stays noindex while this is a demo.
export function Seo({title, description, path = '', image, type = 'website', jsonLd}: Props) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ferasportfolio.vercel.app'
  const url = `${origin}${BASE}${path.replace(/^\//, '')}`
  const og = image ? (image.startsWith('http') ? image : origin + image) : `${origin}${BASE}${import.meta.env.VITE_THEME === 'blue' ? 'brand-blue/og.png' : 'og.png'}`
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={og} />
      {jsonLd ? <script type="application/ld+json">{JSON.stringify(jsonLd)}</script> : null}
    </>
  )
}
