"use client";

import Image from "next/image";
import { ChefHat, Leaf, Star, Truck } from "lucide-react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Button } from "@/components/Button";
import { FavoriteButton } from "@/components/FavoriteButton";
import { getProductBySlug } from "@/data/products";
import { formatNumber, formatPrice, formatRating } from "@/lib/format";

const heroProduct = getProductBySlug("poulet-creme-moutarde")!;

const argumentsList = [
  { icon: Leaf, title: "Ingrédients frais" },
  { icon: ChefHat, title: "Cuisiné chaque jour" },
  { icon: Truck, title: "Livraison rapide" },
];

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative isolate min-h-[22.5rem] w-full sm:min-h-[20rem] lg:aspect-[1024/341] lg:min-h-0">
        <Image
          src="/hero-banner.jpg"
          alt="Poulet crème moutarde, pommes grenailles rôties et carottes fondantes"
          fill
          preload
          fetchPriority="high"
          quality={100}
          unoptimized
          sizes="100vw"
          className="object-cover object-[center_35%] lg:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream/85 via-cream/35 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full min-h-[22.5rem] w-full max-w-[1320px] items-center px-4 py-8 sm:min-h-[20rem] sm:px-6 lg:min-h-0 lg:px-8 lg:py-0">
          <div className="min-w-0 max-w-xl">
            <h1 className="font-display text-[1.65rem] leading-[1.12] tracking-tight text-forest sm:text-[2.1rem] lg:text-[2.45rem]">
              Des plats maison,
              <br />
              comme si c’était les vôtres.
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-forest/75 sm:text-[0.95rem]">
              Des recettes généreuses, préparées chaque jour avec des ingrédients frais et de saison.
            </p>
            <Button href="/plats" size="md" className="mt-5 rounded-full px-6">
              Découvrir nos plats
            </Button>
            <ul className="mt-5 hidden gap-6 sm:flex">
              {argumentsList.map((item) => (
                <li key={item.title} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 shrink-0 text-forest" strokeWidth={1.7} />
                  <p className="text-xs font-semibold text-forest">{item.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <article className="absolute right-4 bottom-4 hidden w-[280px] rounded-2xl bg-white p-4 shadow-[0_18px_50px_-24px_rgba(17,17,17,0.45)] sm:right-6 lg:right-[max(2rem,calc((100%-1320px)/2+2rem))] lg:bottom-6 lg:block">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-sm font-semibold text-forest">{heroProduct.name}</h2>
            <FavoriteButton productId={heroProduct.id} size="sm" className="h-7 w-7 shrink-0 shadow-none" />
          </div>
          <p className="mt-1 text-xs text-muted">{heroProduct.shortDescription}</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-cream-dark px-2 py-0.5 font-medium text-forest">🏠 Complet</span>
            <span className="inline-flex items-center gap-1 text-forest">
              <Star className="h-3 w-3 fill-quince text-quince" />
              <span className="font-medium">{formatRating(heroProduct.rating)}</span>
              <span className="text-muted">({formatNumber(heroProduct.reviews)})</span>
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-base font-semibold text-forest">{formatPrice(heroProduct.price)}</p>
            <AddToCartButton product={heroProduct} className="h-9 w-9 rounded-full" />
          </div>
        </article>
      </div>
    </section>
  );
}
