"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { products } from "@/data/products";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { searchProducts } from "@/lib/search";
import Link from "next/link";

export function SearchBar({
  className,
  compact = false,
  autoFocus = false,
  defaultQuery = "",
}: {
  className?: string;
  compact?: boolean;
  autoFocus?: boolean;
  defaultQuery?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => (query.trim().length > 1 ? searchProducts(query, products).slice(0, 6) : []), [query]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  function submit(event?: React.FormEvent) {
    event?.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/recherche?q=${encodeURIComponent(q)}`);
  }

  return (
    <div ref={wrapperRef} className={cn("relative w-full", className)}>
      <form onSubmit={submit}>
        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={query}
          autoFocus={autoFocus}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Rechercher un plat, une envie…"
          className={cn(
            "w-full rounded-full border border-transparent bg-cream pr-4 pl-11 text-sm text-ink placeholder:text-muted/80 transition",
            "hover:bg-cream-dark focus:border-quince/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-quince/70",
            compact ? "h-11" : "h-12",
          )}
          aria-label="Rechercher un plat"
        />
      </form>
      {open && results.length > 0 ? (
        <div className="absolute top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-2xl border border-line bg-white shadow-xl">
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/plats/${product.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-cream"
            >
              <span className="truncate font-medium">{product.name}</span>
              <span className="shrink-0 text-muted">{formatPrice(product.price)}</span>
            </Link>
          ))}
          <button
            type="button"
            onClick={() => submit()}
            className="w-full border-t border-line px-4 py-3 text-left text-sm font-medium text-forest hover:bg-cream"
          >
            Voir tous les résultats
          </button>
        </div>
      ) : null}
    </div>
  );
}
