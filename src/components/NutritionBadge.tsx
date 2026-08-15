import { cn } from "@/lib/cn";

export function NutritionBadge({
  label,
  value,
  icon,
  className,
}: {
  label: string;
  value: string;
  icon?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl bg-cream-dark px-4 py-3", className)}>
      <p className="text-xs text-muted">
        {icon ? <span className="mr-1">{icon}</span> : null}
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
