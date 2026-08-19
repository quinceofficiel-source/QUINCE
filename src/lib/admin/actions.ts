"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { can } from "@/lib/admin/permissions";
import { verifyPassword } from "@/lib/admin/crypto";
import { getAdminActor, requireAdmin } from "@/lib/admin/dal";
import { createAdminSession, destroyAdminSession } from "@/lib/admin/session";
import { getAdminStore } from "@/lib/admin/store";
import type { AdminProduct, EditorialCampaign, EditorialCampaignType, OrderStatus, Promotion, PromotionType } from "@/lib/admin/types";
import { sanitizeCard, sanitizeSettings } from "@/lib/admin/profitability";
import { saveProductUploads, uniqueImages } from "@/lib/admin/uploads";
import { ingestCheckoutOrder } from "@/lib/admin/storefront";
import type { CategoryId, CheckoutAddress, ServingType } from "@/types/product";
import { peopleLabel } from "@/lib/serving";

export type AuthState = { error?: string; sent?: boolean } | undefined;

export async function loginAdmin(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email.includes("@")) return { error: "Indiquez un email valide." };
  if (password.length < 8) return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  const store = getAdminStore();
  const user = store.staffByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "Email ou mot de passe incorrect." };
  }
  await createAdminSession(user.id, user.role);
  store.log(user, "Connexion", "session", user.id);
  redirect("/admin");
}

export async function logoutAdmin() {
  const actor = await getAdminActor();
  if (actor) getAdminStore().log(actor, "Déconnexion", "session", actor.id);
  await destroyAdminSession();
  redirect("/admin/login");
}

export async function requestPasswordReset(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email.includes("@")) return { error: "Indiquez un email valide." };
  return { sent: true };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const actor = await getAdminActor();
  if (!actor) redirect("/admin/login");
  const kitchenMove = can(actor.role, "kitchen") && (status === "en_preparation" || status === "prete");
  const deliveryMove = can(actor.role, "deliveries.write") && (status === "en_livraison" || status === "livree");
  if (!can(actor.role, "orders.write") && !kitchenMove && !deliveryMove) {
    throw new Error("Action non autorisée.");
  }
  if (status === "remboursee" && !can(actor.role, "orders.refund")) {
    throw new Error("Remboursement non autorisé.");
  }
  const order = getAdminStore().setOrderStatus(orderId, status, actor);
  if (!order) throw new Error("Commande introuvable.");
  revalidatePath("/admin", "layout");
}

export async function addOrderNote(orderId: string, formData: FormData) {
  const actor = await requireAdmin("orders.write");
  const note = String(formData.get("note") ?? "").trim();
  if (!note) return;
  getAdminStore().addOrderNote(orderId, note, actor);
  revalidatePath("/admin", "layout");
}

export async function assignOrderCourier(orderId: string, formData: FormData) {
  const actor = await requireAdmin("deliveries.write");
  const courierId = String(formData.get("courierId") ?? "");
  getAdminStore().assignCourier(orderId, courierId, actor);
  revalidatePath("/admin", "layout");
}

