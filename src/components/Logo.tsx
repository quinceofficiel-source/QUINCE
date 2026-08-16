import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex shrink-0 items-center", className)} aria-label="Quince, accueil">
      <Image
        src="/logo.png"
        alt="Quince"
        width={870}
        height={252}
        className={cn("w-auto max-w-[132px] sm:max-w-none", compact ? "h-[22px]" : "h-7")}
        priority
      />
    </Link>
  );
}
