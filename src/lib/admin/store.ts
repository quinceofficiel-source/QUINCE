import { createInitialState } from "@/lib/admin/seed";
import { publishLiveOrder } from "@/lib/admin/live";
import { readPersistedState, storeFileMtime, writePersistedState } from "@/lib/admin/persist";
import { seedProductCostCard, seedProfitability } from "@/lib/admin/profitability-seed";
import {
  computeDishBreakdown,
  computeOrderSnapshot,
  defaultSettings,
  type ProductCostCard,
  type ProfitabilitySettings,
} from "@/lib/admin/profitability";
import type {
  AdminLog,
  AdminNotification,
  AdminOrder,
  AdminProduct,
  AdminState,
  DashboardStats,
  OrderStatus,
  Promotion,
  StaffUser,
} from "@/lib/admin/types";

const globalForStore = globalThis as typeof globalThis & { __quinceAdminStoreV3?: AdminStore };

class AdminStore {
  private state: AdminState;
  private diskMtime = 0;

  constructor() {
    const persisted = readPersistedState();
    this.state = persisted ?? createInitialState();
    const patched = this.ensureProfitability();
    if (!persisted || patched) this.persist();
    else this.diskMtime = storeFileMtime();
  }

  syncFromDisk() {
    const mtime = storeFileMtime();
    if (!mtime || mtime <= this.diskMtime) return;
    const next = readPersistedState();
    if (!next) return;
    this.state = next;
    this.diskMtime = mtime;
    if (this.ensureProfitability()) this.persist();
  }

  private persist() {
    writePersistedState(this.state);
    this.diskMtime = storeFileMtime() || Date.now();
  }

  private ensureProfitability() {
    let changed = false;
    if (!this.state.profitability) {
      this.state.profitability = seedProfitability(this.state.products);
      return true;
    }
    const known = new Set(this.state.profitability.cards.map((card) => card.productId));
    this.state.products.forEach((product, index) => {
      if (!known.has(product.id)) {
        this.state.profitability.cards.push(seedProductCostCard(product, index));
        changed = true;
      }
    });
    if (!this.state.profitability.settings) {
      this.state.profitability.settings = defaultSettings();
      changed = true;
    } else {
      const merged: ProfitabilitySettings = {
        ...defaultSettings(),
        ...this.state.profitability.settings,
        boxDiscountPercent: {
          ...defaultSettings().boxDiscountPercent,
          ...this.state.profitability.settings.boxDiscountPercent,
        },
      };
      if (JSON.stringify(merged) !== JSON.stringify(this.state.profitability.settings)) {
        this.state.profitability.settings = merged;
        changed = true;
      }
    }
    if (!this.state.profitability.history) {
      this.state.profitability.history = [];
      changed = true;
    }
    return changed;
  }

  snapshot(): AdminState {
    return structuredClone(this.state);
  }

