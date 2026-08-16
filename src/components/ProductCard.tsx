"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import { getCategoryLabel } from "@/lib/search";
import { formatNumber, formatPrice, formatRating } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Product } from "@/types/product";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const badge = product.isComplete ? "Complet" : getCategoryLabel(product.category);

  return (
    <article
      className={cn(
        "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.35rem] bg-white shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-0.5 hover:shadow-lg",
        className,
      )}
    >
      <Link href={`/plats/${product.slug}`} className="relative block aspect-[5/4] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 70vw, 280px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <FavoriteButton productId={product.id} className="absolute top-3 right-3" size="sm" />
        {product.isNew ? (
          <span className="absolute top-3 left-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold">
            Nouveau
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/plats/${product.slug}`} className="font-medium leading-snug text-ink">
          {product.name}
        </Link>
        <span className="mt-2 inline-flex w-fit rounded-full bg-cream-dark px-2.5 py-1 text-[11px] font-medium text-ink/80">
          {badge}
        </span>
        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <p className="flex items-center gap-1 text-sm text-ink">
              <Star className="h-3.5 w-3.5 fill-quince text-quince" />
              <span className="font-medium">{formatRating(product.rating)}</span>
              <span className="text-muted">({formatNumber(product.reviews)})</span>
            </p>
            <p className="mt-1 text-base font-semibold">{formatPrice(product.price)}</p>
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
