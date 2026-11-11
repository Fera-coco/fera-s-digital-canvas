import { createRoot } from "react-dom/client";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/dm-sans";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";
import App from "./App.tsx";
import "./index.css";
import { applyLang, initialLang } from "./lib/i18n";

// Motion is opt-in: reveal styles only apply when the visitor hasn't asked
// for reduced motion and the browser can tell us when things scroll into view.
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!prefersReduced && "IntersectionObserver" in window) {
  document.documentElement.classList.add("motion-ok");
}

// Load French first when it's the visitor's language, so the first paint is already translated.
const mount = () => createRoot(document.getElementById("root")!).render(<App />);
applyLang(initialLang()).then(mount, mount);
