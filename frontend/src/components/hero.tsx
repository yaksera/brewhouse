"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowRight, Coffee, Croissant, Leaf, type LucideIcon } from "lucide-react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { useReservation } from "./reservation-context";

const HIGHLIGHTS: { icon: LucideIcon; label: string }[] = [
  { icon: Coffee, label: "Specialty Himalayan Beans" },
  { icon: Croissant, label: "Daily Fresh Bakes" },
  { icon: Leaf, label: "Warm & Mindful Ambiance" },
];

/** Splits a phrase into word spans so GSAP can reveal them one by one. */
function Words({ text }: { text: string }) {
  return text.split(" ").map((w, i) => (
    <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
      <span data-word className="inline-block">
        {w}
        {" "}
      </span>
    </span>
  ));
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { open } = useReservation();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo("[data-hero-bg]", { scale: 1.18 }, { scale: 1.04, duration: 2.6, ease: "power2.out" });
        gsap.to("[data-hero-bg-wrap]", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });

        gsap
          .timeline({ defaults: { ease: "power4.out" }, delay: 0.25 })
          .from("[data-hero-badge]", { autoAlpha: 0, y: 16, duration: 0.7 })
          .from("[data-word]", { yPercent: 115, duration: 1, stagger: 0.07 }, "-=0.3")
          .from("[data-hero-copy]", { autoAlpha: 0, y: 20, duration: 0.8 }, "-=0.55")
          .from("[data-hero-cta]", { autoAlpha: 0, y: 20, duration: 0.7, stagger: 0.1 }, "-=0.5")
          .from("[data-hero-rule]", { scaleX: 0, duration: 1.1, ease: "power3.inOut" }, "-=0.4")
          .from("[data-hero-chip]", { autoAlpha: 0, y: 30, duration: 0.8, stagger: 0.12 }, "-=0.7");

        // The badge dot "breathes" like steam.
        gsap.to("[data-hero-dot]", { scale: 1.6, opacity: 0.4, duration: 1.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="home" ref={root} className="relative isolate overflow-hidden text-white">
      <div data-hero-bg-wrap className="absolute inset-0 -z-10">
        <Image
          data-hero-bg
          src="/images/hero.png"
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#3b2418]/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#3b2418]/30 via-transparent to-[#3b2418]/50" />
      </div>

      <div className="mx-auto flex min-h-[calc(100svh-84px)] max-w-[1240px] flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:min-h-[740px]">
        <p
          data-hero-badge
          className="inline-flex items-center gap-3 rounded-full bg-sage-dark/90 px-5 py-2 text-xs uppercase tracking-wide text-cream sm:text-sm"
        >
          <span data-hero-dot className="size-2.5 rounded-full bg-cream" />
          Welcome to Brew House Kathmandu
        </p>

        <h1 className="mt-6 font-serif text-[44px] leading-[1.08] sm:text-6xl lg:text-[76px]">
          <span className="block">
            <Words text="Good Coffee. Good Food." />
          </span>
          <span className="block italic">
            <Words text="Good Moments." />
          </span>
        </h1>

        <p data-hero-copy className="mt-8 max-w-3xl text-lg leading-relaxed text-cream/90 sm:text-xl">
          Your cozy neighborhood sanctuary for high-altitude single origin pour-overs, freshly pulled espresso, sourdough
          treats, and deliberate, unhurried time.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-8">
          <a
            data-hero-cta
            href="#menu"
            className="group inline-flex items-center gap-3 rounded-lg bg-sage px-8 py-4 text-lg text-cream transition-ui hover:-translate-y-0.5 hover:bg-[#5a6c50]"
          >
            Explore Menu
            <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <button
            data-hero-cta
            type="button"
            onClick={open}
            className="rounded-lg border border-matcha px-8 py-4 text-lg text-matcha transition-ui hover:-translate-y-0.5 hover:bg-matcha/10"
          >
            Reserve a Table
          </button>
        </div>

        <span data-hero-rule aria-hidden className="mt-14 block h-px w-full max-w-[860px] bg-cream/40" />

        <ul className="mt-12 grid w-full max-w-[860px] gap-4 sm:grid-cols-3 sm:gap-8">
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <li
              key={label}
              data-hero-chip
              className="flex items-center justify-center gap-4 rounded-xl bg-sage-dark/95 px-5 py-4 text-cream shadow-lg shadow-black/20 transition-ui duration-300 hover:-translate-y-1"
            >
              <Icon className="size-6 shrink-0" strokeWidth={1.5} />
              <span className="text-left text-base sm:text-center sm:text-lg">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
