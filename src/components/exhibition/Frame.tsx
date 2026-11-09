import type { CSSProperties } from "react";
import type { Shot, Tone } from "@/content/exhibits";
import { toneStyles } from "@/content/exhibits";
import { cn } from "@/lib/utils";

interface FrameProps {
  shot: Shot;
  tone?: Tone;
  matted?: boolean;
  caption?: boolean;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  style?: CSSProperties;
  sizes?: string;
}

/** A screenshot hung like a print: paper (or coloured) mat, hairline, wall shadow. */
const Frame = ({ shot, tone, matted, caption, className, imgClassName, priority, style, sizes }: FrameProps) => {
  const mat = matted && tone ? toneStyles[tone].bg : "";
  return (
    <figure className={cn("m-0", className)} style={style}>
      <div className={cn("frame", mat, matted && "p-3 sm:p-5")}>
        <img
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          sizes={sizes}
          className={cn("bg-wall", imgClassName)}
        />
      </div>
      {caption && <figcaption className="mt-3 max-w-prose text-sm leading-relaxed text-stone">{shot.caption}</figcaption>}
    </figure>
  );
};

export default Frame;
