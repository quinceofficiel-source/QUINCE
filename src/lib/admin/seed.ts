import { hashPassword } from "@/lib/admin/crypto";
import type {
  AdminCustomer,
  AdminOrder,
  AdminProduct,
  AdminState,
  Courier,
  OrderLine,
  OrderStatus,
  PaymentMethod,
  Promotion,
  StaffUser,
} from "@/lib/admin/types";
import { products } from "@/data/products";
import { DELIVERY_SLOTS } from "@/data/slots";

export const DEMO_PASSWORD = "QuinceAdmin!26";

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(rand: () => number, list: T[]) {
  return list[Math.floor(rand() * list.length)]!;
}

export function createInitialState(now = new Date()): AdminState {
  const rand = rng(20260816);
  const passwordHash = hashPassword(DEMO_PASSWORD);

  const staff: StaffUser[] = [
    { id: "staff-super", name: "Camille Morel", email: "super@quince.fr", role: "super_admin", passwordHash, active: true },
    { id: "staff-admin", name: "Léa Martin", email: "admin@quince.fr", role: "admin", passwordHash, active: true },
    { id: "staff-kitchen", name: "Yanis Benali", email: "cuisine@quince.fr", role: "kitchen", passwordHash, active: true },
    { id: "staff-delivery", name: "Nina Rossi", email: "livraison@quince.fr", role: "delivery", passwordHash, active: true },
    { id: "staff-support", name: "Hugo Bernard", email: "support@quince.fr", role: "support", passwordHash, active: true },
  ];

  const adminProducts: AdminProduct[] = products.map((product, index) => {
    const stock = product.kind === "plat" ? 8 + Math.floor(rand() * 40) : 20 + Math.floor(rand() * 50);
    const reserved = Math.floor(stock * (rand() * 0.25));
    return {
      ...product,
      images: [product.image],
      promoPrice: index % 11 === 0 ? Math.round(product.price * 0.85 * 10) / 10 : null,
      stock,
      minStock: product.kind === "plat" ? 8 : 12,
      reserved,
      active: true,
      weightGrams: product.kind === "plat" ? 380 + Math.floor(rand() * 120) : 120 + Math.floor(rand() * 80),
    };
  });

  adminProducts[0]!.stock = 3;
  adminProducts[1]!.stock = 0;
  adminProducts[2]!.stock = 5;

  const firstNames = ["Emma", "Louis", "Chloé", "Adam", "Inès", "Raphaël", "Manon", "Noah", "Léna", "Paul", "Sarah", "Jules"];
  const lastNames = ["Dupont", "Nguyen", "Diallo", "Garcia", "Petit", "Moreau", "Leroy", "Roux", "Fournier", "Lambert"];
  const streets = ["12 rue des Lilas", "8 avenue Victor Hugo", "24 boulevard Saint-Michel", "3 impasse des Vignes", "19 rue de la Paix"];
  const cities = [
    { city: "Paris", zip: "75011" },
    { city: "Paris", zip: "75018" },
    { city: "Boulogne-Billancourt", zip: "92100" },
    { city: "Saint-Denis", zip: "93200" },
    { city: "Montreuil", zip: "93100" },
    { city: "Vincennes", zip: "94300" },
    { city: "Levallois-Perret", zip: "92300" },
  ];

  const customers: AdminCustomer[] = Array.from({ length: 28 }, (_, i) => {
    const firstName = pick(rand, firstNames);
    const lastName = pick(rand, lastNames);
    const place = pick(rand, cities);
    const created = new Date(now);
    created.setDate(created.getDate() - Math.floor(rand() * 90));
    return {
      id: `cus-${String(i + 1).padStart(3, "0")}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@mail.fr`,
      phone: `06 ${String(10 + i).padStart(2, "0")} ${String(20 + i).padStart(2, "0")} ${String(30 + i).padStart(2, "0")} ${String(40 + i).padStart(2, "0")}`,
      createdAt: created.toISOString(),
      favoriteProductIds: [pick(rand, adminProducts).id, pick(rand, adminProducts).id],
      addresses: [{ label: "Domicile", street: pick(rand, streets), zip: place.zip, city: place.city }],
      credit: rand() > 0.8 ? Math.round(rand() * 20) : 0,
      promoCodesUsed: rand() > 0.6 ? ["BIENVENUE10"] : [],
      notes: i % 9 === 0 ? ["Préfère une livraison en bas de l’immeuble."] : [],
    };
  });

  const couriers: Courier[] = [
    { id: "cour-1", name: "Nina Rossi", phone: "06 12 45 78 90", active: true },
    { id: "cour-2", name: "Karim Haddad", phone: "06 23 56 89 01", active: true },
    { id: "cour-3", name: "Sofia Alves", phone: "06 34 67 90 12", active: true },
  ];

  const promotions: Promotion[] = [
    {
      id: "promo-1",
      code: "BIENVENUE10",
      type: "percent",
      value: 10,
      startsAt: new Date(now.getTime() - 20 * 86400000).toISOString(),
      endsAt: new Date(now.getTime() + 40 * 86400000).toISOString(),
      minOrder: 25,
      maxUses: 500,
      used: 86,
      eligible: "new",
      active: true,
    },
    {
      id: "promo-2",
      code: "QUINCE5",
      type: "fixed",
      value: 5,
      startsAt: new Date(now.getTime() - 10 * 86400000).toISOString(),
      endsAt: new Date(now.getTime() + 20 * 86400000).toISOString(),
      minOrder: 35,
      maxUses: 200,
      used: 41,
      eligible: "all",
      active: true,
    },
    {
      id: "promo-3",
      code: "FREELIV",
      type: "free_shipping",
      value: 0,
      startsAt: new Date(now.getTime() - 5 * 86400000).toISOString(),
      endsAt: new Date(now.getTime() + 10 * 86400000).toISOString(),
      minOrder: 40,
      maxUses: 100,
      used: 19,
      eligible: "all",
      active: true,
    },
    {
      id: "promo-4",
      code: "PARRAIN15",
      type: "referral",
      value: 15,
      startsAt: new Date(now.getTime() - 60 * 86400000).toISOString(),
      endsAt: new Date(now.getTime() + 90 * 86400000).toISOString(),
      minOrder: 0,
      maxUses: 1000,
      used: 12,
      eligible: "new",
      active: true,
    },
  ];

  const statusFlow: OrderStatus[] = [
    "nouvelle",
    "confirmee",
    "en_preparation",
    "prete",
    "en_livraison",
    "livree",
  ];
  const payments: PaymentMethod[] = ["card", "apple_pay", "paypal"];
  const mains = adminProducts.filter((item) => item.kind === "plat");

  const orders: AdminOrder[] = Array.from({ length: 52 }, (_, i) => {
    const customer = pick(rand, customers);
    const address = customer.addresses[0]!;
    const created = new Date(now);
    if (i < 14) {
      created.setHours(8 + Math.floor(rand() * 10), Math.floor(rand() * 60), 0, 0);
    } else {
      created.setDate(created.getDate() - Math.floor(rand() * 29) - (i < 22 ? 0 : 1));
      created.setHours(10 + Math.floor(rand() * 10), Math.floor(rand() * 60), 0, 0);
    }
    const lineCount = 1 + Math.floor(rand() * 4);
    const lines: OrderLine[] = Array.from({ length: lineCount }, () => {
      const product = pick(rand, mains);
      const quantity = 1 + Math.floor(rand() * 2);
      return {
        productId: product.id,
        name: product.name,
        quantity,
        unitPrice: product.promoPrice ?? product.price,
        allergens: product.allergens,
      };
    });
    const subtotal = Math.round(lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0) * 10) / 10;
    const discount = rand() > 0.75 ? 5 : 0;
    const shipping = subtotal - discount >= 60 ? 0 : 4.9;
    const total = Math.round((subtotal - discount + shipping) * 10) / 10;
    let status: OrderStatus;
    if (i < 3) status = "nouvelle";
    else if (i < 6) status = "confirmee";
    else if (i < 10) status = "en_preparation";
    else if (i < 13) status = "prete";
    else if (i < 16) status = "en_livraison";
    else if (i === 16) status = "annulee";
    else if (i === 17) status = "remboursee";
    else status = pick(rand, ["livree", "livree", "livree", "en_livraison"]);

    const statusIndex = Math.max(0, statusFlow.indexOf(status as (typeof statusFlow)[number]));
    const history = (status === "annulee" || status === "remboursee"
      ? (["nouvelle", "confirmee", status] as OrderStatus[])
      : statusFlow.slice(0, Math.max(1, statusIndex + 1))
    ).map((item, step) => ({
      status: item,
      at: new Date(created.getTime() + step * 18 * 60000).toISOString(),
      by: step === 0 ? "Système" : pick(rand, staff).name,
    }));

    const courier =
      status === "en_livraison" || status === "livree" ? pick(rand, couriers) : i % 7 === 0 ? pick(rand, couriers) : null;

    return {
      id: `QX-${String(10480 + i)}`,
      createdAt: created.toISOString(),
      customerId: customer.id,
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      address: address.street,
      city: address.city,
      zip: address.zip,
      instructions: i % 8 === 0 ? "Code 4321, 3e étage gauche." : "",
      slotLabel: pick(rand, DELIVERY_SLOTS).label,
      lines,
      subtotal,
      discount,
      shipping,
      total,
      paymentMethod: pick(rand, payments),
      paymentStatus: status === "remboursee" ? "refunded" : i === 4 ? "failed" : "paid",
      status,
      courierId: courier?.id ?? null,
      courierName: courier?.name ?? null,
      internalNotes: i % 10 === 0 ? ["Client fidèle, priorité créneau soir."] : [],
      history,
      promoCode: discount ? "QUINCE5" : null,
    };
  });

  return {
    staff,
    products: adminProducts,
    orders,
    customers,
    couriers,
    promotions,
    logs: [
      {
        id: "log-1",
        at: new Date(now.getTime() - 3600000).toISOString(),
        actorId: "staff-admin",
        actorName: "Léa Martin",
        action: "Connexion",
        entity: "session",
        entityId: "staff-admin",
      },
    ],
    notifications: [
      {
        id: "ntf-1",
        type: "order",
        title: "Nouvelle commande",
        body: "QX-10480 vient d’arriver.",
        href: "/admin/orders/QX-10480",
        at: new Date(now.getTime() - 12 * 60000).toISOString(),
        read: false,
        orderId: "QX-10480",
        customerName: "Emma Dupont",
        amount: 32.7,
      },
      {
        id: "ntf-2",
        type: "stock",
        title: "Rupture de stock",
        body: `${adminProducts[1]!.name} n’est plus disponible.`,
        href: "/admin/inventory",
        at: new Date(now.getTime() - 40 * 60000).toISOString(),
        read: false,
      },
      {
        id: "ntf-3",
        type: "payment",
        title: "Paiement échoué",
        body: "Le paiement de QX-10484 a échoué.",
        href: "/admin/orders/QX-10484",
        at: new Date(now.getTime() - 90 * 60000).toISOString(),
        read: false,
      },
    ],
  };
}
