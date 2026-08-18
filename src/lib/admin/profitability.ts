export type MeasureUnit = "g" | "kg" | "ml" | "L" | "piece";
export type CostScope = "dish" | "order";
export type MarginStatus = "good" | "ok" | "bad";

export type RecipeIngredient = {
  id: string;
  name: string;
  quantityUsed: number;
  unit: MeasureUnit;
  purchasePrice: number;
  purchaseQty: number;
  purchaseUnit: MeasureUnit;
};

export type PackagingLine = {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  scope: CostScope;
};

export type ProductionCosts = {
  prepMinutes: number;
  hourlyRate: number;
  energy: number;
  storage: number;
  foodWastePercent: number;
  misc: number;
};

export type OtherCosts = {
  paymentPercent: number;
  paymentFixed: number;
  bankFees: number;
  marketing: number;
  promo: number;
  cac: number;
  losses: number;
  avgRefund: number;
  misc: number;
};

export type ProductCostCard = {
  productId: string;
  ingredients: RecipeIngredient[];
  packaging: PackagingLine[];
  production: ProductionCosts;
  other: OtherCosts;
};

export type ProfitabilitySettings = {
  targetMarginPercent: number;
  foodCostMinPercent: number;
  foodCostMaxPercent: number;
  vatRate: number;
  deliveryPerOrder: number;
  deliveryInternal: number;
  deliveryExternal: number;
  deliveryFuel: number;
  deliveryKmCost: number;
  allocateDeliveryToDishes: boolean;
  boxPackaging: PackagingLine[];
  boxDiscountPercent: Record<"5" | "7" | "10" | "14", number>;
};

export type IngredientPricePoint = {
  id: string;
  name: string;
  at: string;
  price: number;
  qty: number;
  unit: MeasureUnit;
};

export type DishCostSnapshot = {
  at: string;
  ingredients: number;
  packaging: number;
  production: number;
  payment: number;
  other: number;
  delivery: number;
  total: number;
  sellPriceTtc: number;
  sellPriceHt: number;
};

export type OrderCostSnapshot = {
  at: string;
  revenue: number;
  cost: number;
  margin: number;
  marginPercent: number;
  packagingOrder: number;
  delivery: number;
  lines: Array<{
    productId: string;
    name: string;
    quantity: number;
    snapshot: DishCostSnapshot;
  }>;
};

export type DishBreakdown = {
  ingredientLines: Array<RecipeIngredient & { cost: number }>;
  ingredients: number;
  packagingDish: number;
  packagingOrderShare: number;
  packaging: number;
  labor: number;
  energy: number;
  storage: number;
  waste: number;
  productionMisc: number;
  production: number;
  payment: number;
  other: number;
  delivery: number;
  total: number;
  sellPriceTtc: number;
  sellPriceHt: number;
  vat: number;
  marginEuro: number;
  foodCostPercent: number;
  marginPercent: number;
  suggestedPriceTtc: number;
  gapToTarget: number;
  status: MarginStatus;
  targetMarginPercent: number;
};

export type BoxBreakdown = {
  size: 5 | 7 | 10 | 14;
  dishesCost: number;
  packaging: number;
  delivery: number;
  totalCost: number;
  listPrice: number;
  discount: number;
  clientPrice: number;
  marginEuro: number;
  marginPercent: number;
};

export const UNIT_LABELS: Record<MeasureUnit, string> = {
  g: "g",
  kg: "kg",
  ml: "ml",
  L: "L",
  piece: "pièce",
};

export const PACKAGING_PRESETS = [
  "Barquette",
  "Couvercle",
  "Étiquette",
  "Sleeve / bandeau",
  "Sac",
  "Boîte de livraison",
  "Couverts",
  "Serviette",
  "Sauce / petit contenant",
  "Autre",
] as const;

export function round2(value: number) {
  return Math.round((Number.isFinite(value) ? value : 0) * 100) / 100;
}

export function toBaseQty(qty: number, unit: MeasureUnit) {
  if (unit === "kg" || unit === "L") return qty * 1000;
  return qty;
}

