import Image from "next/image";
import { Button } from "@/components/Button";
import { cn } from "@/lib/cn";

export function PromoBanner({
  title,
  text,
  cta,
  href,
  image,
  imageAlt,
  tone = "sage",
  className,
}: {
  title: string;
  text: string;
  cta: string;
  href: string;
  image: string;
  imageAlt: string;
  tone?: "sage" | "yellow" | "blush";
  className?: string;
}) {
  const tones = {
    sage: "bg-sage",
    yellow: "bg-quince",
    blush: "bg-blush",
  };

  return (
    <article className={cn("grid overflow-hidden rounded-[1.75rem] md:grid-cols-2", tones[tone], className)}>
      <div className="flex flex-col justify-center p-6 sm:p-8">
        <h3 className="font-display text-2xl leading-tight text-ink sm:text-3xl">{title}</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/75">{text}</p>
        <Button href={href} variant={tone === "yellow" ? "white" : "dark"} className="mt-6 w-fit">
          {cta}
        </Button>
      </div>
      <div className="relative min-h-[200px]">
        <Image src={image} alt={imageAlt} fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
      </div>
    </article>
  );
}
