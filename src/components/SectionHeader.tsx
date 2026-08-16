import Link from "next/link";
import { cn } from "@/lib/cn";

export function SectionHeader({
  title,
  href,
  linkLabel = "Voir tout",
  subtitle,
  className,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex items-end justify-between gap-3 sm:gap-4", className)}>
      <div className="min-w-0">
        <h2 className="font-display text-[1.65rem] leading-tight tracking-tight text-ink sm:text-3xl lg:text-4xl">{title}</h2>
        {subtitle ? <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">{subtitle}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="shrink-0 text-sm font-medium text-ink underline-offset-4 hover:underline">
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
