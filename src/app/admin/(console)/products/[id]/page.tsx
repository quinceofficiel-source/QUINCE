import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin/dal";
import { getAdminStore } from "@/lib/admin/store";

export const metadata = { title: "Modifier un plat" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin("products.write");
  const { id } = await params;
  const product = getAdminStore().product(id);
  if (!product) notFound();
  return (
    <div className="space-y-5">
      <h1 className="font-display text-3xl">{product.name}</h1>
      <ProductForm product={product} />
    </div>
  );
}
