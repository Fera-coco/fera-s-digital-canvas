import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/concepts/brightdoor/",
  plugins: [react()],
  build: { assetsInlineLimit: 0 },
});
