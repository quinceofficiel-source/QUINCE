"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { catalogFormatHref, parseServingFormat, type ServingFormat } from "@/lib/serving";

const OPTIONS: Array<{ id: ServingFormat; label: string; shortLabel: string }> = [
  { id: "individuel", label: "Plat individuel", shortLabel: "Plat individuel" },
  { id: "partage", label: "Repas à partager", shortLabel: "À partager" },
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
    if (format === current && (pathname === "/" || pathname === "/plats" || pathname === "/recherche")) return;
    router.push(catalogFormatHref(format, pathname, params.toString()), { scroll: false });
  }

  return (
    <div
      role="radiogroup"
      aria-label="Type de repas"
      className={cn(
        "rounded-full bg-[#eee] p-1",
        variant === "bar" ? "flex w-full" : "inline-flex max-w-full",
      )}
    >
      {OPTIONS.map((option) => {
        const selected = current === option.id;
        const label = variant === "bar" ? option.shortLabel : option.label;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => select(option.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[13px] font-medium whitespace-nowrap text-ink transition duration-200 sm:px-3.5 sm:text-sm",
              variant === "bar" ? "min-w-0 flex-1" : null,
              selected
                ? "bg-white shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
                : "bg-transparent hover:bg-white/50",
            )}
          >
            {variant === "inline" ? (
              <>
                <span className="xl:hidden">{option.shortLabel}</span>
                <span className="hidden xl:inline">{option.label}</span>
              </>
            ) : (
              label
            )}
          </button>
        );
      })}
    </div>
  );
}
