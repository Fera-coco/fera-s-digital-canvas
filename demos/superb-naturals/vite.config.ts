import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/demos/superb-naturals/",
  plugins: [react()],
  build: { assetsInlineLimit: 0 },
});
