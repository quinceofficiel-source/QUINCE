import { Container } from "@/components/Container";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeader } from "@/components/SectionHeader";
import type { Product } from "@/types/product";

export function ProductCarousel({
  title,
  products,
  href,
  subtitle,
}: {
  title: string;
  products: Product[];
  href?: string;
  subtitle?: string;
}) {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <SectionHeader title={title} href={href} subtitle={subtitle} />
        <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory sm:mx-0 sm:px-0">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} className="w-[260px] shrink-0 snap-start sm:w-[280px]" />
          ))}
        </div>
      </Container>
    </section>
  );
}