export function ingredientLineCost(line: RecipeIngredient) {
  const purchased = toBaseQty(line.purchaseQty, line.purchaseUnit);
  const used = toBaseQty(line.quantityUsed, line.unit);
  if (purchased <= 0) return 0;
  return round2((line.purchasePrice / purchased) * used);
}

export function laborCost(production: ProductionCosts) {
  return round2((production.hourlyRate / 60) * production.prepMinutes);
}

export function priceHt(ttc: number, vatRate: number) {
  return round2(ttc / (1 + vatRate / 100));
}

export function priceTtc(ht: number, vatRate: number) {
  return round2(ht * (1 + vatRate / 100));
}

export function suggestedPriceFromCost(totalCost: number, targetMarginPercent: number, vatRate: number) {
  const ratio = 1 - targetMarginPercent / 100;
  if (ratio <= 0.05) return priceTtc(totalCost * 2, vatRate);
  return priceTtc(totalCost / ratio, vatRate);
}

export function marginStatus(marginPercent: number, target: number): MarginStatus {
  if (marginPercent < 0 || marginPercent < target * 0.7) return "bad";
  if (marginPercent < target) return "ok";
  return "good";
}

export function defaultProduction(): ProductionCosts {
  return { prepMinutes: 5, hourlyRate: 20, energy: 0.08, storage: 0.05, foodWastePercent: 4, misc: 0.1 };
}

export function defaultOther(): OtherCosts {
  return {
    paymentPercent: 1.5,
    paymentFixed: 0.15,
    bankFees: 0.05,
    marketing: 0.12,
    promo: 0,
    cac: 0.08,
    losses: 0.05,
    avgRefund: 0,
    misc: 0,
  };
}

export function defaultSettings(): ProfitabilitySettings {
  return {
    targetMarginPercent: 60,
    foodCostMinPercent: 25,
    foodCostMaxPercent: 32,
    vatRate: 10,
    deliveryPerOrder: 6,
    deliveryInternal: 0,
    deliveryExternal: 4.8,
    deliveryFuel: 0.9,
    deliveryKmCost: 0.3,
    allocateDeliveryToDishes: false,
    boxPackaging: [
      { id: "box-pack-1", name: "Grande boîte Quince", unitPrice: 2.5, quantity: 1, scope: "order" },
      { id: "box-pack-2", name: "Sac isotherme", unitPrice: 0.45, quantity: 1, scope: "order" },
    ],
    boxDiscountPercent: { "5": 5, "7": 8, "10": 12, "14": 15 },
  };
}

export function defaultDishPackaging(): PackagingLine[] {
  return [
    { id: "p-barq", name: "Barquette", unitPrice: 0.48, quantity: 1, scope: "dish" },
    { id: "p-couv", name: "Couvercle", unitPrice: 0.12, quantity: 1, scope: "dish" },
    { id: "p-etiq", name: "Étiquette", unitPrice: 0.1, quantity: 1, scope: "dish" },
    { id: "p-sleeve", name: "Sleeve / bandeau", unitPrice: 0.08, quantity: 1, scope: "dish" },
  ];
}

export type BreakdownOverrides = {
  sellPriceTtc?: number;
  ingredientsMultiplier?: number;
  packagingMultiplier?: number;
  ingredientsAbsolute?: number;
  packagingAbsolute?: number;
  delivery?: number;
  promo?: number;
};

