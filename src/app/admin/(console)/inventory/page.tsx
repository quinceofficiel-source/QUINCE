import { updateStock } from "@/lib/admin/actions";
import { can } from "@/lib/admin/permissions";
import { requireAdmin } from "@/lib/admin/dal";
import { getAdminStore } from "@/lib/admin/store";

export const metadata = { title: "Stocks" };

export default async function InventoryPage() {
  const actor = await requireAdmin("inventory.read");
  const writable = can(actor.role, "inventory.write");
  const products = getAdminStore().products();

  return (
    <div className="space-y-5">
      <h1 className="font-display text-3xl">Stocks</h1>
      <div className="overflow-x-auto rounded-2xl bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Plat</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Minimum</th>
              <th className="px-4 py-3 font-medium">Réservé</th>
              <th className="px-4 py-3 font-medium">Restant</th>
              <th className="px-4 py-3 font-medium">Alerte</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const remaining = product.stock - product.reserved;
              const alert = product.stock <= 0 ? "Rupture" : remaining <= product.minStock ? "Stock faible" : "OK";
              return (
                <tr key={product.id} className="border-b border-line/70">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3">
                    {writable ? (
                      <form action={updateStock.bind(null, product.id)} className="flex items-center gap-2">
                        <input name="stock" type="number" defaultValue={product.stock} className="h-9 w-20 rounded-lg border border-line bg-cream px-2" />
                        <button type="submit" className="text-xs font-medium">
                          OK
                        </button>
                      </form>
                    ) : (
                      product.stock
                    )}
                  </td>
                  <td className="px-4 py-3">{product.minStock}</td>
                  <td className="px-4 py-3">{product.reserved}</td>
                  <td className="px-4 py-3">{remaining}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        alert === "OK"
                          ? "text-emerald-700"
                          : alert === "Rupture"
                            ? "font-semibold text-rose-700"
                            : "font-medium text-amber-700"
                      }
                    >
                      {alert}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
