"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { FavoriteButton } from "@/components/FavoriteButton";
import { getProductBySlug } from "@/data/products";
import { formatNumber, formatPrice, formatRating } from "@/lib/format";

const heroProduct = getProductBySlug("poulet-creme-moutarde")!;

export function Hero() {
  return (
    <section className="overflow-hidden pt-6 pb-4 sm:pt-10">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="max-w-xl">
            <h1 className="font-display text-[2.35rem] leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              Des plats maison,
              <br />
              comme si c’était les vôtres.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              Des recettes généreuses, préparées chaque jour avec des ingrédients frais et de saison.
            </p>
            <Button href="/plats" size="lg" className="mt-8">
              Découvrir nos plats
            </Button>
            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {[
                { icon: "🌿", title: "Ingrédients frais", text: "Sélectionnés avec soin" },
                { icon: "👨‍🍳", title: "Cuisiné chaque jour", text: "Dans nos cuisines" },
                { icon: "🚚", title: "Livraison rapide", text: "Chez vous, au frais" },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-3 sm:block">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="mt-0 text-sm font-semibold sm:mt-2">{item.title}</p>
                    <p className="text-xs text-muted">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] bg-cream-dark sm:aspect-[4/3]">
              <Image
                src={heroProduct.image}
                alt="Poulet rôti, pommes grenailles et carottes dans une assiette en céramique"
                fill
                preload
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <article className="absolute right-3 bottom-3 left-3 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:right-auto sm:bottom-6 sm:left-6 sm:w-[300px]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium">{heroProduct.name}</h2>
                  <p className="mt-1 text-sm text-muted">{heroProduct.shortDescription}</p>
                </div>
                <FavoriteButton productId={heroProduct.id} size="sm" />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <span className="rounded-full bg-cream-dark px-2.5 py-1 text-[11px] font-medium">🏠 Complet</span>
                  <p className="mt-2 flex items-center gap-1 text-sm">
                    <Star className="h-3.5 w-3.5 fill-quince text-quince" />
                    {formatRating(heroProduct.rating)}{" "}
                    <span className="text-muted">({formatNumber(heroProduct.reviews)} avis)</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(heroProduct.price)}</p>
                  <AddToCartButton product={heroProduct} className="mt-2 ml-auto" />
                </div>
              </div>
            </article>
          </div>
        </div>
      </Container>
    </section>
  );
}
