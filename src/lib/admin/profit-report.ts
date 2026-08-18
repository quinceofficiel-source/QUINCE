import {
  computeBoxBreakdown,
  computeDishBreakdown,
  computeOrderSnapshot,
  emptyCard,
  normalizeSettings,
  round2,
  type DishBreakdown,
  type MarginStatus,
  type ProductCostCard,
  type ProfitAlert,
  type ProfitabilitySettings,
} from "@/lib/admin/profitability";
import type { IngredientPricePoint } from "@/lib/admin/profitability";
import type { AdminOrder, AdminProduct } from "@/lib/admin/types";

export type DishProfitRow = {
  productId: string;
  name: string;
  category: string;
  price: number;
  ingredients: number;
  packaging: number;
  production: number;
  other: number;
  total: number;
  marginEuro: number;
  marginPercent: number;
  foodCostPercent: number;
  suggestedPriceTtc: number;
  status: MarginStatus;
  breakdown: DishBreakdown;
};

export function sellPrice(product: AdminProduct) {
  return product.promoPrice ?? product.price;
}

export function rowsForProducts(
  products: AdminProduct[],
  cards: ProductCostCard[],
  settings: ProfitabilitySettings,
): DishProfitRow[] {
  const map = new Map(cards.map((card) => [card.productId, card]));
  const normalized = normalizeSettings(settings);
  return products
    .map((product) => {
      const card = map.get(product.id) ?? emptyCard(product.id);
      const delivery = normalized.allocateDeliveryToDishes ? normalized.deliveryPerOrder : 0;
      const breakdown = computeDishBreakdown(card, sellPrice(product), normalized, { delivery });
      return {
        productId: product.id,
        name: product.name,
        category: product.category,
        price: sellPrice(product),
        ingredients: breakdown.ingredients,
        packaging: breakdown.packaging,
        production: breakdown.production,
        other: breakdown.other,
        total: breakdown.total,
        marginEuro: breakdown.marginEuro,
        marginPercent: breakdown.marginPercent,
        foodCostPercent: breakdown.foodCostPercent,
        suggestedPriceTtc: breakdown.suggestedPriceTtc,
        status: breakdown.status,
        breakdown,
      };
    });
}

export function orderEconomics(order: AdminOrder, getCard: (id: string) => ProductCostCard | null, getPrice: (id: string) => number, settings: ProfitabilitySettings) {
  if (order.costSnapshot) {
    return { ...order.costSnapshot, estimated: false as const };
  }
  return {
    ...computeOrderSnapshot(order.lines, order.total, getCard, getPrice, settings, order.createdAt),
    estimated: true as const,
  };
}

export function todayProfitKpis(orders: AdminOrder[], getCard: (id: string) => ProductCostCard | null, getPrice: (id: string) => number, settings: ProfitabilitySettings) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const today = orders.filter((order) => {
    if (order.status === "annulee" || order.status === "remboursee") return false;
    return new Date(order.createdAt) >= start;
  });
  let revenue = 0;
  let ingredients = 0;
  let packaging = 0;
  let delivery = 0;
  let cost = 0;
  today.forEach((order) => {
    const snap = orderEconomics(order, getCard, getPrice, settings);
    revenue += snap.revenue;
    cost += snap.cost;
    delivery += snap.delivery;
    packaging += snap.packagingOrder;
    snap.lines.forEach((line) => {
      ingredients += line.snapshot.ingredients * line.quantity;
      packaging += line.snapshot.packaging * line.quantity;
    });
  });
  const margin = round2(revenue - cost);
  return {
    orders: today.length,
    revenue: round2(revenue),
    ingredients: round2(ingredients),
    packaging: round2(packaging),
    delivery: round2(delivery),
    cost: round2(cost),
    margin,
    marginPercent: revenue > 0 ? round2((margin / revenue) * 100) : 0,
  };
}