export async function saveProduct(formData: FormData) {
  const actor = await requireAdmin("products.write");
  const isNew = formData.get("isNew") === "1";
  const id = String(formData.get("id") || slugify(String(formData.get("name") ?? "plat")));
  const current = getAdminStore().product(id);
  const uploaded = await saveProductUploads(
    id,
    formData.getAll("files").filter((item): item is File => item instanceof File),
  );
  const images = uniqueImages([...formData.getAll("images").map(String), ...uploaded]);
  const cover = images[0] || current?.image || "/hero-banner.jpg";
  const price = Number(formData.get("price"));
  const promo = String(formData.get("promoPrice") ?? "").trim();
  const servingType: ServingType = formData.get("servingType") === "sharing" ? "sharing" : "individual";
  const servingsMin = Number(formData.get("servingsMin") || 0) || undefined;
  const servingsMax = Number(formData.get("servingsMax") || 0) || servingsMin;
  const includedSides = splitList(formData.get("includedSides"));
  const product: AdminProduct = {
    id,
    slug: id,
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    shortDescription: String(formData.get("shortDescription") ?? "").trim(),
    price,
    image: cover,
    images: images.length ? images : [cover],
    category: String(formData.get("category") ?? "maison") as CategoryId,
    tags: splitList(formData.get("tags")).length ? splitList(formData.get("tags")) : (current?.tags ?? []),
    calories: Number(formData.get("calories") ?? 0),
    protein: Number(formData.get("protein") ?? 0),
    rating: current?.rating ?? 5,
    reviews: current?.reviews ?? 0,
    ingredients: splitList(formData.get("ingredients")),
    allergens: splitList(formData.get("allergens")),
    portions:
      servingType === "sharing"
        ? [{ servings: 1, price, label: peopleLabel(servingsMin ?? 4, servingsMax ?? servingsMin ?? 4) }]
        : current?.portions ?? [{ servings: 1, price, label: "1 portion" }],
    isNew: formData.get("isNewFlag") === "on",
    isPopular: formData.get("isPopular") === "on",
    kind: current?.kind ?? "plat",
    isVegetarian: formData.get("isVegetarian") === "on",
    isComplete: current?.isComplete ?? true,
    reheating: current?.reheating ?? "4 min au micro-ondes.",
    conservation: String(formData.get("conservation") ?? current?.conservation ?? "3 jours au frais."),
    nutrition: {
      calories: Number(formData.get("calories") ?? 0),
      protein: Number(formData.get("protein") ?? 0),
      fat: Number(formData.get("fat") ?? 0),
      carbs: Number(formData.get("carbs") ?? 0),
      fiber: current?.nutrition.fiber ?? 0,
      salt: current?.nutrition.salt ?? 0,
    },
    extras: current?.extras ?? [],
    related: current?.related ?? [],
    servingType,
    servingsMin: servingType === "sharing" ? servingsMin ?? 4 : undefined,
    servingsMax: servingType === "sharing" ? servingsMax ?? servingsMin ?? 4 : undefined,
    includedSides: servingType === "sharing" ? includedSides : undefined,
    promoPrice: promo ? Number(promo) : null,
    stock: Number(formData.get("stock") ?? current?.stock ?? 0),
    minStock: Number(formData.get("minStock") ?? current?.minStock ?? 8),
    reserved: current?.reserved ?? 0,
    active: formData.get("active") === "on",
    weightGrams: Number(formData.get("weightGrams") ?? current?.weightGrams ?? 400),
  };
  if (!product.name) throw new Error("Le nom du plat est obligatoire.");
  getAdminStore().upsertProduct(product, actor, isNew);
  revalidatePath("/admin", "layout");
  redirect("/admin/products");
}

export async function toggleProduct(id: string, active: boolean) {
  const actor = await requireAdmin("products.write");
  getAdminStore().setProductActive(id, active, actor);
  revalidatePath("/admin", "layout");
}

export async function removeProduct(id: string) {
  const actor = await requireAdmin("products.write");
  getAdminStore().deleteProduct(id, actor);
  revalidatePath("/admin", "layout");
}

export async function updateStock(id: string, formData: FormData) {
  const actor = await requireAdmin("inventory.write");
  getAdminStore().setStock(id, Number(formData.get("stock")), actor);
  revalidatePath("/admin", "layout");
}

export async function addCustomerNote(id: string, formData: FormData) {
  const actor = await requireAdmin("customers.write");
  const note = String(formData.get("note") ?? "").trim();
  if (!note) return;
  getAdminStore().addCustomerNote(id, note, actor);
  revalidatePath("/admin", "layout");
}

export async function savePromotion(formData: FormData) {
  const actor = await requireAdmin("promotions.write");
  const isNew = formData.get("isNew") === "1";
  const promo: Promotion = {
    id: String(formData.get("id") || `promo-${Date.now()}`),
    code: String(formData.get("code") ?? "").trim().toUpperCase(),
    type: String(formData.get("type") ?? "percent") as PromotionType,
    value: Number(formData.get("value") ?? 0),
    startsAt: new Date(String(formData.get("startsAt"))).toISOString(),
    endsAt: new Date(String(formData.get("endsAt"))).toISOString(),
    minOrder: Number(formData.get("minOrder") ?? 0),
    maxUses: Number(formData.get("maxUses") ?? 0),
    used: Number(formData.get("used") ?? 0),
    eligible: formData.get("eligible") === "new" ? "new" : "all",
    active: formData.get("active") === "on",
  };
  if (!promo.code) throw new Error("Le code promo est obligatoire.");
  getAdminStore().upsertPromotion(promo, actor, isNew);
  revalidatePath("/admin", "layout");
}

