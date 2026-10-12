import Image from "next/image";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <span className="flex items-center gap-1">
      <Image src="/images/logo-star.png" alt="" width={190} height={190} loading="eager" className="size-12 sm:size-[60px]" />
      <span className="leading-tight">
        <span className={`block text-xl sm:text-[22px] ${tone === "dark" ? "text-roast" : "text-cream"}`}>Brew House</span>
        <span className={`block text-xs tracking-wide sm:text-sm ${tone === "dark" ? "text-sage" : "text-matcha"}`}>
          KATHMANDU
        </span>
      </span>
    </span>
  );
}
