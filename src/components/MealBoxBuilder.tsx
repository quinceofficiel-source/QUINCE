"use client";

import { useMemo } from "react";
import { Button } from "@/components/Button";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { getMains, getProductById } from "@/data/products";
import { STORAGE_KEYS } from "@/lib/storage";
import { useStoredJson } from "@/lib/useStoredJson";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { BoxFormula } from "@/types/product";

const FORMULAS: { size: BoxFormula; title: string; text: string }[] = [
  { size: 5, title: "5 plats", text: "Pour découvrir Quince" },
  { size: 10, title: "10 plats", text: "La semaine est prête" },
  { size: 14, title: "14 plats", text: "Midi + soir pendant 7 jours" },
];

type BoxState = { formula: BoxFormula; selectedIds: string[] };

const DEFAULT_BOX: BoxState = { formula: 10, selectedIds: [] };

export function MealBoxBuilder() {
  const mains = useMemo(() => getMains(), []);
  const { addItem } = useCart();
  const { push } = useToast();
  const [box, setBox] = useStoredJson<BoxState>(STORAGE_KEYS.box, DEFAULT_BOX);
  const formula = box.formula;
  const selectedIds = box.selectedIds;

  function setFormula(next: BoxFormula) {
    setBox({ formula: next, selectedIds: selectedIds.slice(0, next) });
  }

  function toggle(id: string) {
    setBox((current) => {
      if (current.selectedIds.includes(id)) {
        return { ...current, selectedIds: current.selectedIds.filter((item) => item !== id) };
      }
      if (current.selectedIds.length >= current.formula) return current;
      return { ...current, selectedIds: [...current.selectedIds, id] };
    });
  }

  const selected = selectedIds.map(getProductById).filter(Boolean);
  const total = selected.reduce((sum, product) => sum + (product?.price ?? 0), 0);
  const complete = selectedIds.length === formula;

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        {FORMULAS.map((item) => (
          <button
            key={item.size}
            type="button"
            onClick={() => setFormula(item.size)}
            className={cn(
              "rounded-[1.5rem] border p-5 text-left transition",
              formula === item.size ? "border-ink bg-white shadow-sm" : "border-line bg-cream-dark/50 hover:bg-white",
            )}
          >
            <p className="font-display text-3xl">{item.title}</p>
            <p className="mt-2 text-sm text-muted">{item.text}</p>
          </button>
        ))}
      </div>

      <div className="sticky top-[80px] z-20 mt-8 rounded-2xl border border-line bg-white/95 p-4 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold">
              {selectedIds.length} / {formula} plats sélectionnés
            </p>
            <p className="text-sm text-muted">Sous-total estimé : {formatPrice(total)}</p>
          </div>
          <Button
            variant="dark"
            disabled={!complete}
            onClick={() => {
              selectedIds.forEach((id) => {
                const product = getProductById(id);
                if (product) addItem(product, 1, 1);
              });
              push("Votre box a été ajoutée au panier");
              setBox({ formula, selectedIds: [] });
            }}
          >
            Ajouter la box au panier
          </Button>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-quince transition-all"
            style={{ width: `${(selectedIds.length / formula) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mains.map((product) => {
          const selectedItem = selectedIds.includes(product.id);
          const locked = !selectedItem && selectedIds.length >= formula;
          return (
            <div key={product.id} className={cn("relative", locked && "opacity-50")}>
              <ProductCard product={product} />
              <button
                type="button"
                disabled={locked}
                onClick={() => toggle(product.id)}
                className={cn(
                  "absolute top-3 left-3 z-10 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm",
                  selectedItem ? "bg-ink text-white" : "bg-white text-ink",
                )}
              >
                {selectedItem ? "Sélectionné" : "Choisir"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
