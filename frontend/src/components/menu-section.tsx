"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { Flip } from "gsap/Flip";
import { CakeSlice, Check, Coffee, EggFried, Plus, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { useReveal } from "@/lib/use-reveal";
import { formatPrice } from "@/lib/site";
import type { Badge, Menu, MenuItem } from "@/lib/types";
import { useReservation } from "./reservation-context";

gsap.registerPlugin(Flip);

const POPULAR = "popular";

const CATEGORY_ICON: Record<string, LucideIcon> = {
  beverage: Coffee,
  breakfast: EggFried,
  "main-course": UtensilsCrossed,
  desserts: CakeSlice,
};

const BADGE: Record<Exclude<Badge, "">, { label: string; className: string }> = {
  bestseller: { label: "Bestseller", className: "bg-matcha text-sage-dark" },
  chef_choice: { label: "Chef Choice", className: "bg-espresso text-cream" },
  new: { label: "New", className: "bg-sage text-cream" },
};

function matches(item: MenuItem, filter: string) {
  return filter === POPULAR ? item.is_popular : item.category === filter;
}

export function MenuSection({ menu }: { menu: Menu }) {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const [filter, setFilter] = useState(POPULAR);
  useReveal(root);

  const tabs = [{ slug: POPULAR, name: "Most Popular" }, ...menu.categories];

  const choose = (slug: string) => {
    if (slug === filter) return;
    if (grid.current) flipState.current = Flip.getState(grid.current.querySelectorAll("[data-card]"));
    setFilter(slug);
  };

  // Animate cards from their old layout to the new one after React re-renders.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state) return;
    flipState.current = null;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    Flip.from(state, {
      duration: 0.6,
      ease: "power3.inOut",
      absolute: true,
      stagger: 0.03,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.9, y: 20 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.5, delay: 0.15 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.9, duration: 0.3 }),
    });
  }, [filter]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.to("[data-steam-cup]", {
          y: -14,
          rotate: -3,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.from("[data-card]:not(.hidden)", {
          autoAlpha: 0,
          y: 50,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: grid.current, start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="menu" ref={root} className="relative py-20 lg:py-24">
      <Image
        data-steam-cup
        src="/images/decor/cup-light.png"
        alt=""
        width={358}
        height={353}
        className="pointer-events-none absolute left-[8%] top-10 hidden w-64 opacity-60 md:block"
      />

      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6">
        <header className="mx-auto max-w-3xl text-center">
          <p data-reveal className="font-serif text-xl uppercase tracking-wide text-roast">Menu</p>
          <h2 data-reveal className="mt-4 font-serif text-5xl leading-[1.1] text-espresso sm:text-6xl lg:text-[64px]">
            Something Delicious, Always Brewing
          </h2>
          <p data-reveal className="mt-5 text-lg sm:text-xl">
            From crisp morning bakes to nuanced single-terroir brews and hearty midday fare.
          </p>
        </header>

        <div data-reveal className="mt-12 flex flex-wrap justify-center gap-3 sm:gap-5" role="group" aria-label="Filter menu">
          {tabs.map((t) => (
            <button
              key={t.slug}
              type="button"
              aria-pressed={filter === t.slug}
              onClick={() => choose(t.slug)}
              className={`min-w-[120px] rounded-full px-6 py-3 text-base transition-all duration-300 sm:min-w-[150px] sm:text-lg ${
                filter === t.slug ? "bg-sage text-white shadow-md shadow-sage/30" : "bg-taupe text-white hover:bg-[#9c9077]"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <ul ref={grid} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-10">
          {menu.items.map((item) => (
            <MenuCard key={item.id} item={item} hidden={!matches(item, filter)} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function MenuCard({ item, hidden }: { item: MenuItem; hidden: boolean }) {
  const { add, tray } = useReservation();
  const btn = useRef<HTMLButtonElement>(null);
  const qty = tray.find((l) => l.item.id === item.id)?.quantity ?? 0;
  const Icon = CATEGORY_ICON[item.category] ?? Coffee;
  const badge = item.badge ? BADGE[item.badge] : null;

  const onAdd = () => {
    add(item);
    if (btn.current) gsap.fromTo(btn.current, { scale: 0.75, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(3)" });
  };

  return (
    <li
      data-card
      data-flip-id={item.id}
      className={`${hidden ? "hidden" : "flex"} flex-col rounded-xl bg-white p-6 shadow-[0_4px_10px_rgba(62,42,34,0.18)] transition-shadow duration-300 hover:shadow-[0_14px_30px_-6px_rgba(62,42,34,0.3)] sm:p-8`}
    >
      <div className="flex items-center justify-between gap-3">
        {badge ? (
          <span className={`rounded-full px-2.5 py-1 text-sm font-medium uppercase ${badge.className}`}>{badge.label}</span>
        ) : (
          <span />
        )}
        <span className="text-2xl text-sage">{formatPrice(item.price)}</span>
      </div>
      <h3 className="mt-3 font-serif text-2xl text-espresso">{item.name}</h3>
      <p className="mt-2 flex-1 leading-snug text-body">{item.description}</p>
      <div className="mt-4 flex items-center justify-between border-t border-taupe pt-3">
        <span className="flex items-center gap-2 text-sm text-body">
          <Icon className="size-5 text-sage" strokeWidth={1.5} />
          {item.note}
        </span>
        <button
          ref={btn}
          type="button"
          onClick={onAdd}
          aria-label={`Add ${item.name} to your tray`}
          className={`relative grid size-11 place-items-center rounded-full transition-colors ${
            qty ? "bg-sage text-white" : "bg-oat text-roast hover:bg-matcha"
          }`}
        >
          {qty ? <Check className="size-5" /> : <Plus className="size-6" strokeWidth={1.75} />}
          {qty > 0 && (
            <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-espresso text-[11px] text-white">
              {qty}
            </span>
          )}
        </button>
      </div>
    </li>
  );
}
