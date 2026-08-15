import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 flex-col items-center", compact ? "gap-px" : "gap-[3px]", className)}
      aria-label="Quince, accueil"
    >
      <Image
        src="/logo.png"
        alt=""
        width={405}
        height={512}
        className={cn("w-auto", compact ? "h-8" : "h-10")}
        priority
      />
      <span
        className={cn(
          "font-display leading-none tracking-tight text-ink",
          compact ? "text-[11px]" : "text-[15px]",
        )}
      >
        Quince
      </span>
    </Link>
  );
}
