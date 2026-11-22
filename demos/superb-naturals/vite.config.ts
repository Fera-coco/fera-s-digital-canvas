import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const classic = process.env.VITE_THEME === "classic";

export default defineConfig({
  base: classic ? "/demos/superb-naturals-classic/" : "/demos/superb-naturals/",
  plugins: [react()],
  build: { assetsInlineLimit: 0, outDir: classic ? "dist-classic" : "dist" },
});
