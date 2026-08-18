import type { MarginStatus } from "@/lib/admin/profitability";
import { cn } from "@/lib/cn";

const LABEL: Record<MarginStatus, string> = {
  good: "Objectif atteint",
  ok: "Marge faible",
  bad: "Marge insuffisante",
};

const CLASS: Record<MarginStatus, string> = {
  good: "bg-emerald-100 text-emerald-900",
  ok: "bg-amber-100 text-amber-950",
  bad: "bg-rose-100 text-rose-900",
};

export function MarginBadge({ status, label }: { status: MarginStatus; label?: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold", CLASS[status])}>
      {label ?? LABEL[status]}
    </span>
  );
}

export function marginTextClass(status: MarginStatus) {
  if (status === "good") return "text-emerald-800";
  if (status === "ok") return "text-amber-800";
  return "text-rose-800";
}
