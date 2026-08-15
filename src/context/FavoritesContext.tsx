"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { products } from "@/data/products";
import { STORAGE_KEYS } from "@/lib/storage";
import { useStoredJson } from "@/lib/useStoredJson";
import type { Product } from "@/types/product";

type FavoritesContextValue = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  items: Product[];
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const EMPTY_IDS: string[] = [];

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useStoredJson<string[]>(STORAGE_KEYS.favorites, EMPTY_IDS);

  const toggle = useCallback(
    (id: string) => {
      setIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    },
    [setIds],
  );

  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const items = useMemo(() => products.filter((product) => ids.includes(product.id)), [ids]);
  const value = useMemo(() => ({ ids, toggle, has, items }), [ids, toggle, has, items]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return context;
}
