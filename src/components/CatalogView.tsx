"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ProductGrid } from "@/components/ProductGrid";
import { products } from "@/data/products";
import { filterProducts } from "@/lib/search";
import type { CategoryId, Cuisine } from "@/types/product";

export function CatalogView({ title = "Nos plats", subtitle }: { title?: string; subtitle?: string }) {
  const params = useSearchParams();

  const filtered = useMemo(() => {
    const category = params.get("categorie") as CategoryId | null;
    return filterProducts({
      category: category && category !== "nouveau" && category !== "favoris" ? category : undefined,
      cuisine: (params.get("cuisine") as Cuisine | null) || undefined,
      vegetarian: params.get("vege") === "1",
      isNew: params.get("nouveautes") === "1" || category === "nouveau",
      popular: params.get("populaires") === "1",
      maxPrice: params.get("prix") ? Number(params.get("prix")) : undefined,
      maxCalories: params.get("calories") ? Number(params.get("calories")) : undefined,
      minProtein: params.get("proteines") ? Number(params.get("proteines")) : undefined,
      query: params.get("q") ?? undefined,
    }, products);
  }, [params]);

  return (
    <div className="pb-16">
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">{title}</h1>
      {subtitle ? <p className="mt-3 max-w-2xl text-muted">{subtitle}</p> : null}
      <div className="mt-8">
        <CategoryCarousel />
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <FilterSidebar />
        <div>
          <p className="mb-4 text-sm text-muted">{filtered.length} plat{filtered.length > 1 ? "s" : ""}</p>
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
