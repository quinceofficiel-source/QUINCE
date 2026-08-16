import { StatusBadge } from "@/components/admin/StatusBadge";
import { updateOrderStatus } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/dal";
import { getAdminStore } from "@/lib/admin/store";
import { formatTime } from "@/lib/format";
import type { AdminOrder } from "@/lib/admin/types";

export const metadata = { title: "Cuisine" };

function KitchenCard({ order, actionLabel, next }: { order: AdminOrder; actionLabel: string; next: "en_preparation" | "prete" }) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-[0_12px_32px_-24px_rgba(17,17,17,0.35)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold">{order.id}</p>
          <p className="text-sm text-muted">Limite {order.slotLabel}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <ul className="mt-4 space-y-2">
        {order.lines.map((line) => (
          <li key={`${order.id}-${line.productId}`} className="text-sm">
            <span className="font-semibold">{line.quantity}×</span> {line.name}
            {line.allergens.length ? (
              <span className="mt-0.5 block text-xs text-rose-700">Allergies : {line.allergens.join(", ")}</span>
            ) : null}
          </li>
        ))}
      </ul>
      {order.instructions ? <p className="mt-3 rounded-xl bg-cream px-3 py-2 text-xs">{order.instructions}</p> : null}
      <p className="mt-3 text-xs text-muted">Reçue à {formatTime(order.createdAt)}</p>
      <form action={updateOrderStatus.bind(null, order.id, next)} className="mt-4">
        <button type="submit" className="h-12 w-full rounded-full bg-quince text-sm font-semibold text-ink">
          {actionLabel}
        </button>
      </form>
    </article>
  );
}

export default async function KitchenPage() {
  await requireAdmin("kitchen");
  const orders = getAdminStore().orders();
  const todo = orders.filter((order) => order.status === "nouvelle" || order.status === "confirmee");
  const doing = orders.filter((order) => order.status === "en_preparation");
  const ready = orders.filter((order) => order.status === "prete");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl">Cuisine</h1>
        <p className="mt-1 text-sm text-muted">Vue tablette · commandes du jour à préparer</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <section>
          <h2 className="mb-3 text-sm font-semibold">À préparer ({todo.length})</h2>
          <div className="space-y-3">
            {todo.map((order) => (
              <KitchenCard key={order.id} order={order} actionLabel="Commencer" next="en_preparation" />
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-3 text-sm font-semibold">En préparation ({doing.length})</h2>
          <div className="space-y-3">
            {doing.map((order) => (
              <KitchenCard key={order.id} order={order} actionLabel="Prête" next="prete" />
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-3 text-sm font-semibold">Prêtes ({ready.length})</h2>
          <div className="space-y-3">
            {ready.map((order) => (
              <article key={order.id} className="rounded-2xl bg-white p-5">
                <p className="font-semibold">{order.id}</p>
                <p className="text-sm text-muted">{order.slotLabel}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
