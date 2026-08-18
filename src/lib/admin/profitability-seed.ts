import type { AdminProduct } from "@/lib/admin/types";
import {
  defaultDishPackaging,
  defaultOther,
  defaultProduction,
  defaultSettings,
  type IngredientPricePoint,
  type ProductCostCard,
  type ProfitabilitySettings,
} from "@/lib/admin/profitability";

const PRICES: Record<string, { price: number; qty: number; unit: "kg" | "L" | "piece" }> = {
  poulet: { price: 10, qty: 1, unit: "kg" },
  saumon: { price: 22, qty: 1, unit: "kg" },
  bœuf: { price: 18, qty: 1, unit: "kg" },
  boeuf: { price: 18, qty: 1, unit: "kg" },
  porc: { price: 9.5, qty: 1, unit: "kg" },
  agneau: { price: 19, qty: 1, unit: "kg" },
  crevette: { price: 24, qty: 1, unit: "kg" },
  poisson: { price: 16, qty: 1, unit: "kg" },
  riz: { price: 2.4, qty: 1, unit: "kg" },
  pâte: { price: 1.8, qty: 1, unit: "kg" },
  pate: { price: 1.8, qty: 1, unit: "kg" },
  pomme: { price: 1.6, qty: 1, unit: "kg" },
  carotte: { price: 1.4, qty: 1, unit: "kg" },
  oignon: { price: 1.2, qty: 1, unit: "kg" },
  tomate: { price: 2.8, qty: 1, unit: "kg" },
  crème: { price: 3.6, qty: 1, unit: "L" },
  creme: { price: 3.6, qty: 1, unit: "L" },
  lait: { price: 1.1, qty: 1, unit: "L" },
  beurre: { price: 8.5, qty: 1, unit: "kg" },
  huile: { price: 4.2, qty: 1, unit: "L" },
  fromage: { price: 12, qty: 1, unit: "kg" },
  œuf: { price: 0.28, qty: 1, unit: "piece" },
  oeuf: { price: 0.28, qty: 1, unit: "piece" },
  farine: { price: 1.1, qty: 1, unit: "kg" },
  sucre: { price: 1.3, qty: 1, unit: "kg" },
  chocolat: { price: 9, qty: 1, unit: "kg" },
  lentille: { price: 2.2, qty: 1, unit: "kg" },
  pois: { price: 2.4, qty: 1, unit: "kg" },
  épinard: { price: 4.5, qty: 1, unit: "kg" },
  epinard: { price: 4.5, qty: 1, unit: "kg" },
};

function matchPrice(name: string) {
  const lower = name.toLowerCase();
  const hit = Object.keys(PRICES).find((key) => lower.includes(key));
  return hit ? PRICES[hit]! : { price: 6, qty: 1, unit: "kg" as const };
}

function usedQty(name: string, weightGrams: number, index: number, total: number) {
  const lower = name.toLowerCase();
  if (lower.includes("œuf") || lower.includes("oeuf")) return 1;
  const share = index === 0 ? 0.38 : 0.45 / Math.max(1, total - 1);
  return Math.max(8, Math.round(weightGrams * share));
}

export function seedProductCostCard(product: AdminProduct, index: number): ProductCostCard {
  const names = (product.ingredients.length ? product.ingredients : ["Préparation maison"]).slice(0, 6);
  const ingredients = names.map((name, i) => {
    const catalog = matchPrice(name);
    const egg = catalog.unit === "piece";
    return {
      id: `${product.id}-ing-${i}`,
      name,
      quantityUsed: egg ? 1 : usedQty(name, product.weightGrams || 400, i, names.length),
      unit: egg ? ("piece" as const) : ("g" as const),
      purchasePrice: catalog.price,
      purchaseQty: catalog.qty,
      purchaseUnit: catalog.unit,
    };
  });
  const prep = product.kind === "plat" ? 5 + (index % 4) : 2 + (index % 3);
  return {
    productId: product.id,
    ingredients,
    packaging: defaultDishPackaging(),
    production: { ...defaultProduction(), prepMinutes: prep },
    other: defaultOther(),
  };
}

export function seedProfitability(products: AdminProduct[], now = new Date()) {
  const settings: ProfitabilitySettings = defaultSettings();
  const cards = products.map((product, index) => seedProductCostCard(product, index));
  const history: IngredientPricePoint[] = [];
  const seen = new Set<string>();
  cards.forEach((card) => {
    card.ingredients.forEach((line) => {
      const key = line.name.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      const older = new Date(now);
      older.setDate(older.getDate() - 32);
      history.push({
        id: `hist-${history.length + 1}`,
        name: line.name,
        at: older.toISOString(),
        price: roundish(line.purchasePrice * 0.92),
        qty: line.purchaseQty,
        unit: line.purchaseUnit,
      });
      history.push({
        id: `hist-${history.length + 1}`,
        name: line.name,
        at: now.toISOString(),
        price: line.purchasePrice,
        qty: line.purchaseQty,
        unit: line.purchaseUnit,
      });
    });
  });
  return { settings, cards, history };
}

function roundish(value: number) {
  return Math.round(value * 100) / 100;
}
