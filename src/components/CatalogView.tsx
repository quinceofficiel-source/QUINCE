"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { EditorialPromoBanner } from "@/components/EditorialPromoBanner";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ProductGrid } from "@/components/ProductGrid";
import { products } from "@/data/products";
import { filterProducts } from "@/lib/search";
import { parseServingFormat, servingTypeFromFormat } from "@/lib/serving";
import type { EditorialBanner } from "@/lib/editorial";
import type { CategoryId, Cuisine } from "@/types/product";

const FIRST_SECTION = 8;

export function CatalogView({
  title,
  subtitle,
  banner = null,
}: {
  title?: string;
  subtitle?: string;
  banner?: EditorialBanner | null;
}) {
  const params = useSearchParams();
  const sharing = parseServingFormat(params.get("format")) === "partage";
  const heading = title ?? (sharing ? "Repas à partager" : "Nos plats");
  const lead =
    subtitle ??
    (sharing
      ? "Grands plats à poser au centre de la table, pour 4 à 6 personnes."
      : "Des recettes généreuses, cuisinées chaque jour. Filtrez selon votre envie du moment.");

  const filtered = useMemo(() => {
    const category = params.get("categorie") as CategoryId | null;
    const format = parseServingFormat(params.get("format"));
    return filterProducts({
      servingType: servingTypeFromFormat(format),
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

  const ordered = useMemo(
    () => [...filtered].sort((a, b) => Number(b.isPopular) - Number(a.isPopular)),
    [filtered],
  );
  const head = ordered.slice(0, FIRST_SECTION);
  const tail = ordered.slice(FIRST_SECTION);
  const showBanner = Boolean(banner && head.length > 0);

  return (
    <div className="pb-16">
      <h1 className="font-display text-3xl tracking-tight sm:text-5xl">{heading}</h1>
      {lead ? <p className="mt-3 max-w-2xl text-muted">{lead}</p> : null}
      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <FilterSidebar />
        <div>
          <p className="mb-4 text-sm text-muted">{filtered.length} plat{filtered.length > 1 ? "s" : ""}</p>
          <ProductGrid products={head.length ? head : ordered} />
          {showBanner && banner ? <EditorialPromoBanner banner={banner} className="my-8" /> : null}
          {tail.length > 0 ? <ProductGrid products={tail} /> : null}
        </div>
      </div>
    </div>
  );
}