export function monthlySeries(orders: AdminOrder[], getCard: (id: string) => ProductCostCard | null, getPrice: (id: string) => number, settings: ProfitabilitySettings) {
  const buckets = new Map<string, { revenue: number; cost: number; margin: number; orders: number }>();
  orders
    .filter((order) => order.status !== "annulee" && order.status !== "remboursee")
    .forEach((order) => {
      const key = order.createdAt.slice(0, 7);
      const snap = orderEconomics(order, getCard, getPrice, settings);
      const current = buckets.get(key) ?? { revenue: 0, cost: 0, margin: 0, orders: 0 };
      current.revenue += snap.revenue;
      current.cost += snap.cost;
      current.margin += snap.margin;
      current.orders += 1;
      buckets.set(key, current);
    });
  return [...buckets.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([date, value]) => ({
      date,
      revenue: round2(value.revenue),
      cost: round2(value.cost),
      margin: round2(value.margin),
      orders: value.orders,
      marginPercent: value.revenue > 0 ? round2((value.margin / value.revenue) * 100) : 0,
    }));
}

export function ingredientTrend(history: IngredientPricePoint[]) {
  const byName = new Map<string, IngredientPricePoint[]>();
  history.forEach((point) => {
    const key = point.name.toLowerCase();
    const list = byName.get(key) ?? [];
    list.push(point);
    byName.set(key, list);
  });
  return [...byName.entries()]
    .map(([key, points]) => {
      const sorted = points.slice().sort((a, b) => a.at.localeCompare(b.at));
      const last = sorted.at(-1)!;
      const prev = sorted.at(-2);
      const change = prev && prev.price > 0 ? round2(((last.price - prev.price) / prev.price) * 100) : 0;
      return { name: last.name, key, last, prev, change, points: sorted };
    })
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
}

export function marginByCategory(rows: DishProfitRow[]) {
  const map = new Map<string, { margin: number; count: number }>();
  rows.forEach((row) => {
    const current = map.get(row.category) ?? { margin: 0, count: 0 };
    current.margin += row.marginPercent;
    current.count += 1;
    map.set(row.category, current);
  });
  return [...map.entries()]
    .map(([label, value]) => ({
      label,
      value: value.count ? round2(value.margin / value.count) : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

export function boxRows(rows: DishProfitRow[], settings: ProfitabilitySettings) {
  const ranked = rows.slice().sort((a, b) => b.marginPercent - a.marginPercent);
  const costs = ranked.map((row) => row.total);
  const prices = ranked.map((row) => row.price);
  return ([5, 7, 10, 14] as const).map((size) => computeBoxBreakdown(size, costs, prices, settings));
}

export function buildProfitAlerts(
  rows: DishProfitRow[],
  history: IngredientPricePoint[],
  settings: ProfitabilitySettings,
): ProfitAlert[] {
  const alerts: ProfitAlert[] = [];
  rows.forEach((row) => {
    if (row.marginEuro < 0) {
      alerts.push({
        id: `loss-${row.productId}`,
        tone: "bad",
        title: "Ce plat est vendu à perte",
        body: `${row.name} : marge ${row.marginPercent.toFixed(1).replace(".", ",")} %.`,
        href: `/admin/profitability/${row.productId}`,
      });
    } else if (row.marginPercent < 40) {
      alerts.push({
        id: `low-${row.productId}`,
        tone: "ok",
        title: `Marge de ${row.name} passée sous 40 %`,
        body: `Marge actuelle ${row.marginPercent.toFixed(1).replace(".", ",")} % · objectif ${settings.targetMarginPercent} %.`,
        href: `/admin/profitability/${row.productId}`,
      });
    }
    const packShare = row.price > 0 ? (row.packaging / row.price) * 100 : 0;
    if (packShare >= 9) {
      alerts.push({
        id: `pack-${row.productId}`,
        tone: "ok",
        title: "Packaging élevé",
        body: `Le packaging représente désormais ${packShare.toFixed(0)} % du prix de vente de ${row.name}.`,
        href: `/admin/profitability/${row.productId}`,
      });
    }
  });
  ingredientTrend(history).forEach((item) => {
    if (item.change >= 12) {
      alerts.push({
        id: `ing-${item.key}`,
        tone: "info",
        title: `Le prix de ${item.name} a augmenté de ${Math.round(item.change)} %`,
        body: `${item.prev ? `${item.prev.price.toFixed(2).replace(".", ",")} € → ` : ""}${item.last.price.toFixed(2).replace(".", ",")} € / ${item.last.unit}.`,
        href: "/admin/profitability",
      });
    }
  });
  return alerts.slice(0, 12);
}

export function foodCostTone(percent: number, min: number, max: number) {
  if (percent < min) return "ok" as const;
  if (percent > max) return "bad" as const;
  return "good" as const;
}