export function computeDishBreakdown(
  card: ProductCostCard,
  sellPriceTtc: number,
  settings: ProfitabilitySettings,
  overrides: BreakdownOverrides = {},
): DishBreakdown {
  const price = overrides.sellPriceTtc ?? sellPriceTtc;
  const vatRate = settings.vatRate;
  const ht = priceHt(price, vatRate);
  const ingredientLines = card.ingredients.map((line) => ({
    ...line,
    cost: round2(ingredientLineCost(line) * (overrides.ingredientsMultiplier ?? 1)),
  }));
  const ingredients = overrides.ingredientsAbsolute ?? round2(ingredientLines.reduce((sum, line) => sum + line.cost, 0));
  const packagingDish = round2(
    overrides.packagingAbsolute ??
      card.packaging
        .filter((line) => line.scope === "dish")
        .reduce((sum, line) => sum + line.unitPrice * line.quantity, 0) * (overrides.packagingMultiplier ?? 1),
  );
  const production = { ...defaultProduction(), ...card.production };
  const extras = { ...defaultOther(), ...card.other };
  const labor = laborCost(production);
  const waste = round2(ingredients * (production.foodWastePercent / 100));
  const productionTotal = round2(labor + production.energy + production.storage + waste + production.misc);
  const payment = round2(price * (extras.paymentPercent / 100) + extras.paymentFixed);
  const promo = overrides.promo ?? extras.promo;
  const other = round2(
    payment + extras.bankFees + extras.marketing + promo + extras.cac + extras.losses + extras.avgRefund + extras.misc,
  );
  const delivery = round2(overrides.delivery ?? 0);
  const total = round2(ingredients + packagingDish + productionTotal + other + delivery);
  const marginEuro = round2(ht - total);
  const marginPercent = ht > 0 ? round2((marginEuro / ht) * 100) : 0;
  const foodCostPercent = ht > 0 ? round2((ingredients / ht) * 100) : 0;
  const suggestedPriceTtc = suggestedPriceFromCost(total - delivery, settings.targetMarginPercent, vatRate);
  return {
    ingredientLines,
    ingredients,
    packagingDish,
    packagingOrderShare: 0,
    packaging: packagingDish,
    labor,
    energy: production.energy,
    storage: production.storage,
    waste,
    productionMisc: production.misc,
    production: productionTotal,
    payment,
    other,
    delivery,
    total,
    sellPriceTtc: price,
    sellPriceHt: ht,
    vat: round2(price - ht),
    marginEuro,
    marginPercent,
    foodCostPercent,
    suggestedPriceTtc,
    gapToTarget: round2(suggestedPriceTtc - price),
    status: marginStatus(marginPercent, settings.targetMarginPercent),
    targetMarginPercent: settings.targetMarginPercent,
  };
}

export function snapshotFromBreakdown(breakdown: DishBreakdown, at = new Date().toISOString()): DishCostSnapshot {
  return {
    at,
    ingredients: breakdown.ingredients,
    packaging: breakdown.packaging,
    production: breakdown.production,
    payment: breakdown.payment,
    other: round2(breakdown.other - breakdown.payment),
    delivery: breakdown.delivery,
    total: breakdown.total,
    sellPriceTtc: breakdown.sellPriceTtc,
    sellPriceHt: breakdown.sellPriceHt,
  };
}

export function computeOrderSnapshot(
  lines: Array<{ productId: string; name: string; quantity: number; unitPrice: number }>,
  orderTotal: number,
  getCard: (productId: string) => ProductCostCard | null,
  getPrice: (productId: string) => number,
  settings: ProfitabilitySettings,
  at = new Date().toISOString(),
): OrderCostSnapshot {
  const dishCount = Math.max(1, lines.reduce((sum, line) => sum + line.quantity, 0));
  const packByName = new Map<string, number>();
  const addPack = (line: PackagingLine) => {
    if (line.scope !== "order") return;
    const key = line.name.trim().toLowerCase();
    if (!key) return;
    packByName.set(key, Math.max(packByName.get(key) ?? 0, round2(line.unitPrice * line.quantity)));
  };
  settings.boxPackaging.forEach(addPack);
  lines.forEach((line) => {
    (getCard(line.productId)?.packaging ?? []).forEach(addPack);
  });
  const orderPackaging = round2([...packByName.values()].reduce((sum, value) => sum + value, 0));
  const delivery = settings.deliveryPerOrder;
  const deliveryShare = settings.allocateDeliveryToDishes ? round2(delivery / dishCount) : 0;
  const packagingShare = round2(orderPackaging / dishCount);

  const snapLines = lines.map((line) => {
    const card = getCard(line.productId) ?? emptyCard(line.productId);
    const breakdown = computeDishBreakdown(card, line.unitPrice || getPrice(line.productId), settings, {
      delivery: deliveryShare,
    });
    breakdown.packagingOrderShare = packagingShare;
    breakdown.packaging = round2(breakdown.packagingDish + packagingShare);
    breakdown.total = round2(breakdown.total + packagingShare);
    breakdown.marginEuro = round2(breakdown.sellPriceHt - breakdown.total);
    breakdown.marginPercent = breakdown.sellPriceHt > 0 ? round2((breakdown.marginEuro / breakdown.sellPriceHt) * 100) : 0;
    return {
      productId: line.productId,
      name: line.name,
      quantity: line.quantity,
      snapshot: snapshotFromBreakdown(breakdown, at),
    };
  });

  const dishesCost = round2(snapLines.reduce((sum, line) => sum + line.snapshot.total * line.quantity, 0));
  const extra = settings.allocateDeliveryToDishes ? 0 : delivery;
  const extraPack = settings.allocateDeliveryToDishes ? 0 : orderPackaging;
  const cost = round2(dishesCost + extra + extraPack);
  const margin = round2(orderTotal - cost);
  return {
    at,
    revenue: round2(orderTotal),
    cost,
    margin,
    marginPercent: orderTotal > 0 ? round2((margin / orderTotal) * 100) : 0,
    packagingOrder: orderPackaging,
    delivery,
    lines: snapLines,
  };
}