export async function togglePromotion(id: string) {
  const actor = await requireAdmin("promotions.write");
  getAdminStore().togglePromotion(id, actor);
  revalidatePath("/admin", "layout");
}

export async function saveEditorialCampaign(formData: FormData) {
  const actor = await requireAdmin("promotions.write");
  const isNew = formData.get("isNew") === "1";
  const id = String(formData.get("id") || `edit-${Date.now()}`);
  const current = getAdminStore().editorialCampaign(id);
  const uploaded = await saveProductUploads(
    id,
    formData.getAll("file").filter((item): item is File => item instanceof File),
  );
  const image = uploaded[0] || String(formData.get("image") ?? "").trim() || current?.image || "/hero-banner.jpg";
  const theme = String(formData.get("theme") ?? "noir");
  const palette =
    theme === "jaune"
      ? { backgroundColor: "#ffd400", textColor: "#111111" }
      : theme === "blanc"
        ? { backgroundColor: "#ffffff", textColor: "#111111" }
        : { backgroundColor: "#111111", textColor: "#ffffff" };
  const campaign: EditorialCampaign = {
    id,
    title: String(formData.get("title") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    buttonLabel: String(formData.get("buttonLabel") ?? "").trim() || "Découvrir",
    buttonLink: String(formData.get("buttonLink") ?? "").trim() || "/",
    image,
    backgroundColor: palette.backgroundColor,
    textColor: palette.textColor,
    badge: String(formData.get("badge") ?? "").trim(),
    campaignType: (String(formData.get("campaignType") ?? "campaign") as EditorialCampaignType),
    startsAt: new Date(String(formData.get("startsAt") || Date.now())).toISOString(),
    endsAt: new Date(String(formData.get("endsAt") || Date.now() + 90 * 86400000)).toISOString(),
    order: Number(formData.get("order") ?? 1) || 1,
    active: formData.get("active") === "on",
  };
  if (!campaign.title) throw new Error("Le titre est obligatoire.");
  getAdminStore().upsertEditorialCampaign(campaign, actor, isNew);
  revalidatePath("/admin", "layout");
  revalidatePath("/");
  redirect("/admin/editorial");
}

export async function toggleEditorialCampaign(id: string) {
  const actor = await requireAdmin("promotions.write");
  getAdminStore().toggleEditorialCampaign(id, actor);
  revalidatePath("/admin", "layout");
  revalidatePath("/");
}

export async function removeEditorialCampaign(id: string) {
  const actor = await requireAdmin("promotions.write");
  getAdminStore().deleteEditorialCampaign(id, actor);
  revalidatePath("/admin", "layout");
  revalidatePath("/");
}

export async function markAdminNotificationsRead() {
  await requireAdmin();
  getAdminStore().markNotificationsRead();
  revalidatePath("/admin", "layout");
}

function splitList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || `plat-${Date.now()}`;
}

export async function saveProductCostCard(formData: FormData) {
  const actor = await requireAdmin("profitability");
  const productId = String(formData.get("productId") ?? "");
  if (!productId) throw new Error("Plat introuvable.");
  let parsed: unknown = {};
  try {
    parsed = JSON.parse(String(formData.get("payload") ?? "{}"));
  } catch {
    throw new Error("Données de coûts invalides.");
  }
  getAdminStore().saveCostCard(sanitizeCard(parsed, productId), actor);
  revalidatePath("/admin", "layout");
}

export async function saveProfitSettings(formData: FormData) {
  const actor = await requireAdmin("profitability");
  let parsed: unknown = {};
  try {
    parsed = JSON.parse(String(formData.get("payload") ?? "{}"));
  } catch {
    throw new Error("Paramètres invalides.");
  }
  getAdminStore().saveProfitSettings(sanitizeSettings(parsed), actor);
  revalidatePath("/admin", "layout");
}

export async function submitStorefrontOrder(input: {
  id: string;
  createdAt: string;
  lines: Array<{ productId: string; name: string; quantity: number; unitPrice: number }>;
  subtotal: number;
  shipping: number;
  total: number;
  address: CheckoutAddress;
  slotLabel: string;
}) {
  const order = ingestCheckoutOrder(input);
  revalidatePath("/admin", "layout");
  return { id: order.id };
}
