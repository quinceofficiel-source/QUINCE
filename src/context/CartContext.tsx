"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { getProductById } from "@/data/products";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/format";
import { STORAGE_KEYS } from "@/lib/storage";
import { useStoredJson } from "@/lib/useStoredJson";
import type { CartLine, Product } from "@/types/product";

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  total: number;
  remainingForFreeShipping: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, servings?: 1 | 2 | 4, quantity?: number) => void;
  removeLine: (productId: string, servings: 1 | 2 | 4) => void;
  setQuantity: (productId: string, servings: 1 | 2 | 4, quantity: number) => void;
  clearCart: () => void;
  lastAddedId: string | null;
};

const CartContext = createContext<CartContextValue | null>(null);
const EMPTY_CART: CartLine[] = [];

function linePrice(line: CartLine) {
  const product = getProductById(line.productId);
  if (!product) return 0;
  const portion = product.portions.find((item) => item.servings === line.servings) ?? product.portions[0];
  return portion.price * line.quantity;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useStoredJson<CartLine[]>(STORAGE_KEYS.cart, EMPTY_CART);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  const addItem = useCallback(
    (product: Product, servings: 1 | 2 | 4 = 1, quantity = 1) => {
      setLines((current) => {
        const existing = current.find((line) => line.productId === product.id && line.servings === servings);
        if (existing) {
          return current.map((line) =>
            line.productId === product.id && line.servings === servings
              ? { ...line, quantity: line.quantity + quantity }
              : line,
          );
        }
        return [...current, { productId: product.id, servings, quantity }];
      });
      setLastAddedId(product.id);
      window.setTimeout(() => setLastAddedId(null), 1200);
    },
    [setLines],
  );

  const removeLine = useCallback(
    (productId: string, servings: 1 | 2 | 4) => {
      setLines((current) => current.filter((line) => !(line.productId === productId && line.servings === servings)));
    },
    [setLines],
  );

  const setQuantity = useCallback(
    (productId: string, servings: 1 | 2 | 4, quantity: number) => {
      setLines((current) => {
        if (quantity <= 0) {
          return current.filter((line) => !(line.productId === productId && line.servings === servings));
        }
        return current.map((line) =>
          line.productId === productId && line.servings === servings ? { ...line, quantity } : line,
        );
      });
    },
    [setLines],
  );

  const clearCart = useCallback(() => setLines([]), [setLines]);

  const itemCount = useMemo(() => lines.reduce((sum, line) => sum + line.quantity, 0), [lines]);
  const subtotal = useMemo(() => lines.reduce((sum, line) => sum + linePrice(line), 0), [lines]);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 5.9;
  const total = subtotal + shipping;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount,
      subtotal,
      shipping,
      total,
      remainingForFreeShipping,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((open) => !open),
      addItem,
      removeLine,
      setQuantity,
      clearCart,
      lastAddedId,
    }),
    [lines, itemCount, subtotal, shipping, total, remainingForFreeShipping, isOpen, addItem, removeLine, setQuantity, clearCart, lastAddedId],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

export function getLineUnitPrice(line: CartLine) {
  const product = getProductById(line.productId);
  if (!product) return 0;
  return product.portions.find((item) => item.servings === line.servings)?.price ?? product.price;
}
