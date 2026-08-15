"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/Container";
import { ProductGrid } from "@/components/ProductGrid";
import { SearchBar } from "@/components/SearchBar";
import { products } from "@/data/products";
import { searchProducts } from "@/lib/search";

function SearchResults() {
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  const results = useMemo(() => searchProducts(query, products), [query]);

  return (
    <>
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Recherche</h1>
      <div className="mt-6 max-w-xl">
        <SearchBar defaultQuery={query} />
      </div>
      <p className="mt-6 text-sm text-muted">
        {query
          ? `${results.length} résultat${results.length > 1 ? "s" : ""} pour « ${query} »`
          : "Tapez un plat, une envie, un ingrédient."}
      </p>
      <div className="mt-8">
        <ProductGrid products={query ? results : products.slice(0, 8)} />
      </div>
    </>
  );
}

export default function RecherchePage() {
  return (
    <Container className="py-10 pb-20">
      <Suspense>
        <SearchResults />
      </Suspense>
    </Container>
  );
}