export function computeBoxBreakdown(
  size: 5 | 7 | 10 | 14,
  dishCosts: number[],
  dishPrices: number[],
  settings: ProfitabilitySettings,
): BoxBreakdown {
  const dishesCost = round2(dishCosts.slice(0, size).reduce((sum, value) => sum + value, 0));
  const listPrice = round2(dishPrices.slice(0, size).reduce((sum, value) => sum + value, 0));
  const packaging = round2(
    settings.boxPackaging.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
  );
  const delivery = settings.deliveryPerOrder;
  const totalCost = round2(dishesCost + packaging + delivery);
  const discount = settings.boxDiscountPercent[String(size) as "5" | "7" | "10" | "14"] ?? 0;
  const clientPrice = round2(listPrice * (1 - discount / 100));
  const marginEuro = round2(priceHt(clientPrice, settings.vatRate) - totalCost);
  return {
    size,
    dishesCost,
    packaging,
    delivery,
    totalCost,
    listPrice,
    discount,
    clientPrice,
    marginEuro,
    marginPercent: clientPrice > 0 ? round2((marginEuro / priceHt(clientPrice, settings.vatRate)) * 100) : 0,
  };
}

export function emptyCard(productId: string): ProductCostCard {
  return {
    productId,
    ingredients: [],
    packaging: defaultDishPackaging(),
    production: defaultProduction(),
    other: defaultOther(),
  };
}

export type ProfitAlert = {
  id: string;
  tone: "bad" | "ok" | "info";
  title: string;
  body: string;
  href: string;
};

const UNITS: MeasureUnit[] = ["g", "kg", "ml", "L", "piece"];

function money(value: unknown, fallback = 0) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return round2(n);
}

function unitOf(value: unknown, fallback: MeasureUnit = "g"): MeasureUnit {
  return UNITS.includes(value as MeasureUnit) ? (value as MeasureUnit) : fallback;
}

function idOf(value: unknown, prefix: string, index: number) {
  const text = String(value ?? "").trim();
  return text || `${prefix}-${index + 1}`;
}

export function deliveryTotal(settings: Pick<ProfitabilitySettings, "deliveryInternal" | "deliveryExternal" | "deliveryFuel" | "deliveryKmCost" | "deliveryPerOrder">) {
  const parts = round2(settings.deliveryInternal + settings.deliveryExternal + settings.deliveryFuel + settings.deliveryKmCost);
  return parts > 0 ? parts : money(settings.deliveryPerOrder);
}

