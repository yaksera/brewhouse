"use client";

import { useEffect, useRef, useState } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { NAV_LINKS } from "@/lib/site";
import { Logo } from "./logo";
import { useReservation } from "./reservation-context";

export function Navbar() {
  const header = useRef<HTMLElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<string>("home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { open: openReservation } = useReservation();

  useGSAP(() => {
    const triggers = NAV_LINKS.map(({ id }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: (self) => self.isActive && setActive(id),
      }),
    );
    triggers.push(ScrollTrigger.create({ start: 40, end: "max", onToggle: (self) => setScrolled(self.isActive) }));

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.from("[data-nav-item]", { y: -20, autoAlpha: 0, duration: 0.7, stagger: 0.06, ease: "power3.out", delay: 0.1 });
    });
    return () => {
      triggers.forEach((t) => t.kill());
      mm.revert();
    };
  });

  // Underline slides to the active link.
  useEffect(() => {
    const link = header.current?.querySelector<HTMLAnchorElement>(`[data-nav="${active}"]`);
    if (!link || !indicator.current) return;
    gsap.to(indicator.current, { x: link.offsetLeft, width: link.offsetWidth, duration: 0.45, ease: "power3.out" });
  }, [active]);

  return (
    <header
      ref={header}
      className={`sticky top-0 z-50 border-b bg-cream/95 backdrop-blur transition-shadow duration-300 ${
        scrolled ? "border-roast/10 shadow-[0_6px_24px_-12px_rgba(62,42,34,0.35)]" : "border-roast/25"
      }`}
    >
      <nav className="mx-auto flex h-[84px] max-w-[1240px] items-center justify-between gap-6 px-4 sm:h-24 sm:px-6">
        <a href="#home" data-nav-item aria-label="Brew House Kathmandu home">
          <Logo />
        </a>

        <ul className="relative hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map(({ id, label }) => (
            <li key={id} data-nav-item>
              <a
                href={`#${id}`}
                data-nav={id}
                className={`block py-2 text-lg transition-colors ${
                  active === id ? "font-semibold text-black" : "text-roast hover:text-sage"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
          <span ref={indicator} aria-hidden className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-sage" />
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-nav-item
            onClick={openReservation}
            className="hidden rounded-lg bg-sage px-6 py-3.5 text-cream transition-ui hover:-translate-y-0.5 hover:bg-sage-dark sm:block"
          >
            Reserve a Table
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-lg p-2 text-roast lg:hidden"
          >
            {open ? <X className="size-7" /> : <MenuIcon className="size-7" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-nav" className="border-t border-roast/10 bg-cream px-4 pb-6 lg:hidden">
          <ul className="flex flex-col py-2">
            {NAV_LINKS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className={`block py-3 text-lg ${active === id ? "font-semibold text-black" : "text-roast"}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openReservation();
            }}
            className="w-full rounded-lg bg-sage py-3.5 text-cream"
          >
            Reserve a Table
          </button>
        </div>
      )}
    </header>
  );
}
