import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { assignOrderCourier, updateOrderStatus } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/dal";
import { getAdminStore } from "@/lib/admin/store";
import { formatDateTime } from "@/lib/format";

export const metadata = { title: "Livraisons" };

export default async function DeliveriesPage() {
  await requireAdmin("deliveries.read");
  const store = getAdminStore();
  const couriers = store.couriers();
  const orders = store
    .orders()
    .filter((order) => ["prete", "en_livraison"].includes(order.status) || (order.status === "livree" && Date.now() - +new Date(order.createdAt) < 86400000));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl">Livraisons</h1>
        <p className="mt-1 text-sm text-muted">Vue opérationnelle, utilisable sur mobile.</p>
      </div>
      <div className="grid gap-3">
        {orders.map((order) => (
          <article key={order.id} className="rounded-2xl bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Link href={`/admin/orders/${order.id}`} className="text-lg font-semibold">
                  {order.id}
                </Link>
                <p className="text-sm">{order.customerName}</p>
                <p className="text-sm text-muted">
                  {order.address}, {order.zip} {order.city}
                </p>
                <p className="mt-1 text-sm">{order.slotLabel}</p>
                <p className="text-xs text-muted">{formatDateTime(order.createdAt)}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <form action={assignOrderCourier.bind(null, order.id)} className="flex gap-2">
                <select name="courierId" defaultValue={order.courierId ?? ""} className="h-10 rounded-xl border border-line bg-cream px-3 text-sm">
                  <option value="">Livreur</option>
                  {couriers.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <button type="submit" className="h-10 rounded-full bg-cream px-4 text-sm font-medium">
                  Assigner
                </button>
              </form>
              {order.status !== "en_livraison" ? (
                <form action={updateOrderStatus.bind(null, order.id, "en_livraison")}>
                  <button type="submit" className="h-10 rounded-full bg-ink px-4 text-sm text-white">
                    En livraison
                  </button>
                </form>
              ) : (
                <form action={updateOrderStatus.bind(null, order.id, "livree")}>
                  <button type="submit" className="h-10 rounded-full bg-quince px-4 text-sm font-semibold">
                    Livraison terminée
                  </button>
                </form>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
