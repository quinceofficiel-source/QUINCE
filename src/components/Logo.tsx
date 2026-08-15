import Link from "next/link";
import { QuinceMark } from "@/components/QuinceMark";
import { cn } from "@/lib/cn";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)} aria-label="Quince, accueil">
      <span className="inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-quince text-ink" aria-hidden>
        <QuinceMark className="h-8 w-8" />
      </span>
      {compact ? null : (
        <span className="font-display text-[1.25rem] font-semibold tracking-tight text-forest">Quince</span>
      )}
    </Link>
  );
}
