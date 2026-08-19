import Image from "next/image";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";
import { safeEditorialHref, type EditorialBanner } from "@/lib/editorial";

function isDark(color: string) {
  const hex = color.replace("#", "");
  const full = hex.length === 3 ? hex.split("").map((char) => char + char).join("") : hex;
  if (full.length !== 6) return true;
  const value = Number.parseInt(full, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return (r * 299 + g * 587 + b * 114) / 1000 < 150;
}

export function EditorialPromoBanner({
  banner,
  className,
}: {
  banner: EditorialBanner;
  className?: string;
}) {
  const dark = isDark(banner.backgroundColor);
  const href = safeEditorialHref(banner.buttonLink);

  return (
    <aside
      className={cn(
        "grid overflow-hidden rounded-[1.75rem] md:max-h-[420px] md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]",
        banner.backgroundColor === "#ffffff" && "ring-1 ring-black/8",
        className,
      )}
      style={{ backgroundColor: banner.backgroundColor, color: banner.textColor }}
    >
      <div className="flex flex-col justify-center gap-4 px-6 py-8 sm:px-10 sm:py-10 md:min-h-[320px] md:max-h-[420px]">
        {banner.badge ? (
          <span className={cn("w-fit rounded-full px-3 py-1 text-xs font-semibold", dark ? "bg-white/12" : "bg-black/8")}>
            {banner.badge}
          </span>
        ) : null}
        <div>
          <h2 className="font-display text-[1.85rem] leading-[1.12] tracking-tight sm:text-4xl">{banner.title}</h2>
          <p className={cn("mt-3 max-w-md text-sm leading-relaxed sm:text-base", dark ? "text-white/75" : "text-ink/70")}>
            {banner.subtitle}
          </p>
        </div>
        <Button href={href} variant={dark ? "primary" : "dark"} className="mt-1 w-fit">
          {banner.buttonLabel}
        </Button>
      </div>
      <div className="relative min-h-[180px] sm:min-h-[220px] md:min-h-full">
        <Image src={banner.image} alt="" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
      </div>
    </aside>
  );
}
