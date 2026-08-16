import Link from "next/link";
import { removeProduct, toggleProduct } from "@/lib/admin/actions";
import { can } from "@/lib/admin/permissions";
import { requireAdmin } from "@/lib/admin/dal";
import { getAdminStore } from "@/lib/admin/store";
import { CATEGORY_OPTIONS } from "@/lib/admin/types";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Plats" };

export default async function AdminProductsPage() {
  const actor = await requireAdmin("products.read");
  const writable = can(actor.role, "products.write");
  const products = getAdminStore().products();
  const labels = Object.fromEntries(CATEGORY_OPTIONS.map((item) => [item.id, item.label]));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Plats</h1>
        {writable ? (
          <Link href="/admin/products/new" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">
            Nouveau plat
          </Link>
        ) : null}
      </div>
      <div className="overflow-x-auto rounded-2xl bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-line text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Plat</th>
              <th className="px-4 py-3 font-medium">Catégorie</th>
              <th className="px-4 py-3 font-medium">Prix</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-line/70">
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-3">{labels[product.category] ?? product.category}</td>
                <td className="px-4 py-3">
                  {product.promoPrice ? (
                    <>
                      <span className="mr-2 text-muted line-through">{formatPrice(product.price)}</span>
                      {formatPrice(product.promoPrice)}
                    </>
                  ) : (
                    formatPrice(product.price)
                  )}
                </td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">{product.active ? "Actif" : "Inactif"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {writable ? (
                      <>
                        <Link href={`/admin/products/${product.id}`} className="text-sm underline-offset-2 hover:underline">
                          Modifier
                        </Link>
                        <form action={toggleProduct.bind(null, product.id, !product.active)}>
                          <button type="submit" className="text-sm text-muted">
                            {product.active ? "Désactiver" : "Activer"}
                          </button>
                        </form>
                        <form action={removeProduct.bind(null, product.id)}>
                          <button type="submit" className="text-sm text-rose-700">
                            Supprimer
                          </button>
                        </form>
                      </>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
