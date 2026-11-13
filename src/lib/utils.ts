import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* On phones, a row of cards becomes one swipeable strip, each card peeking past the edge. */
export const SWIPE =
  "max-sm:-mx-5 max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:gap-3 max-sm:overflow-x-auto max-sm:scroll-px-5 max-sm:px-5 max-sm:pb-2 no-bar [&>*]:max-sm:shrink-0 [&>*]:max-sm:basis-[85%] [&>*]:max-sm:snap-start";
