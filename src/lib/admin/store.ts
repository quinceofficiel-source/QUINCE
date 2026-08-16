import { createInitialState } from "@/lib/admin/seed";
import type {
  AdminLog,
  AdminOrder,
  AdminProduct,
  AdminState,
  DashboardStats,
  OrderStatus,
  Promotion,
  StaffUser,
} from "@/lib/admin/types";

const globalForStore = globalThis as typeof globalThis & { __quinceAdminStore?: AdminStore };

class AdminStore {
  private state: AdminState;

  constructor() {
    this.state = createInitialState();
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
    return structuredClone(order);
  }

  addOrderNote(id: string, note: string, actor: StaffUser) {
    const order = this.state.orders.find((item) => item.id === id);
    if (!order) return null;
    order.internalNotes.push(note);
    this.log(actor, "Note interne", "order", id);
    return structuredClone(order);
  }

  assignCourier(id: string, courierId: string, actor: StaffUser) {
    const order = this.state.orders.find((item) => item.id === id);
    const courier = this.state.couriers.find((item) => item.id === courierId);
    if (!order || !courier) return null;
    order.courierId = courier.id;
    order.courierName = courier.name;
    this.log(actor, `Livreur ${courier.name}`, "order", id);
    return structuredClone(order);
  }

  upsertProduct(input: AdminProduct, actor: StaffUser, isNew: boolean) {
    const index = this.state.products.findIndex((item) => item.id === input.id);
    if (index >= 0) this.state.products[index] = input;
    else this.state.products.unshift(input);
    this.log(actor, isNew ? "Création plat" : "Modification plat", "product", input.id);
    return structuredClone(input);
  }

  setProductActive(id: string, active: boolean, actor: StaffUser) {
    const product = this.state.products.find((item) => item.id === id);
    if (!product) return null;
    product.active = active;
    this.log(actor, active ? "Activation plat" : "Désactivation plat", "product", id);
    return structuredClone(product);
  }

  deleteProduct(id: string, actor: StaffUser) {
    const before = this.state.products.length;
    this.state.products = this.state.products.filter((item) => item.id !== id);
    if (this.state.products.length === before) return false;
    this.log(actor, "Suppression plat", "product", id);
    return true;
  }

  setStock(id: string, stock: number, actor: StaffUser) {
    const product = this.state.products.find((item) => item.id === id);
    if (!product) return null;
    product.stock = Math.max(0, Math.round(stock));
    this.log(actor, `Stock → ${product.stock}`, "product", id);
    return structuredClone(product);
  }

  addCustomerNote(id: string, note: string, actor: StaffUser) {
    const customer = this.state.customers.find((item) => item.id === id);
    if (!customer) return null;
    customer.notes.push(note);
    this.log(actor, "Note client", "customer", id);
    return structuredClone(customer);
  }

  upsertPromotion(promo: Promotion, actor: StaffUser, isNew: boolean) {
    const index = this.state.promotions.findIndex((item) => item.id === promo.id);
    if (index >= 0) this.state.promotions[index] = promo;
    else this.state.promotions.unshift(promo);
    this.log(actor, isNew ? "Création promo" : "Modification promo", "promotion", promo.id);
    return structuredClone(promo);
  }

  togglePromotion(id: string, actor: StaffUser) {
    const promo = this.state.promotions.find((item) => item.id === id);
    if (!promo) return null;
    promo.active = !promo.active;
    this.log(actor, promo.active ? "Activation promo" : "Désactivation promo", "promotion", id);
    return structuredClone(promo);
  }

  markNotificationsRead() {
    this.state.notifications.forEach((item) => {
      item.read = true;
    });
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
  if (!globalForStore.__quinceAdminStore) {
    globalForStore.__quinceAdminStore = new AdminStore();
  }
  return globalForStore.__quinceAdminStore;
}
