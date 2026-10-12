"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { MenuItem } from "@/lib/types";

export type TrayLine = { item: MenuItem; quantity: number };

type ReservationState = {
  tray: TrayLine[];
  trayCount: number;
  trayTotal: number;
  add: (item: MenuItem) => void;
  setQuantity: (itemId: number, quantity: number) => void;
  clearTray: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const Ctx = createContext<ReservationState | null>(null);

export function ReservationProvider({ children }: { children: ReactNode }) {
  const [tray, setTray] = useState<TrayLine[]>([]);
  const [isOpen, setOpen] = useState(false);

  const add = useCallback((item: MenuItem) => {
    setTray((lines) => {
      const found = lines.find((l) => l.item.id === item.id);
      if (found) {
        return lines.map((l) => (l.item.id === item.id ? { ...l, quantity: Math.min(l.quantity + 1, 20) } : l));
      }
      return [...lines, { item, quantity: 1 }];
    });
  }, []);

  const setQuantity = useCallback((itemId: number, quantity: number) => {
    setTray((lines) =>
      quantity <= 0
        ? lines.filter((l) => l.item.id !== itemId)
        : lines.map((l) => (l.item.id === itemId ? { ...l, quantity: Math.min(quantity, 20) } : l)),
    );
  }, []);

  const value = useMemo<ReservationState>(
    () => ({
      tray,
      trayCount: tray.reduce((n, l) => n + l.quantity, 0),
      trayTotal: tray.reduce((n, l) => n + l.quantity * l.item.price, 0),
      add,
      setQuantity,
      clearTray: () => setTray([]),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
    }),
    [tray, add, setQuantity, isOpen],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useReservation() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useReservation must be used inside <ReservationProvider>");
  return ctx;
}
