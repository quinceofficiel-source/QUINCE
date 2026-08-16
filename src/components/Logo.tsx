import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex shrink-0 items-center", className)} aria-label="Quince, accueil">
      <Image
        src="/logo.png"
        alt="Quince"
        width={198}
        height={246}
        className={cn("w-auto", compact ? "h-7" : "h-8")}
        priority
      />
    </Link>
  );
}
