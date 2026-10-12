"use client";

import Image from "next/image";
import { CalendarCheck, Mail, MapPin, Phone, Timer } from "lucide-react";
import { SITE } from "@/lib/site";
import { Logo } from "./logo";
import { useReservation } from "./reservation-context";
import { InstagramIcon } from "./social-icons";

const QUICK_LINKS = [
  { href: "#story", label: "Our Story" },
  { href: "#menu", label: "Menu" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact Us" },
];

export function Footer() {
  const { open } = useReservation();

  return (
    <footer className="relative overflow-hidden bg-espresso text-cream">
      <Image
        src="/images/decor/leaf.png"
        alt=""
        width={417}
        height={355}
        className="pointer-events-none absolute -left-10 bottom-10 w-40 rotate-[-70deg] opacity-25 invert"
      />
      <Image
        src="/images/decor/cup.png"
        alt=""
        width={200}
        height={197}
        className="pointer-events-none absolute bottom-6 right-[22%] hidden w-44 opacity-25 lg:block"
      />

      <div className="relative mx-auto grid max-w-[1240px] gap-12 px-4 pb-10 pt-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_1.2fr_1.2fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-6 max-w-sm text-[15px] leading-snug text-cream/90">
            Artisanal Himalayan coffee, single-origin hand brews, and mindful gatherings in the cultural heart of the valley.
          </p>
          <ul className="mt-6 flex gap-4">
            {[
              { Icon: InstagramIcon, label: "Instagram", href: SITE.social.instagram },
              { Icon: Mail, label: "Email", href: `mailto:${SITE.footerEmail}` },
              { Icon: Phone, label: "Call", href: `tel:${SITE.footerPhone.replace(/\s/g, "")}` },
            ].map(({ Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  className="grid size-11 place-items-center rounded-lg bg-mint text-espresso transition hover:-translate-y-1 hover:bg-matcha"
                >
                  <Icon className="size-6" strokeWidth={1.5} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Quick links">
          <h2 className="font-serif text-2xl text-matcha">Quick Links</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-lg text-cream/90 transition hover:text-matcha">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-serif text-2xl text-matcha">Contact &amp; Reserve</h2>
          <ul className="mt-5 flex flex-col gap-4 text-lg">
            <li>
              <a href={`tel:${SITE.footerPhone.replace(/\s/g, "")}`} className="flex items-center gap-4 hover:text-matcha">
                <Phone className="size-5" strokeWidth={1.5} />
                {SITE.footerPhone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.footerEmail}`} className="flex items-center gap-4 break-all hover:text-matcha">
                <Mail className="size-5 shrink-0" strokeWidth={1.5} />
                {SITE.footerEmail}
              </a>
            </li>
          </ul>
          <button
            type="button"
            onClick={open}
            className="mt-6 inline-flex items-center gap-3 rounded-lg bg-sage px-6 py-3.5 text-lg transition hover:-translate-y-0.5 hover:bg-[#5a6c50]"
          >
            <CalendarCheck className="size-6" strokeWidth={1.5} />
            Reserve a Table
          </button>
        </div>

        <div>
          <h2 className="flex items-center gap-3 font-serif text-2xl text-matcha">
            <MapPin className="size-6" strokeWidth={1.5} />
            Location
          </h2>
          <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" className="mt-5 block pl-9 text-lg hover:text-matcha">
            {SITE.address}
          </a>
          <hr className="my-6 border-cream/40" />
          <h2 className="flex items-center gap-3 font-serif text-2xl text-matcha">
            <Timer className="size-6" strokeWidth={1.5} />
            Opening Hours
          </h2>
          <dl className="mt-4 flex flex-col gap-3 pl-9 text-lg">
            <dt>Monday – Sunday</dt>
            <dd className="font-semibold text-mint">7:30 AM – 9:30 PM</dd>
            <dd>Kitchen &amp; bar open till 9:00 PM</dd>
          </dl>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1240px] px-4 sm:px-6">
        <p className="border-t border-cream/40 py-6 text-center text-cream/75">© 2026 Brew House Kathmandu. All rights reserved.</p>
      </div>
    </footer>
  );
}
