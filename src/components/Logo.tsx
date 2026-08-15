import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)} aria-label="Quince, accueil">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-quince" aria-hidden>
        <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none">
          <path d="M16 6c1.4 2.2 1.6 4.2.6 5.2" stroke="#173C2B" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M16.2 8.4c2.2-.2 3.8-1.6 4.4-3.2-2.4.4-4 1.8-4.4 3.2Z" fill="#173C2B" />
          <path
            d="M8.6 18.2c.4-5.2 3.5-8.4 7.4-8.4s7 3.2 7.4 8.4c.3 3.7-2.5 7.4-7.4 7.4s-7.7-3.7-7.4-7.4Z"
            fill="#111111"
          />
        </svg>
      </span>
      {compact ? null : <span className="text-[1.15rem] font-semibold tracking-tight">Quince</span>}
    </Link>
  );
}
