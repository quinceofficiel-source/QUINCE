import type { Permission, StaffRole } from "@/lib/admin/types";

const ALL: Permission[] = [
  "dashboard",
  "orders.read",
  "orders.write",
  "orders.refund",
  "kitchen",
  "products.read",
  "products.write",
  "inventory.read",
  "inventory.write",
  "customers.read",
  "customers.write",
  "deliveries.read",
  "deliveries.write",
  "promotions.read",
  "promotions.write",
  "analytics",
  "settings",
  "staff.manage",
];

export const ROLE_PERMISSIONS: Record<StaffRole, Permission[]> = {
  super_admin: ALL,
  admin: ALL.filter((item) => item !== "staff.manage"),
  kitchen: ["dashboard", "orders.read", "orders.write", "kitchen", "products.read", "inventory.read", "inventory.write"],
  delivery: ["dashboard", "orders.read", "deliveries.read", "deliveries.write"],
  support: ["dashboard", "orders.read", "orders.write", "customers.read", "customers.write"],
};

export function can(role: StaffRole, permission: Permission) {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function firstAllowedPath(role: StaffRole) {
  if (can(role, "dashboard")) return "/admin";
  if (can(role, "kitchen")) return "/admin/kitchen";
  if (can(role, "deliveries.read")) return "/admin/deliveries";
  if (can(role, "orders.read")) return "/admin/orders";
  return "/admin/login";
}
