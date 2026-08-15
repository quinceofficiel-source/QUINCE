"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Container } from "@/components/Container";
import { FavoriteButton } from "@/components/FavoriteButton";
import { NutritionBadge } from "@/components/NutritionBadge";
import { ProductCard } from "@/components/ProductCard";
import { getCategoryLabel } from "@/lib/search";
import { formatNumber, formatPrice, formatRating } from "@/lib/format";
import { getExtras, getRelated } from "@/data/products";
import type { Product } from "@/types/product";

export function ProductDetail({ product }: { product: Product }) {
  const [servings, setServings] = useState<1 | 2 | 4>(1);
  const portion = useMemo(
    () => product.portions.find((item) => item.servings === servings) ?? product.portions[0],
    [product, servings],
  );
  const extras = getExtras(product);
  const related = getRelated(product);

  return (
    <div className="pb-16">
      <Container className="pt-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-cream-dark">
            <Image src={product.image} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" preload />
            <FavoriteButton productId={product.id} className="absolute top-4 right-4" />
          </div>
          <div>
            <span className="rounded-full bg-cream-dark px-3 py-1 text-sm">
              {product.category === "maison" ? "🏠 " : ""}
              {getCategoryLabel(product.category)}
            </span>
            <h1 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">{product.name}</h1>
            <p className="mt-3 flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 fill-quince text-quince" />
              <span className="font-medium">{formatRating(product.rating)}</span>
              <span className="text-muted">({formatNumber(product.reviews)} avis)</span>
            </p>
            <p className="mt-5 text-lg leading-relaxed text-ink/80">{product.description}</p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <NutritionBadge icon="🍽️" label="Repas" value={product.isComplete ? "Complet" : "Accompagnement"} />
              <NutritionBadge icon="🔥" label="Calories" value={`${product.calories} kcal`} />
              <NutritionBadge icon="💪" label="Protéines" value={`${product.protein} g`} />
            </div>

            {product.portions.length > 1 ? (
              <fieldset className="mt-8">
                <legend className="mb-3 text-sm font-semibold">Portions</legend>
                <div className="grid grid-cols-3 gap-2">
                  {product.portions.map((item) => (
                    <button
                      key={item.servings}
                      type="button"
                      onClick={() => setServings(item.servings)}
                      className={`rounded-2xl border px-3 py-3 text-left ${
                        servings === item.servings ? "border-ink bg-white" : "border-line bg-cream-dark/40"
                      }`}
                    >
                      <span className="block text-sm font-medium">{item.label}</span>
                      <span className="text-sm text-muted">{formatPrice(item.price)}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <AddToCartButton
                product={product}
                servings={portion.servings}
                label={`Ajouter · ${formatPrice(portion.price)}`}
                className="min-w-[220px] rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <section className="rounded-[1.5rem] bg-white p-6">
            <h2 className="font-display text-2xl">Ingrédients</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/80">{product.ingredients.join(", ")}.</p>
          </section>
          <section className="rounded-[1.5rem] bg-white p-6">
            <h2 className="font-display text-2xl">Allergènes</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/80">
              {product.allergens.length > 0 ? product.allergens.join(", ") : "Aucun allergène majeur déclaré."}
            </p>
          </section>
          <section className="rounded-[1.5rem] bg-white p-6">
            <h2 className="font-display text-2xl">Informations nutritionnelles</h2>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>Calories · {product.nutrition.calories} kcal</div>
              <div>Protéines · {product.nutrition.protein} g</div>
              <div>Matières grasses · {product.nutrition.fat} g</div>
              <div>Glucides · {product.nutrition.carbs} g</div>
              <div>Fibres · {product.nutrition.fiber} g</div>
              <div>Sel · {product.nutrition.salt} g</div>
            </dl>
          </section>
          <section className="rounded-[1.5rem] bg-white p-6">
            <h2 className="font-display text-2xl">Conservation & réchauffage</h2>
            <p className="mt-3 text-sm text-ink/80">{product.conservation}</p>
            <p className="mt-2 text-sm text-ink/80">{product.reheating}</p>
          </section>
        </div>

        {extras.length > 0 ? (
          <section className="mt-16">
            <h2 className="font-display text-3xl">Fréquemment ajoutés avec ce plat</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {extras.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl">
                      <Image src={item.image} alt="" fill className="object-cover" sizes="64px" />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                  <AddToCartButton product={item} />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="mt-16">
            <h2 className="font-display text-3xl">Ils ont aussi aimé</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </div>
  );
}
