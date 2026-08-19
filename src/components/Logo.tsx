import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

const VARIANTS = {
  default: { src: "/logo.png", width: 915, height: 284 },
  landing: { src: "/logo-lockup-black.png", width: 864, height: 251 },
} as const;

export function Logo({
  className,
  compact = false,
  variant = "default",
}: {
  className?: string;
  compact?: boolean;
  variant?: keyof typeof VARIANTS;
}) {
  const { src, width, height } = VARIANTS[variant];
  return (
    <Link href="/" className={cn("inline-flex shrink-0 items-center", className)} aria-label="Quince, accueil">
      <Image
        src={src}
        alt="Quince"
        width={width}
        height={height}
        className={cn("w-auto max-w-[148px] sm:max-w-none", compact ? "h-[22px]" : "h-7")}
        priority
      />
    </Link>
  );
}
