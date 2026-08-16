import type { OrderStatus } from "@/lib/admin/types";

export const STATUS_CLASS: Record<OrderStatus, string> = {
  nouvelle: "bg-quince/30 text-ink",
  confirmee: "bg-sky-100 text-sky-900",
  en_preparation: "bg-amber-100 text-amber-900",
  prete: "bg-violet-100 text-violet-900",
  en_livraison: "bg-indigo-100 text-indigo-950",
  livree: "bg-emerald-100 text-emerald-900",
  annulee: "bg-neutral-200 text-neutral-700",
  remboursee: "bg-rose-100 text-rose-900",
};
