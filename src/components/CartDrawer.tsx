"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/Button";
import { QuantitySelector } from "@/components/QuantitySelector";
import { getLineUnitPrice, useCart } from "@/context/CartContext";
import { getProductById } from "@/data/products";
import { cn } from "@/lib/cn";
import { formatPrice, FREE_SHIPPING_THRESHOLD, plural } from "@/lib/format";

export function CartDrawer() {
  const { lines, isOpen, closeCart, subtotal, shipping, total, remainingForFreeShipping, setQuantity, removeLine } =
    useCart();

  return (
    <div className={cn("fixed inset-0 z-[70]", isOpen ? "pointer-events-auto" : "pointer-events-none")}>
      <button
        type="button"
        aria-label="Fermer le panier"
        onClick={closeCart}
        className={cn("absolute inset-0 bg-ink/40 transition", isOpen ? "opacity-100" : "opacity-0")}
      />
      <aside
        className={cn(
          "absolute top-0 right-0 flex h-full w-full max-w-[420px] flex-col bg-cream shadow-2xl transition duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2 className="font-display text-2xl">Votre panier</h2>
            <p className="text-sm text-muted">{plural(lines.reduce((n, l) => n + l.quantity, 0), "plat", "plats")}</p>
          </div>
          <button type="button" onClick={closeCart} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white" aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 pt-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-quince transition-all"
              style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            {remainingForFreeShipping > 0
              ? `Plus que ${formatPrice(remainingForFreeShipping)} pour la livraison offerte.`
              : "Livraison offerte."}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-medium">Votre panier est vide</p>
              <p className="mt-1 text-sm text-muted">Ajoutez quelques plats maison pour commencer.</p>
              <Button href="/plats" className="mt-6" onClick={closeCart}>
                Découvrir nos plats
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => {
                const product = getProductById(line.productId);
                if (!product) return null;
                const unit = getLineUnitPrice(line);
                return (
                  <li key={`${line.productId}-${line.servings}`} className="flex gap-3 rounded-2xl bg-white p-3">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                      <Image src={product.image} alt="" fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{product.name}</p>
                      <p className="text-xs text-muted">{line.servings} portion{line.servings > 1 ? "s" : ""}</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <QuantitySelector
                          value={line.quantity}
                          onChange={(value) => setQuantity(line.productId, line.servings, value)}
                          min={0}
                        />
                        <p className="text-sm font-semibold">{formatPrice(unit * line.quantity)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLine(line.productId, line.servings)}
                      className="self-start text-muted hover:text-ink"
                      aria-label={`Retirer ${product.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {lines.length > 0 ? (
          <div className="border-t border-line bg-white px-5 py-4">
            <div className="mb-3 flex justify-between text-sm">
              <span>Sous-total</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="mb-4 flex justify-between text-sm text-muted">
              <span>Livraison</span>
              <span>{shipping === 0 ? "Offerte" : formatPrice(shipping)}</span>
            </div>
            <div className="mb-4 flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Button href="/checkout" variant="dark" className="w-full" onClick={closeCart}>
              Continuer vers le paiement
            </Button>
            <Link href="/plats" onClick={closeCart} className="mt-3 block text-center text-sm text-muted hover:text-ink">
              Continuer mes achats
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
