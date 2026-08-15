import Link from "next/link";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-quince text-ink hover:bg-quince-dark shadow-[0_8px_20px_-12px_rgba(255,212,0,0.9)]",
  dark: "bg-ink text-white hover:bg-neutral-800",
  forest: "bg-forest text-white hover:bg-[#0f2a1e]",
  outline: "border border-ink/15 bg-white text-ink hover:bg-cream-dark",
  ghost: "bg-transparent text-ink hover:bg-black/5",
  white: "bg-white text-ink hover:bg-cream",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

type ButtonProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
} & (
  | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">)
  | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
);

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition duration-200",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
