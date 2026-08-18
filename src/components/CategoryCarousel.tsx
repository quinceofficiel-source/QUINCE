"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CategoryIcon } from "@/components/CategoryIcons";
import { CATEGORIES } from "@/data/categories";
import { cn } from "@/lib/cn";

export function CategoryCarousel() {
  const params = useSearchParams();
  const pathname = usePathname();
  const active = params.get("categorie");
  const isNew = params.get("nouveautes") === "1";
  const scroller = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);

  function sync() {
    const el = scroller.current;
    if (!el) return;
    setLeft(el.scrollLeft > 12);
    setRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 12);
  }

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  function move(direction: -1 | 1) {
    scroller.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {left ? (
        <button
          type="button"
          onClick={() => move(-1)}
          className="absolute top-7 left-0 z-10 hidden h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_8px_20px_-10px_rgba(17,17,17,0.45)] hover:bg-cream md:inline-flex"
          aria-label="Catégories précédentes"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      ) : null}
      {right ? (
        <button
          type="button"
          onClick={() => move(1)}
          className="absolute top-7 right-0 z-10 hidden h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_8px_20px_-10px_rgba(17,17,17,0.45)] hover:bg-cream md:inline-flex"
          aria-label="Catégories suivantes"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      ) : null}

      <div
        ref={scroller}
        className="scrollbar-hide flex gap-1 overflow-x-auto overscroll-x-contain px-1 py-3 sm:gap-2 md:px-10"
      >
        {CATEGORIES.map((category) => {
          const selected =
            (category.id === "nouveau" && isNew) ||
            (category.id === "favoris" && pathname.startsWith("/favoris")) ||
            (category.id !== "nouveau" && category.id !== "favoris" && active === category.id);
          return (
            <Link
              key={category.id}
              href={category.href}
              className="group flex w-[76px] shrink-0 flex-col items-center gap-1.5 sm:w-[84px]"
            >
              <CategoryIcon
                id={category.id}
                className={cn(
                  "h-14 w-14 transition duration-200 sm:h-16 sm:w-16",
                  selected ? "scale-105" : "group-hover:scale-105",
                )}
              />
              <span
                className={cn(
                  "text-center text-[12px] leading-tight text-ink",
                  selected ? "font-semibold underline decoration-2 underline-offset-4" : "font-medium",
                )}
              >
                {category.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
