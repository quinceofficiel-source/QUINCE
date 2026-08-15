"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { ProductCard } from "@/components/ProductCard";
import { CUISINES } from "@/data/categories";
import { getByCuisine } from "@/data/products";
import { cn } from "@/lib/cn";
import type { Cuisine } from "@/types/product";

export function WorldSection() {
  const [cuisine, setCuisine] = useState<Cuisine>("france");
  const dishes = useMemo(() => getByCuisine(cuisine).slice(0, 6), [cuisine]);

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Faites le tour du monde</h2>
        <p className="mt-2 max-w-xl text-muted">Des recettes inspirées d’ici et d’ailleurs, cuisinées dans nos ateliers.</p>
        <div className="scrollbar-hide mt-6 flex gap-2 overflow-x-auto pb-1">
          {CUISINES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCuisine(item.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium",
                cuisine === item.id ? "border-ink bg-ink text-white" : "border-line bg-white hover:bg-cream-dark",
              )}
            >
              <span>{item.flag}</span>
              {item.label}
            </button>
          ))}
        </div>
        <div className="scrollbar-hide mt-6 -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {dishes.map((product) => (
            <ProductCard key={product.id} product={product} className="w-[260px] shrink-0" />
          ))}
        </div>
      </Container>
    </section>
  );
}
