import type { AdminNotification } from "@/lib/admin/types";

export const LIVE_ORDER_CHANNEL = "quince-live-orders";

export type LiveOrderEvent =
  | { type: "snapshot"; notifications: AdminNotification[] }
  | { type: "order"; notification: AdminNotification };
