import { useEffect, useRef, useState } from "react";

const motionOk = () => typeof document !== "undefined" && document.documentElement.classList.contains("motion-ok");

/** True once the element has scrolled into view (immediately when motion is reduced). */
export function useSeen<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(() => !motionOk());
  useEffect(() => {
    if (seen || !ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen, threshold]);
  return [ref, seen] as const;
}
