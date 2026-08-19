"use client";

import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { ProductGrid } from "@/components/ProductGrid";
import { useFavorites } from "@/context/FavoritesContext";

export default function FavorisPage() {
  const { items } = useFavorites();

  return (
    <Container className="py-10 pb-20">
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Vos favoris</h1>
      <p className="mt-3 text-muted">Retrouvez ici les plats que vous avez aimés.</p>
      {items.length === 0 ? (
        <div className="mt-10 rounded-[1.5rem] bg-white px-6 py-16 text-center">
          <p className="font-medium">Aucun favori pour le moment</p>
          <p className="mt-2 text-sm text-muted">Touchez le cœur sur une carte pour l’enregistrer.</p>
          <Button href="/" className="mt-6">
            Découvrir les plats
          </Button>
        </div>
      ) : (
        <div className="mt-10">
          <ProductGrid products={items} />
        </div>
      )}
    </Container>
  );
}
