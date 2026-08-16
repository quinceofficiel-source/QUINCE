import { Container } from "@/components/Container";

export function Editorial({
  title,
  kicker,
  children,
}: {
  title: string;
  kicker?: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="py-12 pb-20">
      <div className="mx-auto max-w-3xl">
        {kicker ? <p className="text-sm font-medium text-forest">{kicker}</p> : null}
        <h1 className="mt-2 font-display text-3xl tracking-tight break-words sm:text-5xl">{title}</h1>
        <div className="prose-quince mt-8 space-y-4 text-base leading-relaxed text-ink/80">{children}</div>
      </div>
    </Container>
  );
}
