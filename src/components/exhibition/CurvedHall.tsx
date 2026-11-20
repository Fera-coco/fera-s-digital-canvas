import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type Exhibit, toneStyles } from "@/content/exhibits";
import { t, tf } from "@/lib/i18n";

/*
  The Collection as a curved white hall. Scrolling walks you along a ring-shaped
  corridor; the work hangs on the outer wall and turns into view as the wall curves.
  Clicking a piece walks up to it and steps into the exhibit.
  Geometry is in px around the ring's centre; every frame is projected from the
  camera's position, so the hall is plain DOM with CSS 3D transforms.
*/

const RC = 1150; // camera path radius
const RO = 1900; // outer wall (the art)
const RI = 1100; // inner wall
const FLOOR_Y = 360; // floor, below eye level
const CEIL_Y = -560;
const WALL_BOTTOM = 1500; // walls run below the view so near panels never show their bottom edge
const ART_Y = -70; // centre of each frame
const ART_W = 560;
const GAP = 1150; // px along the outer wall between pieces
const PANEL = 120; // wall panel width
const LOOK = 0.34;
const PERSP = 900; // CSS perspective: the eye sits this far in front of z = 0 // camera trails the art a little, so you look ahead to it

const mix = (a: number[], b: number[], k: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",")})`;
const WALL = [250, 249, 246];
const FAR = [226, 222, 214];

type Proj = { x: number; z: number; f: number; a: number };

const CurvedHall = ({ list }: { list: Exhibit[] }) => {
  const navigate = useNavigate();
  const wrap = useRef<HTMLDivElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const going = useRef(false);
  const veil = useRef<HTMLDivElement>(null);

  const step = GAP / RO; // angle between pieces
  const phi = useCallback((i: number) => 0.55 + i * step, [step]);
  const endTheta = phi(list.length - 1) - 0.52;
  const startTheta = phi(0) - LOOK - 0.32;

  // static pieces of the hall
  const walls = useMemo(() => {
    const out: { r: number; phi: number; w: number; kind: "outer" | "inner" | "floor" | "ceil" }[] = [];
    const from = startTheta - 0.4;
    const to = endTheta + 2.2;
    for (let p = from; p < to; p += PANEL / RO) out.push({ r: RO, phi: p, w: PANEL + 2, kind: "outer" });
    return out;
  }, [startTheta, endTheta]);

  // Camera-space position of a point on the ring, plus the Y rotation that lines an
  // element's width up with the wall's curve and turns its face towards the camera.
  const project = (theta: number, r: number, p: number, flat: boolean): Proj => {
    const cx = RC * Math.cos(theta);
    const cz = RC * Math.sin(theta);
    const fx = -Math.sin(theta);
    const fz = Math.cos(theta);
    const rx = Math.cos(theta);
    const rz = Math.sin(theta);
    const dx = r * Math.cos(p) - cx;
    const dz = r * Math.sin(p) - cz;
    const x = dx * rx + dz * rz; // to the right
    const f = dx * fx + dz * fz; // ahead
    const tx0 = -Math.sin(p);
    const tz0 = Math.cos(p);
    const tx = tx0 * rx + tz0 * rz;
    const tf = tx0 * fx + tz0 * fz;
    let a = Math.atan2(tf, tx); // local x along the wall (CSS rotateY: x -> (cos a, ahead sin a))
    if (!flat && -x * Math.sin(a) + f * Math.cos(a) < 0) a += Math.PI; // face the camera
    return { x, z: PERSP - f, f, a: (a * 180) / Math.PI };
  };

  const theta = useRef(startTheta);
  const render = useCallback(() => {
    const el = world.current;
    if (!el) return;
    const th = theta.current;
    const kids = el.children as HTMLCollectionOf<HTMLElement>;
    for (let k = 0; k < kids.length; k++) {
      const n = kids[k];
      const kind = n.dataset.kind as "outer" | "inner" | "floor" | "ceil" | "art";
      const r = Number(n.dataset.r);
      const p = Number(n.dataset.p);
      const pr = project(th, r, p, kind === "floor" || kind === "ceil");
      if (pr.f < (kind === "art" ? 260 : 340) || pr.f > 4600) {
        n.style.visibility = "hidden";
        continue;
      }
      n.style.visibility = "visible";
      const y = kind === "art" ? ART_Y : kind === "floor" ? FLOOR_Y : kind === "ceil" ? CEIL_Y : (WALL_BOTTOM + CEIL_Y) / 2;
      const flat = kind === "floor" ? " rotateX(90deg)" : kind === "ceil" ? " rotateX(-90deg)" : "";
      n.style.transform = `translate3d(${pr.x}px, ${y}px, ${pr.z}px) rotateY(${pr.a}deg)${flat}`;
      const depth = Math.min(1, Math.max(0, (pr.f - 600) / 4000));
      if (kind === "art") n.style.filter = `brightness(${1 - depth * 0.18})`;
      else n.style.background = mix(WALL, FAR, depth);
    }
  }, []);

  // scroll drives the walk
  useEffect(() => {
    let raf = 0;
    let target = startTheta;
    const read = () => {
      const w = wrap.current;
      if (!w) return;
      const r = w.getBoundingClientRect();
      const span = w.offsetHeight - window.innerHeight;
      const prog = Math.min(1, Math.max(0, -r.top / Math.max(1, span)));
      target = startTheta + prog * (endTheta - startTheta);
      const near = Math.round((target + 0.5 - phi(0)) / step);
      setActive(Math.min(list.length - 1, Math.max(0, near)));
    };
    const tick = () => {
      if (!going.current) theta.current += (target - theta.current) * 0.14;
      render();
      raf = requestAnimationFrame(tick);
    };
    read();
    theta.current = target;
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [startTheta, endTheta, phi, step, list.length, render]);

  // walk to a piece and step in
  const enter = (i: number, slug: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (going.current) return;
    going.current = true;
    const from = theta.current;
    const to = phi(i) - 0.62;
    const t0 = performance.now();
    const dur = 1000;
    const ease = (k: number) => 1 - Math.pow(1 - k, 3);
    const go = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      theta.current = from + (to - from) * ease(k);
      if (veil.current) veil.current.style.opacity = String(Math.max(0, (k - 0.55) / 0.45));
      if (k < 1) requestAnimationFrame(go);
      else navigate(`/work/${slug}`);
    };
    requestAnimationFrame(go);
  };

  const scrollTo = (i: number) => {
    const w = wrap.current;
    if (!w) return;
    const span = w.offsetHeight - window.innerHeight;
    const prog = Math.min(1, Math.max(0, (phi(i) - 0.5 - startTheta) / (endTheta - startTheta)));
    window.scrollTo({ top: w.offsetTop + prog * span, behavior: "smooth" });
  };

  const ex = list[active];
  return (
    <div ref={wrap} style={{ height: `${100 + list.length * 70}svh` }} className="relative">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[linear-gradient(#E9E5DC_0%,#EFEBE3_52%,#E2DDD2_53%,#F1EEE8_100%)]">
        <div className="pointer-events-none absolute inset-0" style={{ perspective: `${PERSP}px`, perspectiveOrigin: "50% 46%" }}>
          <div className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]" style={{ transform: `translateZ(${PERSP}px) rotateY(16deg) translateZ(${-PERSP}px)` }}>
          <div ref={world} className="absolute left-1/2 top-[46%] h-0 w-0 [transform-style:preserve-3d] max-md:scale-[.62]">
            {walls.map((w, k) => (
              <div
                key={k}
                data-kind={w.kind}
                data-r={w.r}
                data-p={w.phi}
                aria-hidden="true"
                className="pointer-events-none absolute"
                style={{
                  width: w.w,
                  height: w.kind === "floor" || w.kind === "ceil" ? RO - RI + 40 : WALL_BOTTOM - CEIL_Y,
                  marginLeft: -w.w / 2,
                  marginTop: w.kind === "floor" || w.kind === "ceil" ? -(RO - RI + 40) / 2 : -(WALL_BOTTOM - CEIL_Y) / 2,
                }}
              />
            ))}
            {list.map((e, i) => (
              <div
                key={e.slug}
                data-kind="art"
                data-i={i}
                data-r={RO - 14}
                data-p={phi(i)}
                className="pointer-events-auto absolute [backface-visibility:hidden]"
                style={{ width: ART_W, marginLeft: -ART_W / 2, marginTop: -200 }}
              >
                <Link
                  to={`/work/${e.slug}`}
                  onClick={enter(i, e.slug)}
                  onFocus={(ev) => ev.currentTarget.matches(":focus-visible") && scrollTo(i)}
                  aria-label={tf("Walk into exhibit {no}: {title}", { no: e.no, title: t(e.title) })}
                  className="group block"
                >
                  <div className="p-3 shadow-[0_30px_60px_-20px_rgba(40,38,36,.45)] transition-transform duration-300 group-hover:-translate-y-2" style={{ background: toneStyles[e.tone].hex }}>
                    <img src={e.cover.src} alt="" width={e.cover.width} height={e.cover.height} decoding="async" className="block aspect-[16/10] w-full object-cover object-top" />
                  </div>
                  <div className="mt-6 text-center">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone">
                      {t("Exhibit")} {t(e.no)} · {e.year}
                    </p>
                    <p className="mt-1 font-serif text-[30px] leading-none text-ink">{t(e.title)}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          </div>
        </div>

        {/* the floor: a soft band of shade where the wall meets the ground */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[44%] bg-[linear-gradient(transparent,rgba(214,208,197,.55)_38%,rgba(232,228,220,.9))]" />
        {/* soft light from the ceiling */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(255,255,255,.55),transparent_60%)]" />

        {/* stepping into a piece: the room fades to the page's wall colour */}
        <div ref={veil} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-cream opacity-0" />
        {/* wall label */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-6 pb-6 md:px-10 md:pb-8">
          <div aria-live="polite" className="max-w-md">
            <p className="label text-stone">
              {t("Room 01 · The Collection")} · {String(active + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
            </p>
            <p className="mt-2 font-serif text-3xl leading-none text-ink md:text-4xl">{t(ex.title)}</p>
            <p className="mt-2 hidden text-sm text-ink/75 md:block">{t(ex.medium)}</p>
          </div>
          <p className="label hidden text-right text-stone md:block">
            {t("Scroll to walk")}
            <br />
            {t("Click a piece to step in")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurvedHall;
