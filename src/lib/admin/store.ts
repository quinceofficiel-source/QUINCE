import { createInitialState } from "@/lib/admin/seed";
import { publishLiveOrder } from "@/lib/admin/live";
import { readPersistedState, storeFileMtime, writePersistedState } from "@/lib/admin/persist";
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

const globalForStore = globalThis as typeof globalThis & { __quinceAdminStoreV2?: AdminStore };

class AdminStore {
  private state: AdminState;
  private diskMtime = 0;

  constructor() {
    const persisted = readPersistedState();
    this.state = persisted ?? createInitialState();
    if (!persisted) this.persist();
    else this.diskMtime = storeFileMtime();
  }

  syncFromDisk() {
    const mtime = storeFileMtime();
    if (!mtime || mtime <= this.diskMtime) return;
    const next = readPersistedState();
    if (!next) return;
    this.state = next;
    this.diskMtime = mtime;
  }

  private persist() {
    writePersistedState(this.state);
    this.diskMtime = storeFileMtime() || Date.now();
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
  if (!globalForStore.__quinceAdminStoreV2) {
    globalForStore.__quinceAdminStoreV2 = new AdminStore();
  }
  globalForStore.__quinceAdminStoreV2.syncFromDisk();
  return globalForStore.__quinceAdminStoreV2;
}
