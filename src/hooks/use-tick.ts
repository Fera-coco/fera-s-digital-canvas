import { useEffect } from "react";
import { markStop } from "@/content/journeys";
import { loadVisitor } from "@/content/visitors";

/** Visiting a room ticks its stops off the visitor's route slip. */
export function useTickStops(ids: string[]) {
  const key = ids.join(",");
  useEffect(() => {
    const role = loadVisitor() ?? "dreamer";
    // small delay so the "ticked off" note appears after the room has opened
    const tm = window.setTimeout(() => key.split(",").filter(Boolean).forEach((id) => markStop(role, id)), 900);
    return () => window.clearTimeout(tm);
  }, [key]);
}
