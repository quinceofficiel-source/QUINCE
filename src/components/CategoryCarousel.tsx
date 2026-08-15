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
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
      {CATEGORIES.map((category) => {
        const selected =
          (category.id === "nouveau" && isNew) ||
          (category.id !== "nouveau" && category.id !== "favoris" && active === category.id);
        return (
          <Link
            key={category.id}
            href={category.href}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition",
              selected
                ? "border-ink bg-ink text-white"
                : "border-line bg-white text-ink hover:border-ink/30 hover:bg-cream-dark",
            )}
          >
            <span aria-hidden>{category.emoji}</span>
            {category.label}
          </Link>
        );
      })}
    </div>
  );
}
