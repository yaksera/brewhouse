"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarCheck, Minus, Plus, X } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { formatPrice } from "@/lib/site";
import { postForm } from "@/lib/submit";
import type { FieldErrors } from "@/lib/types";
import { Field, inputClass } from "./field";
import { useReservation } from "./reservation-context";

const MAX_DAYS_AHEAD = 60;
const LEAD_MINUTES = 30;

/** Half-hour seatings from 7:30 AM to 8:30 PM (kitchen closes at 9). */
const SLOTS = Array.from({ length: 27 }, (_, i) => {
  const mins = 7 * 60 + 30 + i * 30;
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
});

const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function label(slot: string) {
  const [h, m] = slot.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

type Booking = { date: string; time: string; party_size: number; full_name: string };

export function ReservationDialog() {
  const { isOpen, close, tray, trayTotal, setQuantity, clearTray } = useReservation();
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [booking, setBooking] = useState<Booking | null>(null);
  const [date, setDate] = useState("");

  // Computed when the dialog opens, not during render (keeps the prerendered shell time-independent).
  const [{ today, maxDate }, setBounds] = useState({ today: "", maxDate: "" });

  // Same-day bookings need a little lead time.
  const slots = useMemo(() => {
    if (!date || date !== today) return SLOTS;
    const now = new Date();
    const cutoff = now.getHours() * 60 + now.getMinutes() + LEAD_MINUTES;
    return SLOTS.filter((s) => {
      const [h, m] = s.split(":").map(Number);
      return h * 60 + m >= cutoff;
    });
  }, [date, today]);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (isOpen && !el.open) {
      const now = new Date();
      setBounds({ today: isoDate(now), maxDate: isoDate(new Date(now.getTime() + MAX_DAYS_AHEAD * 86_400_000)) });
      el.showModal();
      gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 });
      gsap.fromTo(panel.current, { y: 40, scale: 0.97 }, { y: 0, scale: 1, duration: 0.5, ease: "power3.out" });
    } else if (!isOpen && el.open) {
      gsap.to(el, {
        autoAlpha: 0,
        duration: 0.2,
        onComplete: () => {
          el.close();
          setErrors({});
          setBooking(null);
        },
      });
    }
  }, [isOpen]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const payload = {
      ...data,
      party_size: Number(data.party_size),
      pre_order: tray.map((l) => ({ item: l.item.id, quantity: l.quantity })),
    };
    const res = await postForm("/reservations/", payload);
    setStatus("idle");
    if (!res.ok) {
      setErrors(res.errors);
      gsap.fromTo(panel.current, { x: -8 }, { x: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      return;
    }
    setErrors({});
    setBooking({ date: data.date, time: data.time, party_size: Number(data.party_size), full_name: data.full_name });
    clearTray();
    requestAnimationFrame(() =>
      gsap.from("[data-booked] > *", { autoAlpha: 0, y: 16, stagger: 0.08, duration: 0.5, ease: "power2.out" }),
    );
  }

  const preOrderError = errors.pre_order?.[0];

  return (
    <dialog
      ref={dialog}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => e.target === dialog.current && close()}
      aria-labelledby="reserve-title"
      className="m-auto max-h-[92vh] w-[calc(100%-1.5rem)] max-w-2xl overflow-visible bg-transparent p-0 backdrop:bg-espresso/70 backdrop:backdrop-blur-sm"
    >
      <div ref={panel} className="relative max-h-[92vh] overflow-y-auto rounded-2xl bg-cream p-6 text-body shadow-2xl sm:p-9">
        <button type="button" onClick={close} aria-label="Close" className="absolute right-4 top-4 rounded-full p-2 hover:bg-sand">
          <X className="size-5" />
        </button>

        {booking ? (
          <div data-booked className="py-6 text-center">
            <CalendarCheck className="mx-auto size-14 text-sage" strokeWidth={1.5} />
            <h2 className="mt-4 font-serif text-3xl text-roast">See you soon, {booking.full_name.split(" ")[0]}!</h2>
            <p className="mt-3 text-lg">
              Table for {booking.party_size} on{" "}
              <strong className="text-roast">
                {new Date(`${booking.date}T00:00`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
              </strong>{" "}
              at <strong className="text-roast">{label(booking.time)}</strong>.
            </p>
            <p className="mt-2 text-body/80">We&rsquo;ll call to confirm shortly. Any pre-order will be ready when you arrive.</p>
            <button type="button" onClick={close} className="mt-8 rounded-lg bg-sage px-8 py-3 text-cream hover:bg-sage-dark">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            <h2 id="reserve-title" className="font-serif text-3xl text-roast sm:text-4xl">
              Reserve a Table
            </h2>
            <p className="mt-1 text-body/80">Open daily 7:30 AM – 9:30 PM · Makhhu Galli, Patan</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="full_name" id="r-name" errors={errors}>
                <input id="r-name" name="full_name" required autoComplete="name" className={inputClass} placeholder="Aasha Shrestha" />
              </Field>
              <Field label="Phone" name="phone" id="r-phone" errors={errors}>
                <input id="r-phone" name="phone" type="tel" required autoComplete="tel" className={inputClass} placeholder="+977 98XXXXXXXX" />
              </Field>
              <Field label="Email" name="email" id="r-email" errors={errors} className="sm:col-span-2">
                <input id="r-email" name="email" type="email" required autoComplete="email" className={inputClass} placeholder="you@example.com" />
              </Field>
              <Field label="Date" name="date" id="r-date" errors={errors}>
                <input
                  id="r-date"
                  name="date"
                  type="date"
                  required
                  min={today || undefined}
                  max={maxDate || undefined}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Time" name="time" id="r-time" errors={errors}>
                  <select id="r-time" name="time" required defaultValue="" className={inputClass}>
                    <option value="" disabled>
                      Select
                    </option>
                    {slots.map((s) => (
                      <option key={s} value={s}>
                        {label(s)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Guests" name="party_size" id="r-party" errors={errors}>
                  <select id="r-party" name="party_size" defaultValue="2" className={inputClass}>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Notes (optional)" name="notes" id="r-notes" errors={errors} className="sm:col-span-2">
                <textarea
                  id="r-notes"
                  name="notes"
                  rows={2}
                  maxLength={500}
                  className={`${inputClass} resize-y`}
                  placeholder="Window seat, birthday, high chair…"
                />
              </Field>
            </div>

            <section aria-label="Pre-order" className="mt-6 rounded-xl bg-sand p-4 sm:p-5">
              <h3 className="font-serif text-xl text-roast">Pre-order</h3>
              {tray.length === 0 ? (
                <p className="mt-1 text-sm text-body/80">
                  Tap <span className="font-semibold">+</span> on any menu item to have it ready when you arrive.
                </p>
              ) : (
                <>
                  <ul className="mt-3 flex flex-col gap-2">
                    {tray.map((l) => (
                      <li key={l.item.id} className="flex items-center justify-between gap-3">
                        <span className="text-roast">{l.item.name}</span>
                        <span className="flex items-center gap-3">
                          <span className="flex items-center gap-1 rounded-full bg-white px-1 py-0.5">
                            <button
                              type="button"
                              onClick={() => setQuantity(l.item.id, l.quantity - 1)}
                              aria-label={`One less ${l.item.name}`}
                              className="grid size-7 place-items-center rounded-full hover:bg-oat"
                            >
                              <Minus className="size-4" />
                            </button>
                            <span className="w-5 text-center tabular-nums">{l.quantity}</span>
                            <button
                              type="button"
                              onClick={() => setQuantity(l.item.id, l.quantity + 1)}
                              aria-label={`One more ${l.item.name}`}
                              className="grid size-7 place-items-center rounded-full hover:bg-oat"
                            >
                              <Plus className="size-4" />
                            </button>
                          </span>
                          <span className="w-24 text-right tabular-nums text-sage">{formatPrice(l.item.price * l.quantity)}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 flex justify-between border-t border-taupe/60 pt-3 font-medium text-roast">
                    <span>Total (pay at the café)</span>
                    <span className="tabular-nums">{formatPrice(trayTotal)}</span>
                  </p>
                </>
              )}
              {preOrderError && (
                <p role="alert" className="mt-2 text-sm text-red-700">
                  {preOrderError}
                </p>
              )}
            </section>

            {errors.non_field_errors && (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {errors.non_field_errors[0]}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-6 w-full rounded-lg bg-sage py-4 text-lg text-cream transition hover:bg-sage-dark disabled:opacity-60"
            >
              {status === "sending" ? "Booking…" : "Confirm Reservation"}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
