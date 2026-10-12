import { cacheLife } from "next/cache";
import { FALLBACK_MENU } from "./fallback-menu";
import type { Menu } from "./types";

/** Server-side base URL of the Django API. */
const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

export async function getMenu(): Promise<Menu> {
  "use cache";
  cacheLife("minutes");

  try {
    const res = await fetch(`${API_URL}/menu/`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error(`menu: HTTP ${res.status}`);
    return (await res.json()) as Menu;
  } catch (err) {
    console.warn("[brewhouse] API unavailable, using fallback menu:", (err as Error).message);
    return FALLBACK_MENU;
  }
}
