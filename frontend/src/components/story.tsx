"use client";

import Image from "next/image";
import { useRef } from "react";
import { Coffee, Flag, HandHeart, MapPin, type LucideIcon } from "lucide-react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { useReveal } from "@/lib/use-reveal";

const VALUES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Flag,
    title: "Locally Inspired",
    body: "Single-origin Himalayan beans sourced directly from Nuwakot and Kaski farmers alongside Nepali artisanal dairy.",
  },
  {
    icon: Coffee,
    title: "Freshly Made Daily",
    body: "Handcrafted sourdough pastries, slow-fermented crusts, meticulously dialled espresso roasts.",
  },
  {
    icon: HandHeart,
    title: "Crafted with Quiet Care",
    body: "Honoring slow living: thoughtful service, sunlit wooden tables, and an unhurried, warm community vibe.",
  },
];

export function Story() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Photo wipes open from the bottom, then the image settles.
        const tl = gsap.timeline({ scrollTrigger: { trigger: "[data-story-photo]", start: "top 80%", once: true } });
        tl.fromTo(
          "[data-story-photo]",
          { clipPath: "inset(100% 0% 0% 0% round 16px)" },
          { clipPath: "inset(0% 0% 0% 0% round 16px)", duration: 1.3, ease: "power4.inOut" },
        )
          .from("[data-story-photo] img", { scale: 1.3, duration: 1.6, ease: "power3.out" }, 0)
          .from("[data-story-pin]", { autoAlpha: 0, x: 30, duration: 0.7, ease: "back.out(2)" }, "-=0.5");

        // Hand-drawn swirl draws itself.
        const path = root.current?.querySelector<SVGPathElement>("[data-swirl] path");
        if (path) {
          const len = path.getTotalLength();
          gsap.fromTo(
            path,
            { strokeDasharray: len, strokeDashoffset: len },
            {
              strokeDashoffset: 0,
              duration: 2.2,
              ease: "power2.inOut",
              scrollTrigger: { trigger: "[data-swirl]", start: "top 85%", once: true },
            },
          );
        }

        gsap.to("[data-beans]", {
          y: -30,
          rotate: 12,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.to("[data-sprig]", { rotate: 6, transformOrigin: "bottom left", duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="story" ref={root} className="relative overflow-hidden py-20 lg:py-28">
      <div className="mx-auto grid max-w-[1240px] items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div className="relative lg:pt-20">
          <div data-story-photo className="relative aspect-[529/346] overflow-hidden rounded-2xl shadow-xl shadow-roast/20 lg:mr-14">
            <Image
              src="/images/story.png"
              alt="Sunlit corner table at Brew House with a cappuccino beside dried flowers"
              fill
              sizes="(min-width: 1024px) 520px, 92vw"
              className="object-cover"
            />
          </div>
          <div
            data-story-pin
            className="absolute -bottom-5 right-2 flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-lg shadow-roast/15 lg:right-0"
          >
            <span className="grid size-11 place-items-center rounded-lg bg-matcha text-sage">
              <MapPin className="size-6" strokeWidth={1.75} />
            </span>
            <span className="leading-tight">
              <span className="block text-sm text-body/70">EST. 2026</span>
              <span className="block text-roast">Patan, Lalitpur</span>
            </span>
          </div>
          <Image
            data-sprig
            src="/images/decor/leaf.png"
            alt=""
            width={417}
            height={355}
            className="pointer-events-none absolute -bottom-24 -left-24 hidden w-48 opacity-70 lg:block"
          />
          <Image
            data-beans
            src="/images/decor/beans-trio.png"
            alt=""
            width={247}
            height={244}
            className="pointer-events-none absolute -bottom-56 right-16 hidden w-48 opacity-90 lg:block"
          />
        </div>

        <div className="relative">
          <svg
            data-swirl
            aria-hidden
            viewBox="0 0 300 110"
            className="pointer-events-none absolute -top-8 right-0 hidden w-72 text-taupe sm:block"
            fill="none"
          >
            <path
              d="M4 82 C 60 60, 120 70, 170 88 C 220 104, 268 96, 280 62 C 292 26, 262 4, 248 30 C 236 52, 246 86, 270 84 M 215 70 C 200 48, 172 40, 168 60 C 166 78, 196 84, 230 74 M 232 40 C 226 20, 240 6, 252 12"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          <p data-reveal className="font-serif text-xl uppercase tracking-wide text-roast">Our Story</p>
          <h2 data-reveal className="mt-5 font-serif text-5xl leading-[1.1] text-roast sm:text-6xl lg:text-[64px]">
            A Little Place with a Lot of Heart
          </h2>
          <p data-reveal className="mt-8 text-lg leading-relaxed sm:text-xl">
            Brew House Kathmandu was created for people who appreciate good coffee, fresh food, and meaningful moments.
            From your morning pour-over beside rain-kissed windowpanes to an evening catch-up with friends, our café is
            designed to feel like your favorite peaceful corner in the valley.
          </p>

          <ul className="mt-8 flex flex-col gap-5">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                data-reveal="right"
                className="group flex items-center gap-6 rounded-xl bg-sand px-6 py-5 transition-colors duration-300 hover:bg-oat"
              >
                <Icon
                  className="size-7 shrink-0 text-roast transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110"
                  strokeWidth={1.5}
                />
                <div>
                  <h3 className="font-serif text-xl text-roast">{title}</h3>
                  <p className="mt-1 text-[15px] leading-snug text-espresso/80">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
