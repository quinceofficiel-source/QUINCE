import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/admin/types";
import { STATUS_CLASS } from "@/lib/admin/status";
import { cn } from "@/lib/cn";

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", STATUS_CLASS[status])}>
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
