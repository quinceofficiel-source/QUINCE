import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { can } from "@/lib/admin/permissions";
import { requireAdmin } from "@/lib/admin/dal";
import { getAdminStore } from "@/lib/admin/store";

export const metadata = { title: "Modifier un plat" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const actor = await requireAdmin("products.write");
  const { id } = await params;
  const product = getAdminStore().product(id);
  if (!product) notFound();
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-3xl">{product.name}</h1>
        {can(actor.role, "profitability") ? (
          <Link href={`/admin/profitability/${product.id}`} className="rounded-full bg-ink px-4 py-2 text-sm text-white">
            Marges & rentabilité
          </Link>
        ) : null}
      </div>
      <ProductForm product={product} />
    </div>
  );
}
