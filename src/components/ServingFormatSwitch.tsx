"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { catalogFormatHref, parseServingFormat, type ServingFormat } from "@/lib/serving";

const OPTIONS: Array<{ id: ServingFormat; label: string; shortLabel: string; emoji: string }> = [
  { id: "individuel", label: "Plat individuel", shortLabel: "Plat individuel", emoji: "🍽" },
  { id: "partage", label: "Repas à partager", shortLabel: "À partager", emoji: "👨‍👩‍👧" },
];

export function ServingFormatSwitch({
  variant = "inline",
}: {
  variant?: "inline" | "bar";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = parseServingFormat(params.get("format"));

  function select(format: ServingFormat) {
    if (format === current && (pathname === "/plats" || pathname === "/recherche")) return;
    router.push(catalogFormatHref(format, pathname, params.toString()), { scroll: false });
  }

  return (
    <div
      role="radiogroup"
      aria-label="Type de repas"
      className={cn(
        "rounded-full bg-cream p-1",
        variant === "bar" ? "flex w-full" : "inline-flex max-w-full",
      )}
    >
      {OPTIONS.map((option) => {
        const selected = current === option.id;
        const fullLabel = option.label;
        const compactLabel = option.shortLabel;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => select(option.id)}
            className={cn(
              "rounded-full px-2.5 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors duration-200 sm:px-3 sm:text-sm",
              variant === "bar" ? "min-w-0 flex-1" : "px-3.5",
              selected ? "bg-ink text-white" : "text-ink hover:bg-white/80",
            )}
          >
            {variant === "inline" ? (
              <>
                <span className="mr-1.5 hidden xl:inline" aria-hidden>
                  {option.emoji}
                </span>
                <span className="xl:hidden">{compactLabel}</span>
                <span className="hidden xl:inline">{fullLabel}</span>
              </>
            ) : (
              compactLabel
            )}
          </button>
        );
      })}
    </div>
  );
}
