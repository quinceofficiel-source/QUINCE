import type { AdminNotification } from "@/lib/admin/types";

type Listener = (notification: AdminNotification) => void;

const globalForLive = globalThis as typeof globalThis & { __quinceLiveOrders?: Set<Listener> };

function listeners() {
  if (!globalForLive.__quinceLiveOrders) {
    globalForLive.__quinceLiveOrders = new Set();
  }
  return globalForLive.__quinceLiveOrders;
}

export function subscribeLiveOrders(listener: Listener) {
  listeners().add(listener);
  return () => {
    listeners().delete(listener);
  };
}

export function publishLiveOrder(notification: AdminNotification) {
  listeners().forEach((listener) => listener(notification));
}