export function sanitizeCard(raw: unknown, productId: string): ProductCostCard {
  const data = raw && typeof raw === "object" ? (raw as Partial<ProductCostCard>) : {};
  const ingredients = Array.isArray(data.ingredients)
    ? data.ingredients
        .map((line, index) => ({
          id: idOf(line?.id, "ing", index),
          name: String(line?.name ?? "").trim(),
          quantityUsed: money(line?.quantityUsed),
          unit: unitOf(line?.unit),
          purchasePrice: money(line?.purchasePrice),
          purchaseQty: money(line?.purchaseQty, 1) || 1,
          purchaseUnit: unitOf(line?.purchaseUnit, "kg"),
        }))
        .filter((line) => line.name)
    : [];
  const packaging = Array.isArray(data.packaging)
    ? data.packaging
        .map((line, index) => ({
          id: idOf(line?.id, "pack", index),
          name: String(line?.name ?? "").trim() || PACKAGING_PRESETS[index % PACKAGING_PRESETS.length],
          unitPrice: money(line?.unitPrice),
          quantity: money(line?.quantity, 1),
          scope: line?.scope === "order" ? ("order" as const) : ("dish" as const),
        }))
        .filter((line) => line.name)
    : defaultDishPackaging();
  const production = { ...defaultProduction(), ...(data.production ?? {}) };
  const other = { ...defaultOther(), ...(data.other ?? {}) };
  return {
    productId,
    ingredients,
    packaging: packaging.length ? packaging : defaultDishPackaging(),
    production: {
      prepMinutes: money(production.prepMinutes, 5),
      hourlyRate: money(production.hourlyRate, 20),
      energy: money(production.energy),
      storage: money(production.storage),
      foodWastePercent: money(production.foodWastePercent),
      misc: money(production.misc),
    },
    other: {
      paymentPercent: money(other.paymentPercent),
      paymentFixed: money(other.paymentFixed),
      bankFees: money(other.bankFees),
      marketing: money(other.marketing),
      promo: money(other.promo),
      cac: money(other.cac),
      losses: money(other.losses),
      avgRefund: money(other.avgRefund),
      misc: money(other.misc),
    },
  };
}

export function sanitizeSettings(raw: unknown): ProfitabilitySettings {
  const data = raw && typeof raw === "object" ? (raw as Partial<ProfitabilitySettings>) : {};
  const base = defaultSettings();
  const boxPackaging = Array.isArray(data.boxPackaging)
    ? data.boxPackaging.map((line, index) => ({
        id: idOf(line?.id, "box-pack", index),
        name: String(line?.name ?? "").trim() || `Packaging box ${index + 1}`,
        unitPrice: money(line?.unitPrice),
        quantity: money(line?.quantity, 1),
        scope: "order" as const,
      }))
    : base.boxPackaging;
  const discounts = { ...base.boxDiscountPercent, ...(data.boxDiscountPercent ?? {}) };
  const next: ProfitabilitySettings = {
    targetMarginPercent: Math.min(90, money(data.targetMarginPercent, base.targetMarginPercent)),
    foodCostMinPercent: money(data.foodCostMinPercent, base.foodCostMinPercent),
    foodCostMaxPercent: money(data.foodCostMaxPercent, base.foodCostMaxPercent),
    vatRate: money(data.vatRate, base.vatRate),
    deliveryInternal: money(data.deliveryInternal, base.deliveryInternal),
    deliveryExternal: money(data.deliveryExternal, base.deliveryExternal),
    deliveryFuel: money(data.deliveryFuel, base.deliveryFuel),
    deliveryKmCost: money(data.deliveryKmCost, base.deliveryKmCost),
    deliveryPerOrder: money(data.deliveryPerOrder, base.deliveryPerOrder),
    allocateDeliveryToDishes: Boolean(data.allocateDeliveryToDishes),
    boxPackaging,
    boxDiscountPercent: {
      "5": money(discounts["5"], 5),
      "7": money(discounts["7"], 8),
      "10": money(discounts["10"], 12),
      "14": money(discounts["14"], 15),
    },
  };
  next.deliveryPerOrder = deliveryTotal(next);
  return next;
}

export function normalizeSettings(settings: ProfitabilitySettings): ProfitabilitySettings {
  return sanitizeSettings(settings);
}
