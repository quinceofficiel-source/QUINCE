import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center gap-2.5", className)}
      aria-label="Quince, accueil"
    >
      <Image
        src="/logo.png"
        alt=""
        width={405}
        height={512}
        className={cn("w-auto", compact ? "h-9" : "h-11")}
        priority
      />
      <span className={cn("font-display tracking-tight text-ink", compact ? "text-xl" : "text-[1.65rem] leading-none")}>
        Quince
      </span>
    </Link>
  );
}
