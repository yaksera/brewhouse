"use client";

import { useEffect, useRef } from "react";
import { ShoppingBag } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { formatPrice } from "@/lib/site";
import { useReservation } from "./reservation-context";

/** Floating summary of items added from the menu; opens the reservation dialog to pre-order them. */
export function TrayButton() {
  const { trayCount, trayTotal, open, isOpen } = useReservation();
  const ref = useRef<HTMLButtonElement>(null);
  const prev = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prev.current === 0 && trayCount > 0) {
      gsap.fromTo(el, { y: 120, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: "back.out(1.8)" });
    } else if (trayCount > prev.current) {
      gsap.fromTo(el, { scale: 1.12 }, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.4)" });
    }
    prev.current = trayCount;
  }, [trayCount]);

  if (trayCount === 0 || isOpen) return null;

  return (
    <button
      ref={ref}
      type="button"
      onClick={open}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-espresso py-3 pl-4 pr-5 text-cream shadow-xl shadow-espresso/40 transition-ui hover:bg-roast sm:bottom-8 sm:right-8"
    >
      <span className="relative">
        <ShoppingBag className="size-6" strokeWidth={1.5} />
        <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-matcha text-xs font-semibold text-sage-dark">
          {trayCount}
        </span>
      </span>
      <span className="text-left leading-tight">
        <span className="block text-xs text-cream/70">Your tray · {formatPrice(trayTotal)}</span>
        <span className="block font-medium">Reserve &amp; pre-order</span>
      </span>
    </button>
  );
}
