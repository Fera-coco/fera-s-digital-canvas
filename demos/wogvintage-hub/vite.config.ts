import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Served from the studio site at /demos/wogvintage-hub/
export default defineConfig({
  base: '/demos/wogvintage-hub/',
  plugins: [react(), tailwindcss()],
  build: {assetsInlineLimit: 0, target: 'es2020'},
})
