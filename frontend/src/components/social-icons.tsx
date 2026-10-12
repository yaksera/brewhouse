import type { SVGProps } from "react";

/** Stroke-style brand marks matching lucide's 24px grid (lucide no longer ships brand icons). */
const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M15.5 7.5h-1.8a2.2 2.2 0 0 0-2.2 2.2V21M9 13h5.5" />
    </svg>
  );
}

export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M13 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M13 3c.4 2.6 2.3 4.5 5 4.8" />
    </svg>
  );
}
