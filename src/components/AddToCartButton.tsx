"use client";

import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/cn";
import type { Product } from "@/types/product";

export function AddToCartButton({
  product,
  servings = 1,
  quantity = 1,
  className,
  label,
}: {
  product: Product;
  servings?: 1 | 2 | 4;
  quantity?: number;
  className?: string;
  label?: string;
}) {
  const { addItem } = useCart();
  const { push } = useToast();

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        addItem(product, servings, quantity);
        push(`${product.name} ajouté au panier`);
      }}
      aria-label={`Ajouter ${product.name} au panier`}
      className={cn(
        "inline-flex items-center justify-center rounded-xl bg-quince text-ink transition duration-200 hover:scale-105 hover:bg-quince-dark",
        label ? "h-12 gap-2 px-5 text-sm font-semibold" : "h-10 w-10",
        className,
      )}
    >
      <Plus className="h-5 w-5" strokeWidth={2.4} />
      {label}
    </button>
  );
}
