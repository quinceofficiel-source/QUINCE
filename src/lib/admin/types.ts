import type { CategoryId, Product } from "@/types/product";
import type {
  IngredientPricePoint,
  OrderCostSnapshot,
  ProductCostCard,
  ProfitabilitySettings,
} from "@/lib/admin/profitability";

export type StaffRole = "super_admin" | "admin" | "kitchen" | "delivery" | "support";

export type Permission =
  | "dashboard"
  | "orders.read"
  | "orders.write"
  | "orders.refund"
  | "kitchen"
  | "products.read"
  | "products.write"
  | "inventory.read"
  | "inventory.write"
  | "customers.read"
  | "customers.write"
  | "deliveries.read"
  | "deliveries.write"
  | "promotions.read"
  | "promotions.write"
  | "analytics"
  | "profitability"
  | "settings"
  | "staff.manage";

export type OrderStatus =
  | "nouvelle"
  | "confirmee"
  | "en_preparation"
  | "prete"
  | "en_livraison"
  | "livree"
  | "annulee"
  | "remboursee";

export type PaymentMethod = "card" | "apple_pay" | "paypal";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  passwordHash: string;
  active: boolean;
};

export type SessionPayload = {
  userId: string;
  role: StaffRole;
  exp: number;
};

export type AdminProduct = Product & {
  promoPrice: number | null;
  stock: number;
  minStock: number;
  reserved: number;
  active: boolean;
  weightGrams: number;
  images: string[];
};

export type OrderLine = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  allergens: string[];
};

export type StatusEvent = {
  status: OrderStatus;
  at: string;
  by: string;
  note?: string;
};

export type AdminOrder = {
  id: string;
  createdAt: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  zip: string;
  instructions: string;
  slotLabel: string;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  courierId: string | null;
  courierName: string | null;
  internalNotes: string[];
  history: StatusEvent[];
  promoCode: string | null;
  costSnapshot?: OrderCostSnapshot;
};

export type CustomerAddress = {
  label: string;
  street: string;
  zip: string;
  city: string;
};

export type AdminCustomer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: string;
  favoriteProductIds: string[];
  addresses: CustomerAddress[];
  credit: number;
  promoCodesUsed: string[];
  notes: string[];
};

export type Courier = {
  id: string;
  name: string;
  phone: string;
  active: boolean;
};

export type PromotionType = "percent" | "fixed" | "free_shipping" | "first_order" | "referral";

export type Promotion = {
  id: string;
  code: string;
  type: PromotionType;
  value: number;
  startsAt: string;
  endsAt: string;
  minOrder: number;
  maxUses: number;
  used: number;
  eligible: "all" | "new";
  active: boolean;
};

export type AdminLog = {
  id: string;
  at: string;
  actorId: string;
  actorName: string;
  action: string;
  entity: string;
  entityId: string;
};

export type AdminNotification = {
  id: string;
  type: "order" | "payment" | "stock" | "late" | "support" | "margin" | "cost";
  title: string;
  body: string;
  href: string;
  at: string;
  read: boolean;
  orderId?: string;
  customerName?: string;
  amount?: number;
};

export type ProfitabilityState = {
  settings: ProfitabilitySettings;
  cards: ProductCostCard[];
  history: IngredientPricePoint[];
};

export type EditorialCampaignType =
  | "subscription"
  | "offer"
  | "menu"
  | "sharing"
  | "seasonal"
  | "referral"
  | "campaign";

export type EditorialCampaign = {
  id: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonLink: string;
  image: string;
  backgroundColor: string;
  textColor: string;
  badge: string;
  campaignType: EditorialCampaignType;
  startsAt: string;
  endsAt: string;
  order: number;
  active: boolean;
};

export type AdminState = {
  staff: StaffUser[];
  products: AdminProduct[];
  orders: AdminOrder[];
  customers: AdminCustomer[];
  couriers: Courier[];
  promotions: Promotion[];
  editorialCampaigns: EditorialCampaign[];
  logs: AdminLog[];
  notifications: AdminNotification[];
  profitability: ProfitabilityState;
};

export const EDITORIAL_TYPE_LABELS: Record<EditorialCampaignType, string> = {
  subscription: "Routine hebdo",
  offer: "Offre spéciale",
  menu: "Nouveau menu",
  sharing: "Repas à partager",
  seasonal: "Saisonnier",
  referral: "Parrainage",
  campaign: "Campagne",
};

export type DashboardStats = {
  ordersToday: number;
  revenueToday: number;
  byStatus: Record<OrderStatus, number>;
  averageBasket: number;
  newCustomers: number;
  topProducts: Array<{ name: string; quantity: number; revenue: number }>;
  sales7d: Array<{ date: string; revenue: number; orders: number }>;
  sales30d: Array<{ date: string; revenue: number; orders: number }>;
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  nouvelle: "Nouvelle",
  confirmee: "Confirmée",
  en_preparation: "En préparation",
  prete: "Prête",
  en_livraison: "En livraison",
  livree: "Livrée",
  annulee: "Annulée",
  remboursee: "Remboursée",
};

export const ROLE_LABELS: Record<StaffRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  kitchen: "Préparation cuisine",
  delivery: "Livraison",
  support: "Service client",
};

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  card: "Carte",
  apple_pay: "Apple Pay",
  paypal: "PayPal",
};

export const CATEGORY_OPTIONS: Array<{ id: CategoryId; label: string }> = [
  { id: "maison", label: "Maison" },
  { id: "gourmand", label: "Gourmand" },
  { id: "leger", label: "Léger" },
  { id: "express", label: "Express" },
  { id: "proteine", label: "Protéiné" },
  { id: "famille", label: "Famille" },
  { id: "duo", label: "Duo" },
  { id: "kids", label: "Kids" },
  { id: "vege", label: "Végé" },
  { id: "decouverte", label: "Découverte" },
  { id: "nouveau", label: "Nouveau" },
  { id: "sucre", label: "Sucré" },
];