  staffByEmail(email: string) {
    return this.state.staff.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.active) ?? null;
  }

  staffById(id: string) {
    return this.state.staff.find((item) => item.id === id) ?? null;
  }

  staffList() {
    return structuredClone(this.state.staff);
  }

  products() {
    return structuredClone(this.state.products);
  }

  product(id: string) {
    return this.state.products.find((item) => item.id === id) ?? null;
  }

  orders() {
    return structuredClone(this.state.orders).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }

  order(id: string) {
    return this.state.orders.find((item) => item.id === id) ?? null;
  }

  customers() {
    return structuredClone(this.state.customers);
  }

  customer(id: string) {
    return this.state.customers.find((item) => item.id === id) ?? null;
  }

  couriers() {
    return structuredClone(this.state.couriers);
  }

  promotions() {
    return structuredClone(this.state.promotions);
  }

  logs() {
    return structuredClone(this.state.logs).sort((a, b) => +new Date(b.at) - +new Date(a.at));
  }

  notifications() {
    return structuredClone(this.state.notifications).sort((a, b) => +new Date(b.at) - +new Date(a.at));
  }

  log(actor: StaffUser, action: string, entity: string, entityId: string) {
    const entry: AdminLog = {
      id: `log-${Date.now()}-${Math.round(Math.random() * 999)}`,
      at: new Date().toISOString(),
      actorId: actor.id,
      actorName: actor.name,
      action,
      entity,
      entityId,
    };
    this.state.logs.unshift(entry);
    this.persist();
  }

  setOrderStatus(id: string, status: OrderStatus, actor: StaffUser, note?: string) {
    const order = this.state.orders.find((item) => item.id === id);
    if (!order) return null;
    order.status = status;
    if (status === "remboursee") order.paymentStatus = "refunded";
    if (status === "annulee" && order.paymentStatus === "paid") {
      /* payment stays paid until refund */
    }
    order.history.push({ status, at: new Date().toISOString(), by: actor.name, note });
    this.log(actor, `Statut → ${status}`, "order", id);
    this.persist();
    return structuredClone(order);
  }

  addOrderNote(id: string, note: string, actor: StaffUser) {
    const order = this.state.orders.find((item) => item.id === id);
    if (!order) return null;
    order.internalNotes.push(note);
    this.log(actor, "Note interne", "order", id);
    this.persist();
    return structuredClone(order);
  }

  assignCourier(id: string, courierId: string, actor: StaffUser) {
    const order = this.state.orders.find((item) => item.id === id);
    const courier = this.state.couriers.find((item) => item.id === courierId);
    if (!order || !courier) return null;
    order.courierId = courier.id;
    order.courierName = courier.name;
    this.log(actor, `Livreur ${courier.name}`, "order", id);
    this.persist();
    return structuredClone(order);
  }

  upsertProduct(input: AdminProduct, actor: StaffUser, isNew: boolean) {
    const index = this.state.products.findIndex((item) => item.id === input.id);
    if (index >= 0) this.state.products[index] = input;
    else this.state.products.unshift(input);
    this.log(actor, isNew ? "Création plat" : "Modification plat", "product", input.id);
    this.ensureProfitability();
    if (!this.state.profitability.cards.some((card) => card.productId === input.id)) {
      this.state.profitability.cards.push(seedProductCostCard(input, this.state.products.length));
    }
    this.persist();
    return structuredClone(input);
  }

  setProductActive(id: string, active: boolean, actor: StaffUser) {
    const product = this.state.products.find((item) => item.id === id);
    if (!product) return null;
    product.active = active;
    this.log(actor, active ? "Activation plat" : "Désactivation plat", "product", id);
    this.persist();
    return structuredClone(product);
  }

  deleteProduct(id: string, actor: StaffUser) {
    const before = this.state.products.length;
    this.state.products = this.state.products.filter((item) => item.id !== id);
    if (this.state.products.length === before) return false;
    this.log(actor, "Suppression plat", "product", id);
    this.persist();
    return true;
  }

  setStock(id: string, stock: number, actor: StaffUser) {
    const product = this.state.products.find((item) => item.id === id);
    if (!product) return null;
    product.stock = Math.max(0, Math.round(stock));
    this.log(actor, `Stock → ${product.stock}`, "product", id);
    this.persist();
    return structuredClone(product);
  }

  addCustomerNote(id: string, note: string, actor: StaffUser) {
    const customer = this.state.customers.find((item) => item.id === id);
    if (!customer) return null;
    customer.notes.push(note);
    this.log(actor, "Note client", "customer", id);
    this.persist();
    return structuredClone(customer);
  }

  upsertPromotion(promo: Promotion, actor: StaffUser, isNew: boolean) {
    const index = this.state.promotions.findIndex((item) => item.id === promo.id);
    if (index >= 0) this.state.promotions[index] = promo;
    else this.state.promotions.unshift(promo);
    this.log(actor, isNew ? "Création promo" : "Modification promo", "promotion", promo.id);
    this.persist();
    return structuredClone(promo);
  }

  togglePromotion(id: string, actor: StaffUser) {
    const promo = this.state.promotions.find((item) => item.id === id);
    if (!promo) return null;
    promo.active = !promo.active;
    this.log(actor, promo.active ? "Activation promo" : "Désactivation promo", "promotion", id);
    this.persist();
    return structuredClone(promo);
  }

  markNotificationsRead() {
    this.state.notifications.forEach((item) => {
      item.read = true;
    });
    this.persist();
  }

  ingestStorefrontOrder(input: {
    id: string;
    createdAt: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: string;
    city: string;
    zip: string;
    instructions: string;
    slotLabel: string;
    lines: Array<{ productId: string; name: string; quantity: number; unitPrice: number; allergens: string[] }>;
    subtotal: number;
    shipping: number;
    total: number;
  }) {
    this.ensureProfitability();
    const existing = this.state.orders.find((item) => item.id === input.id);
    if (existing) return structuredClone(existing);

    let customer = this.state.customers.find(
      (item) => item.email.toLowerCase() === input.customerEmail.toLowerCase() || item.phone === input.customerPhone,
    );
    if (!customer) {
      const [firstName, ...rest] = input.customerName.split(" ");
      customer = {
        id: `cus-${Date.now()}`,
        firstName: firstName || "Client",
        lastName: rest.join(" ") || "",
        email: input.customerEmail,
        phone: input.customerPhone,
        createdAt: input.createdAt,
        favoriteProductIds: [],
        addresses: [{ label: "Domicile", street: input.address, zip: input.zip, city: input.city }],
        credit: 0,
        promoCodesUsed: [],
        notes: [],
      };
      this.state.customers.unshift(customer);
    }

    const order: AdminOrder = {
      id: input.id,
      createdAt: input.createdAt,
      customerId: customer.id,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      address: input.address,
      city: input.city,
      zip: input.zip,
      instructions: input.instructions,
      slotLabel: input.slotLabel,
      lines: input.lines,
      subtotal: input.subtotal,
      discount: 0,
      shipping: input.shipping,
      total: input.total,
      paymentMethod: "card",
      paymentStatus: "paid",
      status: "nouvelle",
      courierId: null,
      courierName: null,
      internalNotes: [],
      history: [{ status: "nouvelle", at: input.createdAt, by: "Boutique" }],
      promoCode: null,
      costSnapshot: computeOrderSnapshot(
        input.lines,
        input.total,
        (id) => this.costCard(id),
        (id) => this.state.products.find((item) => item.id === id)?.price ?? 0,
        this.state.profitability.settings,
        input.createdAt,
      ),
    };
    this.state.orders.unshift(order);
    const notification: AdminNotification = {
      id: `ntf-order-${order.id}`,
      type: "order",
      title: "Nouvelle commande",
      body: `${order.customerName} · ${order.total.toFixed(2).replace(".", ",")} €`,
      href: `/admin/orders/${order.id}`,
      at: input.createdAt,
      read: false,
      orderId: order.id,
      customerName: order.customerName,
      amount: order.total,
    };
    this.state.notifications.unshift(notification);
    this.persist();
    publishLiveOrder(notification);
    return structuredClone(order);
  }

  profitability() {
    this.ensureProfitability();
    return structuredClone(this.state.profitability);
  }

  costCard(productId: string) {
    this.ensureProfitability();
    return this.state.profitability.cards.find((card) => card.productId === productId) ?? null;
  }

  saveCostCard(card: ProductCostCard, actor: StaffUser) {
    this.ensureProfitability();
    const current = this.state.profitability.cards.find((item) => item.productId === card.productId);
    current?.ingredients.forEach((prev) => {
      const next = card.ingredients.find((item) => item.name.toLowerCase() === prev.name.toLowerCase());
      if (!next) return;
      if (Math.abs(next.purchasePrice - prev.purchasePrice) < 0.01) return;
      this.state.profitability.history.push({
        id: `hist-${Date.now()}-${Math.round(Math.random() * 999)}`,
        name: next.name,
        at: new Date().toISOString(),
        price: next.purchasePrice,
        qty: next.purchaseQty,
        unit: next.purchaseUnit,
      });
      const rise = prev.purchasePrice > 0 ? ((next.purchasePrice - prev.purchasePrice) / prev.purchasePrice) * 100 : 0;
      if (rise >= 10) {
        this.state.notifications.unshift({
          id: `ntf-cost-${Date.now()}`,
          type: "cost",
          title: "Hausse d’ingrédient",
          body: `Le prix de ${next.name} a augmenté de ${Math.round(rise)} %.`,
          href: `/admin/profitability/${card.productId}`,
          at: new Date().toISOString(),
          read: false,
        });
      }
    });
    const index = this.state.profitability.cards.findIndex((item) => item.productId === card.productId);
    if (index >= 0) this.state.profitability.cards[index] = card;
    else this.state.profitability.cards.push(card);
    const product = this.state.products.find((item) => item.id === card.productId);
    if (product) {
      const breakdown = computeDishBreakdown(card, product.promoPrice ?? product.price, this.state.profitability.settings);
      if (breakdown.marginEuro < 0) {
        this.state.notifications.unshift({
          id: `ntf-margin-${card.productId}-${Date.now()}`,
          type: "margin",
          title: "Plat vendu à perte",
          body: `${product.name} est vendu en dessous de son coût.`,
          href: `/admin/profitability/${product.id}`,
          at: new Date().toISOString(),
          read: false,
        });
      } else if (breakdown.marginPercent < this.state.profitability.settings.targetMarginPercent * 0.7) {
        this.state.notifications.unshift({
          id: `ntf-margin-${card.productId}-${Date.now()}`,
          type: "margin",
          title: "Marge insuffisante",
          body: `Marge de ${product.name} passée à ${breakdown.marginPercent.toFixed(1).replace(".", ",")} %.`,
          href: `/admin/profitability/${product.id}`,
          at: new Date().toISOString(),
          read: false,
        });
      }
      const packShare = breakdown.sellPriceTtc > 0 ? (breakdown.packaging / breakdown.sellPriceTtc) * 100 : 0;
      if (packShare >= 9) {
        this.state.notifications.unshift({
          id: `ntf-pack-${card.productId}-${Date.now()}`,
          type: "cost",
          title: "Packaging élevé",
          body: `Le packaging représente ${packShare.toFixed(0)} % du prix de vente de ${product.name}.`,
          href: `/admin/profitability/${product.id}`,
          at: new Date().toISOString(),
          read: false,
        });
      }
    }
    this.log(actor, "Mise à jour des coûts", "profitability", card.productId);
    this.persist();
    return structuredClone(card);
  }

  saveProfitSettings(settings: ProfitabilitySettings, actor: StaffUser) {
    this.ensureProfitability();
    this.state.profitability.settings = { ...defaultSettings(), ...settings, deliveryPerOrder: settings.deliveryPerOrder };
    this.log(actor, "Objectifs de marge", "profitability", "settings");
    this.persist();
    return structuredClone(this.state.profitability.settings);
  }

  dashboard(): DashboardStats {
    const now = new Date();
    const startToday = new Date(now);
    startToday.setHours(0, 0, 0, 0);
    const todayOrders = this.state.orders.filter((order) => new Date(order.createdAt) >= startToday);
    const paidToday = todayOrders.filter((order) => order.status !== "annulee" && order.status !== "remboursee");
    const byStatus = {
      nouvelle: 0,
      confirmee: 0,
      en_preparation: 0,
      prete: 0,
      en_livraison: 0,
      livree: 0,
      annulee: 0,
      remboursee: 0,
    } as Record<OrderStatus, number>;
    todayOrders.forEach((order) => {
      byStatus[order.status] += 1;
    });
    const daySeries = (days: number) =>
      Array.from({ length: days }, (_, i) => {
        const day = new Date(startToday);
        day.setDate(day.getDate() - (days - 1 - i));
        const next = new Date(day);
        next.setDate(next.getDate() + 1);
        const bucket = this.state.orders.filter((order) => {
          const at = new Date(order.createdAt);
          return at >= day && at < next && order.status !== "annulee" && order.status !== "remboursee";
        });
        return {
          date: day.toISOString().slice(0, 10),
          revenue: Math.round(bucket.reduce((sum, order) => sum + order.total, 0) * 10) / 10,
          orders: bucket.length,
        };
      });

    const counts = new Map<string, { quantity: number; revenue: number }>();
    this.state.orders
      .filter((order) => order.status !== "annulee" && order.status !== "remboursee")
      .forEach((order) => {
        order.lines.forEach((line) => {
          const current = counts.get(line.name) ?? { quantity: 0, revenue: 0 };
          current.quantity += line.quantity;
          current.revenue += line.quantity * line.unitPrice;
          counts.set(line.name, current);
        });
      });

    const newCustomers = this.state.customers.filter((customer) => new Date(customer.createdAt) >= startToday).length;

    return {
      ordersToday: todayOrders.length,
      revenueToday: Math.round(paidToday.reduce((sum, order) => sum + order.total, 0) * 10) / 10,
      byStatus,
      averageBasket: paidToday.length
        ? Math.round((paidToday.reduce((sum, order) => sum + order.total, 0) / paidToday.length) * 10) / 10
        : 0,
      newCustomers,
      topProducts: [...counts.entries()]
        .map(([name, value]) => ({ name, ...value }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5),
      sales7d: daySeries(7),
      sales30d: daySeries(30),
    };
  }
}

export function getAdminStore() {
  if (!globalForStore.__quinceAdminStoreV3) {
    globalForStore.__quinceAdminStoreV3 = new AdminStore();
  }
  globalForStore.__quinceAdminStoreV3.syncFromDisk();
  return globalForStore.__quinceAdminStoreV3;
}
