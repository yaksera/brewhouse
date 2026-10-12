"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { useReveal } from "@/lib/use-reveal";

const PHOTOS = [
  {
    src: "/images/gallery/cozy-interior.png",
    w: 316,
    h: 480,
    title: "Our Cozy Interior",
    caption: "Where good coffee meets good company.",
    alt: "Warm café interior with paper lanterns, framed prints and wooden tables",
    area: "lg:row-span-2",
  },
  {
    src: "/images/gallery/latte-art.png",
    w: 279,
    h: 185,
    title: "Caramel Latte",
    caption: "A cup filled with love and local taste.",
    alt: "Latte with rosetta art on a wooden table",
    area: "",
  },
  {
    src: "/images/gallery/toast-latte.png",
    w: 279,
    h: 185,
    title: "Butter Toast & Latte",
    caption: "Slow mornings, done right.",
    alt: "Thick buttered toast and a latte on a wooden tray",
    area: "",
  },
  {
    src: "/images/gallery/cozy-corner.png",
    w: 316,
    h: 480,
    title: "Cozy Corner",
    caption: "Warm and cozy space.",
    alt: "Café corner built around a tree with prayer flags and hanging lamps",
    area: "lg:col-start-4 lg:row-span-2 lg:row-start-1",
  },
  {
    src: "/images/gallery/latte-cake.png",
    w: 427,
    h: 480,
    title: "Latte & Chocolate Cake",
    caption: "An evening treat by candlelight.",
    alt: "Latte and a slice of layered chocolate cake by candlelight",
    area: "lg:row-span-1",
  },
  {
    src: "/images/gallery/italian-pasta.png",
    w: 279,
    h: 278,
    title: "Italian Pasta",
    caption: "Hearty midday fare, made fresh.",
    alt: "Bowl of penne in tomato sauce with salad and black coffee",
    area: "",
  },
];

export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-tile]",
          { clipPath: "inset(0% 0% 100% 0% round 12px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 12px)",
            duration: 1.1,
            ease: "power4.out",
            stagger: { each: 0.1, from: "start" },
            scrollTrigger: { trigger: "[data-tiles]", start: "top 80%", once: true },
          },
        );
        gsap.to("[data-gallery-beans]", { rotate: 20, y: 25, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const show = useCallback((i: number) => setIndex((i + PHOTOS.length) % PHOTOS.length), []);

  // Open / close the lightbox.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (index !== null && !el.open) {
      el.showModal();
      gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
    }
    if (index !== null) {
      gsap.fromTo("[data-lightbox-img]", { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power3.out" });
    }
  }, [index]);

  const close = () => {
    const el = dialog.current;
    if (!el) return;
    gsap.to(el, { autoAlpha: 0, duration: 0.25, onComplete: () => (el.close(), setIndex(null)) });
  };

  const photo = index !== null ? PHOTOS[index] : null;

  return (
    <section id="gallery" ref={root} className="relative py-20 lg:py-24">
      <Image
        data-gallery-beans
        src="/images/decor/beans-scatter.png"
        alt=""
        width={363}
        height={236}
        className="pointer-events-none absolute -top-6 right-4 hidden w-60 opacity-70 md:block"
      />
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <p data-reveal className="font-serif text-xl uppercase tracking-wide text-roast">Gallery</p>
        <h2 data-reveal className="mt-4 font-serif text-5xl leading-[1.1] text-roast sm:text-6xl lg:text-[64px]">
          Come In, Stay Awhile
        </h2>
        <p data-reveal className="mt-6 max-w-5xl text-lg sm:text-xl">
          Step inside Brew House Kathmandu and experience the warmth, comfort, and good vibes that make every visit special.
          From our handcrafted coffee to cozy corners, every space has a story to tell.
        </p>

        <ul
          data-tiles
          className="mt-12 grid auto-rows-[220px] grid-cols-2 gap-3 sm:gap-4 lg:auto-rows-[280px] lg:grid-cols-[1.13fr_1fr_1fr_1.13fr]"
        >
          {PHOTOS.map((p, i) => (
            <li key={p.src} data-tile className={`${p.area} ${i === 0 || i === 3 ? "row-span-2" : ""}`}>
              <button
                type="button"
                onClick={() => show(i)}
                aria-label={`View photo: ${p.title}`}
                className="group relative block size-full overflow-hidden rounded-xl text-left"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute inset-x-0 bottom-0 p-4 transition-transform duration-500 group-hover:-translate-y-1 sm:p-6">
                  <span className="block font-serif text-lg text-cream sm:text-2xl">{p.title}</span>
                  <span className="mt-1 block text-xs text-matcha sm:text-sm">{p.caption}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialog}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onKeyDown={(e) => {
          if (index === null) return;
          if (e.key === "ArrowRight") show(index + 1);
          if (e.key === "ArrowLeft") show(index - 1);
        }}
        onClick={(e) => e.target === dialog.current && close()}
        aria-label="Photo viewer"
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/85"
      >
        {photo && index !== null && (
          <figure className="relative flex max-h-[90vh] w-[min(92vw,1000px)] flex-col items-center">
            <div data-lightbox-img className="relative h-[75vh] w-full">
              <Image src={photo.src} alt={photo.alt} fill sizes="92vw" className="object-contain" />
            </div>
            <figcaption className="mt-4 text-center text-cream">
              <span className="font-serif text-2xl">{photo.title}</span>
              <span className="ml-3 text-matcha">{photo.caption}</span>
            </figcaption>
            <button type="button" onClick={close} aria-label="Close" className="absolute -top-2 right-0 rounded-full bg-black/50 p-2 text-white hover:bg-black/70">
              <X className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => show(index - 1)}
              aria-label="Previous photo"
              className="absolute left-0 top-[37vh] -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            >
              <ChevronLeft className="size-7" />
            </button>
            <button
              type="button"
              onClick={() => show(index + 1)}
              aria-label="Next photo"
              className="absolute right-0 top-[37vh] -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            >
              <ChevronRight className="size-7" />
            </button>
          </figure>
        )}
      </dialog>
    </section>
  );
}
