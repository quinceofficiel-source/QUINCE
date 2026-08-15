import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/cn";
import type { Product } from "@/types/product";

export function ProductGrid({ products, className }: { products: Product[]; className?: string }) {
  if (products.length === 0) {
    return (
      <p className="rounded-3xl bg-white px-6 py-16 text-center text-muted">
        Aucun plat ne correspond à votre recherche. Essayez un autre mot ou retirez un filtre.
      </p>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
