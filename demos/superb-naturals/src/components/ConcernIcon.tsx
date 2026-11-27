import type { Concern } from "../data/products";
import { Bottle, Drop, Feather, Sprout, Strand } from "./icons";

const MAP = { growth: Sprout, edges: Feather, dandruff: Drop, breakage: Strand, softness: Bottle };

export default function ConcernIcon({ id, size = 22 }: { id: Concern; size?: number }) {
  const I = MAP[id];
  return <I size={size} />;
}
