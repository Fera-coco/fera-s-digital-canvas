import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getExhibit } from "@/content/exhibits";
import { toneStyles } from "@/content/exhibits";
import { roomFor, WALK } from "@/content/site";
import { OPEN_CALL_PATH } from "@/content/openCall";

/*
  Walking between rooms.
  Each time the visitor changes page, a coloured curtain carrying the next
  room's name lifts away to reveal it. Skipped entirely for reduced motion.
*/
const RoomTransition = () => {
  const { pathname } = useLocation();
  const first = useRef(true);
  const [run, setRun] = useState<{ key: number; no: string; label: string; color: string } | null>(null);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!document.documentElement.classList.contains("motion-ok")) return;

    let no = "";
    let label = "";
    let color = "#282624";
    const ex = pathname.startsWith("/work/") ? getExhibit(pathname.split("/")[2]) : undefined;
    if (pathname === `${OPEN_CALL_PATH}/admin`) {
      no = "Staff only";
      label = "The back office";
      color = "#EFEADD";
    } else if (pathname === OPEN_CALL_PATH) {
      no = "Special exhibition";
      label = "The Open Call";
      color = "#F2C3D2";
    } else if (pathname === WALK.path) {
      no = "Now entering";
      label = WALK.label;
      color = WALK.tone;
    } else if (ex) {
      no = `Exhibit ${ex.no}`;
      label = ex.title;
      color = toneStyles[ex.tone].hex;
    } else {
      const room = roomFor(pathname);
      no = room ? `Room ${room.no}` : "";
      label = room ? room.label : "Not found";
      color = room?.tone ?? "#EFEADD";
    }
    setRun({ key: Date.now(), no, label, color });
    const t = window.setTimeout(() => setRun(null), 1150);
    return () => window.clearTimeout(t);
  }, [pathname]);

  if (!run) return null;
  const dark = run.color === "#282624";

  return (
    <div key={run.key} aria-hidden className="room-curtain pointer-events-none fixed inset-0 z-[80] flex items-end" style={{ background: run.color }}>
      <div className={`gallery-x room-curtain-label pb-[8vh] ${dark ? "text-cream" : "text-ink"}`}>
        <p className="label opacity-70">{run.no}</p>
        <p className="display mt-3 text-[clamp(3rem,10vw,8.5rem)]">{run.label}</p>
      </div>
    </div>
  );
};

export default RoomTransition;
