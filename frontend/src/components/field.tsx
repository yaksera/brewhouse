import type { ReactNode } from "react";
import type { FieldErrors } from "@/lib/types";

export const inputClass =
  "w-full rounded-lg border border-taupe/70 bg-white px-4 py-3 text-roast placeholder:text-body/50 outline-none transition focus:border-sage focus:ring-2 focus:ring-sage/25";

type Props = {
  label: string;
  /** Field name, used to look up its DRF errors. */
  name: string;
  /** id of the child control (defaults to name). */
  id?: string;
  /** Render the label for screen readers only (placeholder-style fields). */
  hideLabel?: boolean;
  errors: FieldErrors;
  className?: string;
  children: ReactNode;
};

export function Field({ label, name, id, hideLabel, errors, className = "", children }: Props) {
  const message = errors[name]?.[0];
  return (
    <div className={className}>
      <label
        htmlFor={id ?? name}
        className={hideLabel ? "sr-only" : "mb-1.5 block text-sm font-medium text-roast"}
      >
        {label}
      </label>
      <div className={message ? "[&>*]:border-red-400 [&>*]:ring-2 [&>*]:ring-red-200" : undefined}>{children}</div>
      {message && (
        <p role="alert" className="mt-1 text-sm text-red-700">
          {message}
        </p>
      )}
    </div>
  );
}
