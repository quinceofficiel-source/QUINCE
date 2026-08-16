import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin/dal";

export const metadata = { title: "Nouveau plat" };

export default async function NewProductPage() {
  await requireAdmin("products.write");
  return (
    <div className="space-y-5">
      <h1 className="font-display text-3xl">Nouveau plat</h1>
      <ProductForm />
    </div>
  );
}
