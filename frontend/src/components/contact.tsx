"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { SITE } from "@/lib/site";
import { postForm } from "@/lib/submit";
import { useHydrated } from "@/lib/use-hydrated";
import { useReveal } from "@/lib/use-reveal";
import type { FieldErrors } from "@/lib/types";
import { Field, inputClass } from "./field";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./social-icons";

const DETAILS: { icon: LucideIcon; label: string; value: string; href: string }[] = [
  { icon: Phone, label: "Phone", value: SITE.phones.join(" / "), href: `tel:${SITE.phones[1].replace(/\s/g, "")}` },
  { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: MapPin, label: "Location", value: SITE.address, href: SITE.mapsUrl },
];

const SOCIALS = [
  { Icon: InstagramIcon, label: "Instagram", href: SITE.social.instagram },
  { Icon: FacebookIcon, label: "Facebook", href: SITE.social.facebook },
  { Icon: TikTokIcon, label: "TikTok", href: SITE.social.tiktok },
];

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const hydrated = useHydrated();
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-contact-photo]", {
          clipPath: "inset(0% 100% 0% 0% round 16px)",
          duration: 1.3,
          ease: "power4.inOut",
          scrollTrigger: { trigger: "[data-contact-photo]", start: "top 80%", once: true },
        });
        gsap.from("[data-contact-form]", {
          x: 80,
          autoAlpha: 0,
          duration: 1,
          delay: 0.5,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-contact-photo]", start: "top 80%", once: true },
        });
        gsap.to("[data-contact-photo] img", {
          yPercent: -8,
          scale: 1.12,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.to("[data-contact-sprig]", { rotate: -8, transformOrigin: "bottom right", duration: 3.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const res = await postForm("/contact/", Object.fromEntries(new FormData(form)));
    if (res.ok) {
      form.reset();
      setErrors({});
      setStatus("done");
      gsap.fromTo("[data-sent]", { scale: 0, rotate: -45 }, { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(2.5)" });
    } else {
      setErrors(res.errors);
      setStatus("idle");
    }
  }

  return (
    <section id="contact" ref={root} className="relative overflow-hidden py-20 lg:py-28">
      <Image
        data-contact-sprig
        src="/images/decor/leaf.png"
        alt=""
        width={417}
        height={355}
        className="pointer-events-none absolute -right-16 bottom-16 hidden w-60 -scale-x-100 opacity-70 lg:block"
      />
      <div className="mx-auto grid max-w-[1240px] items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr]">
        <div className="relative">
          <Image
            src="/images/decor/beans-trio.png"
            alt=""
            width={247}
            height={244}
            className="pointer-events-none absolute right-6 top-1/2 hidden w-28 opacity-50 sm:block"
          />
          <p data-reveal className="font-serif text-xl uppercase tracking-wide text-black">Contact Us</p>
          <h2 data-reveal className="mt-5 font-serif text-5xl leading-[1.1] text-black sm:text-6xl">
            Let&rsquo;s Talk Over Coffee
          </h2>
          <p data-reveal className="mt-6 max-w-xl text-lg text-black/85">
            Have a question, a special request, or just want to say hello? We&rsquo;d love to hear from you. Reach out to us,
            we are always here for good coffee and great conversations.
          </p>

          <div className="mt-10 flex flex-col gap-10 sm:flex-row sm:items-center">
            <ul className="flex flex-col gap-6">
              {DETAILS.map(({ icon: Icon, label, value, href }) => (
                <li key={label} data-reveal="left">
                  <a href={href} target={label === "Location" ? "_blank" : undefined} rel="noreferrer" className="group flex items-center gap-5">
                    <span className="grid size-14 shrink-0 place-items-center rounded-full bg-sage text-cream transition-transform duration-300 group-hover:scale-110">
                      <Icon className="size-6" strokeWidth={1.5} />
                    </span>
                    <span className="leading-tight">
                      <span className="block font-serif text-lg text-sage">{label}</span>
                      <span className="block text-black/85 transition-colors group-hover:text-sage">{value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div data-reveal className="sm:border-l sm:border-taupe sm:py-10 sm:pl-9">
              <p className="font-serif text-lg text-roast">Follow us on</p>
              <ul className="mt-4 flex gap-5">
                {SOCIALS.map(({ Icon, label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="grid size-12 place-items-center rounded-full bg-sage text-cream transition hover:-translate-y-1 hover:bg-sage-dark"
                    >
                      <Icon className="size-6" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="relative lg:pr-0">
          <div data-contact-photo className="relative aspect-[427/480] w-full overflow-hidden rounded-2xl sm:w-[78%]">
            <Image
              src="/images/gallery/latte-cake.png"
              alt="Latte with heart art beside chocolate cake"
              fill
              sizes="(min-width: 1024px) 460px, 90vw"
              className="object-cover"
            />
          </div>

          <div
            data-contact-form
            className="relative -mt-24 rounded-2xl bg-[#f3eee5] p-6 shadow-[0_10px_30px_-8px_rgba(62,42,34,0.35)] sm:absolute sm:right-0 sm:top-[11%] sm:mt-0 sm:w-[55%] sm:p-8"
          >
            {status === "done" ? (
              <div className="py-10 text-center">
                <CheckCircle2 data-sent className="mx-auto size-14 text-sage" strokeWidth={1.5} />
                <h3 className="mt-4 font-serif text-2xl text-roast">Message sent!</h3>
                <p className="mt-2 text-body">Thanks for reaching out. We&rsquo;ll reply within a day.</p>
                <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-sage underline underline-offset-4">
                  Send another
                </button>
              </div>
            ) : (
              <form method="post" onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
                <h3 className="font-serif text-2xl text-roast">Send a Message</h3>
                <Field label="Your name" name="name" id="contact-name" hideLabel errors={errors}>
                  <input id="contact-name" name="name" required autoComplete="name" placeholder="Your Name" className={inputClass} />
                </Field>
                <Field label="Email" name="email" id="contact-email" hideLabel errors={errors}>
                  <input id="contact-email" name="email" type="email" required autoComplete="email" placeholder="Email" className={inputClass} />
                </Field>
                <Field label="Your message" name="message" id="contact-message" hideLabel errors={errors}>
                  <textarea id="contact-message" name="message" required rows={4} maxLength={2000} placeholder="Your Message" className={`${inputClass} resize-y`} />
                </Field>
                {errors.non_field_errors && <p role="alert" className="text-sm text-red-700">{errors.non_field_errors[0]}</p>}
                <button
                  type="submit"
                  disabled={!hydrated || status === "sending"}
                  className="group mt-1 flex items-center justify-center gap-3 rounded-full bg-sage py-4 text-lg text-cream transition hover:bg-sage-dark disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Send Message"}
                  <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
