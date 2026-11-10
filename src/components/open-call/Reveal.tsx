import { createElement, type CSSProperties, type ReactNode } from "react";
import { useSeen } from "@/hooks/use-seen";
import { cn } from "@/lib/utils";

export type RevealKind = "rise" | "drop" | "stamp" | "left" | "right" | "flip" | "pop" | "swing";

/*
  Plays a small, whimsical entrance once the element is on screen.
  Self-contained, so it also works for content that arrives after the page loads.
*/
const Reveal = ({
  as = "div",
  kind = "rise",
  delay = 0,
  className,
  style,
  children,
  ...rest
}: {
  as?: string;
  kind?: RevealKind;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [key: string]: unknown;
}) => {
  const [ref, seen] = useSeen<HTMLElement>(0.15);
  return createElement(
    as,
    {
      ref,
      className: cn("oc-reveal", `oc-${kind}`, seen && "is-seen", className),
      style: { ...style, "--oc-delay": `${delay}ms` } as CSSProperties,
      ...rest,
    },
    children,
  );
};

export default Reveal;
