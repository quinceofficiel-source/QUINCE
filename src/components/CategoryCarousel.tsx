"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/data/categories";
import { cn } from "@/lib/cn";

export function CategoryCarousel() {
  const params = useSearchParams();
  const active = params.get("categorie");
  const isNew = params.get("nouveautes") === "1";

  return (
    <div className="scrollbar-hide flex justify-start gap-3 overflow-x-auto pb-1 sm:gap-4 lg:justify-between">
      {CATEGORIES.map((category) => {
        const selected =
          (category.id === "nouveau" && isNew) ||
          (category.id !== "nouveau" && category.id !== "favoris" && active === category.id);
        return (
          <Link
            key={category.id}
            href={category.href}
            className="group flex w-[4.5rem] shrink-0 flex-col items-center gap-2"
          >
            <span
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full text-xl transition",
                selected
                  ? "bg-quince shadow-sm"
                  : "bg-white shadow-[0_6px_18px_-12px_rgba(17,17,17,0.35)] group-hover:bg-cream-dark",
              )}
            >
              <span aria-hidden>{category.emoji}</span>
            </span>
            <span className={cn("text-xs font-medium text-forest", selected && "font-semibold")}>{category.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
