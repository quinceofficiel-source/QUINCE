"use client";

import Image from "next/image";
import { ChefHat, Leaf, Star, Truck } from "lucide-react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Button } from "@/components/Button";
import { getProductBySlug } from "@/data/products";
import { formatNumber, formatPrice, formatRating } from "@/lib/format";

const heroProduct = getProductBySlug("poulet-creme-moutarde")!;

const argumentsList = [
  { icon: Leaf, title: "Ingrédients frais", text: "Sélectionnés avec soin" },
  { icon: ChefHat, title: "Cuisiné chaque jour", text: "Dans nos cuisines" },
  { icon: Truck, title: "Livraison rapide", text: "Chez vous, au frais" },
];

export function Hero() {
  return (
    <section className="relative">
      <div className="relative min-h-[560px] overflow-hidden sm:min-h-[620px] lg:min-h-[680px]">
        <Image
          src={heroProduct.image}
          alt="Poulet crème moutarde, pommes grenailles rôties et carottes fondantes"
          fill
          preload
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-[68%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream/90 to-cream/55 lg:bg-gradient-to-r lg:from-cream lg:via-cream/88 lg:to-transparent" />

        <div className="relative mx-auto grid min-h-[560px] max-w-[1320px] items-center gap-10 px-4 py-12 sm:min-h-[620px] sm:px-6 lg:min-h-[680px] lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
          <div className="max-w-xl">
            <h1 className="font-display text-[2.4rem] leading-[1.08] tracking-tight text-forest sm:text-5xl lg:text-[3.55rem]">
              Des plats maison,
              <br />
              comme si c’était les vôtres.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-forest/75 sm:text-lg">
              Des recettes généreuses, préparées chaque jour avec des ingrédients frais et de saison.
            </p>
            <Button href="/plats" size="lg" className="mt-8 rounded-2xl px-7">
              Découvrir nos plats
            </Button>
            <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {argumentsList.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-forest" strokeWidth={1.6} />
                  <div>
                    <p className="text-sm font-semibold text-forest">{item.title}</p>
                    <p className="text-xs text-forest/65">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex items-end justify-end lg:min-h-[420px]">
            <article className="w-full max-w-[320px] rounded-[1.35rem] bg-white p-5 shadow-[0_18px_50px_-24px_rgba(17,17,17,0.45)]">
              <h2 className="text-base font-semibold text-forest">{heroProduct.name}</h2>
              <p className="mt-1 text-sm text-muted">{heroProduct.shortDescription}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-cream-dark px-2.5 py-1 text-[11px] font-medium text-forest">
                  🏠 Complet
                </span>
                <span className="inline-flex items-center gap-1 text-forest">
                  <Star className="h-3.5 w-3.5 fill-quince text-quince" />
                  <span className="font-medium">{formatRating(heroProduct.rating)}</span>
                  <span className="text-muted">({formatNumber(heroProduct.reviews)} avis)</span>
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-lg font-semibold text-forest">{formatPrice(heroProduct.price)}</p>
                <AddToCartButton product={heroProduct} className="h-10 w-10 rounded-full" />
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
