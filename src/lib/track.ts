/*
  A tiny, cookie-free page counter for the back room's "Website visits" tab.
  Stores two random ids (no personal data): one per browser, one per visit.
  Your own browser is skipped once you've signed in to the back room.
*/
const rid = () => Array.from(crypto.getRandomValues(new Uint8Array(10)), (b) => (b % 36).toString(36)).join("");

const store = (s: Storage | undefined, k: string) => {
  try {
    if (!s) return { id: rid(), fresh: true };
    const v = s.getItem(k);
    if (v) return { id: v, fresh: false };
    const id = rid();
    s.setItem(k, id);
    return { id, fresh: true };
  } catch {
    return { id: rid(), fresh: true };
  }
};

export const markOwner = () => {
  try {
    localStorage.setItem("fs-skip-visits", "1");
  } catch {
    /* ignore */
  }
};

const skip = () => {
  try {
    if (localStorage.getItem("fs-skip-visits")) return true;
  } catch {
    /* ignore */
  }
  const host = location.hostname;
  return import.meta.env.DEV || navigator.webdriver || host === "localhost" || host === "127.0.0.1";
};

let last = "";
export const trackVisit = (path: string) => {
  if (path === last || path.startsWith("/open-call/admin") || skip()) return;
  last = path;
  const visitor = store(window.localStorage, "fs-visitor");
  const session = store(window.sessionStorage, "fs-session");
  let referrer: string | null = null;
  if (session.fresh && document.referrer) {
    try {
      const h = new URL(document.referrer).hostname.replace(/^www\.|^m\.|^l\./, "");
      if (h && h !== location.hostname) referrer = h;
    } catch {
      /* ignore */
    }
  }
  const w = Math.min(screen.width, screen.height);
  const device = w < 600 ? "Mobile" : w < 1000 && matchMedia("(pointer: coarse)").matches ? "Tablet" : "Desktop";
  const body = JSON.stringify({ path, referrer, device, visitor: visitor.id, session: session.id, entry: session.fresh, isNew: visitor.fresh });
  fetch("/api/visit", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } }).catch(() => undefined);
};
