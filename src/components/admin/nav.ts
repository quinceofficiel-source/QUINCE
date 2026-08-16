import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bike,
  ChefHat,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Tag,
  Users,
  Warehouse,
} from "lucide-react";
import type { Permission } from "@/lib/admin/types";

export const ADMIN_NAV: Array<{
  href: string;
  label: string;
  icon: LucideIcon;
  permission: Permission;
}> = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, permission: "dashboard" },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingBag, permission: "orders.read" },
  { href: "/admin/kitchen", label: "Cuisine", icon: ChefHat, permission: "kitchen" },
  { href: "/admin/products", label: "Plats", icon: Package, permission: "products.read" },
  { href: "/admin/inventory", label: "Stocks", icon: Warehouse, permission: "inventory.read" },
  { href: "/admin/customers", label: "Clients", icon: Users, permission: "customers.read" },
  { href: "/admin/deliveries", label: "Livraisons", icon: Bike, permission: "deliveries.read" },
  { href: "/admin/promotions", label: "Promotions", icon: Tag, permission: "promotions.read" },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, permission: "analytics" },
  { href: "/admin/settings", label: "Paramètres", icon: Settings, permission: "settings" },
];
