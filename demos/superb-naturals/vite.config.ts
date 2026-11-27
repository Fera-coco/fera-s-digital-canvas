import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import seo from "./seo-plugin";

const classic = process.env.VITE_THEME === "classic";
const site = process.env.VITE_SITE_URL; // set for the live site, e.g. https://superbnaturals.com.ng
const base = process.env.VITE_BASE || (site ? "/" : classic ? "/demos/superb-naturals-classic/" : "/demos/superb-naturals/");

export default defineConfig({
  base,
  plugins: [react(), seo({ site, base })],
  build: { assetsInlineLimit: 0, outDir: process.env.VITE_OUT || (classic ? "dist-classic" : "dist") },
});
