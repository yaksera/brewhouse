import type { FieldErrors } from "./types";

/** Browser-side base URL of the Django API (CORS is enabled for the frontend origin). */
const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

export type SubmitResult = { ok: true } | { ok: false; errors: FieldErrors };

export async function postForm(path: string, body: Record<string, unknown>): Promise<SubmitResult> {
  try {
    const res = await fetch(`${PUBLIC_API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) return { ok: true };
    if (res.status === 429) {
      return { ok: false, errors: { non_field_errors: ["Too many requests. Please try again in a little while."] } };
    }
    const data = await res.json().catch(() => ({}));
    return { ok: false, errors: normalizeErrors(data) };
  } catch {
    return { ok: false, errors: { non_field_errors: ["Couldn't reach the server. Check your connection and try again."] } };
  }
}

function normalizeErrors(data: unknown): FieldErrors {
  if (!data || typeof data !== "object") return { non_field_errors: ["Something went wrong."] };
  const out: FieldErrors = {};
  for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
    out[key === "detail" ? "non_field_errors" : key] = Array.isArray(val) ? val.map(String) : [String(val)];
  }
  return out;
}
