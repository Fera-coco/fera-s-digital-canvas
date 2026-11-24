import {defineConfig, type Plugin} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Two looks of the same demo:
//   default             crimson and gold  -> /demos/wogvintage-hub/
//   VITE_THEME=blue     cobalt and sunflower -> /demos/wogvintage-hub-blue/
const blue = process.env.VITE_THEME === 'blue'
const base = blue ? '/demos/wogvintage-hub-blue/' : '/demos/wogvintage-hub/'

const themedHtml = (): Plugin => ({
  name: 'themed-html',
  transformIndexHtml: (html) =>
    blue
      ? html
          .replaceAll('/demos/wogvintage-hub/favicon.svg', `${base}brand-blue/favicon.svg`)
          .replaceAll('/demos/wogvintage-hub/og.png', `${base}brand-blue/og.png`)
          .replace('content="#C1121F"', 'content="#1D3BD1"')
          .replace('WOGVINTAGE HUB | Old soul. New wear.', 'WOGVINTAGE HUB | Loud prints for everyone.')
      : html,
})

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), themedHtml()],
  build: {assetsInlineLimit: 0, target: 'es2020', outDir: blue ? 'dist-blue' : 'dist'},
})
