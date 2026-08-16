import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { addOrderNote, assignOrderCourier, updateOrderStatus } from "@/lib/admin/actions";
import { can } from "@/lib/admin/permissions";
import { requireAdmin } from "@/lib/admin/dal";
import { getAdminStore } from "@/lib/admin/store";
import { ORDER_STATUS_LABELS, PAYMENT_LABELS, type OrderStatus } from "@/lib/admin/types";
import { formatDateTime, formatPrice, formatTime } from "@/lib/format";

export const metadata = { title: "Commande" };

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const actor = await requireAdmin("orders.read");
  const { id } = await params;
  const store = getAdminStore();
  const order = store.order(id);
  if (!order) notFound();
  const couriers = store.couriers();
  const writable = can(actor.role, "orders.write");
  const refundable = can(actor.role, "orders.refund");
  const canAssign = can(actor.role, "deliveries.write");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/orders" className="text-sm text-muted hover:text-ink">
            ← Commandes
          </Link>
          <h1 className="mt-2 font-display text-3xl">{order.id}</h1>
          <p className="mt-1 text-sm text-muted">{formatDateTime(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-5">
          <div className="rounded-2xl bg-white p-5">
            <h2 className="text-sm font-semibold">Client</h2>
            <p className="mt-2 font-medium">{order.customerName}</p>
            <p className="text-sm text-muted">{order.customerEmail}</p>
            <p className="text-sm text-muted">{order.customerPhone}</p>
            <p className="mt-3 text-sm">
              {order.address}
              <br />
              {order.zip} {order.city}
            </p>
            {order.instructions ? <p className="mt-2 text-sm">Instructions : {order.instructions}</p> : null}
            <p className="mt-2 text-sm">Créneau : {order.slotLabel}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={`mailto:${order.customerEmail}`} className="rounded-full bg-cream px-3 py-1.5 text-sm">
                Email
              </a>
              <a href={`tel:${order.customerPhone.replace(/\s/g, "")}`} className="rounded-full bg-cream px-3 py-1.5 text-sm">
                Appeler
              </a>
              <Link href={`/admin/orders/${order.id}/print`} className="rounded-full bg-cream px-3 py-1.5 text-sm">
                Bon de préparation
              </Link>
              <Link href={`/admin/orders/${order.id}/label`} className="rounded-full bg-cream px-3 py-1.5 text-sm">
                Étiquette
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5">
            <h2 className="text-sm font-semibold">Plats</h2>
            <ul className="mt-3 divide-y divide-line">
              {order.lines.map((line) => (
                <li key={`${line.productId}-${line.name}`} className="flex justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium">
                      {line.quantity} × {line.name}
                    </p>
                    {line.allergens.length ? <p className="text-xs text-muted">Allergènes : {line.allergens.join(", ")}</p> : null}
                  </div>
                  <p>{formatPrice(line.unitPrice * line.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <dt>Sous-total</dt>
                <dd>{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Réduction {order.promoCode ? `(${order.promoCode})` : ""}</dt>
                <dd>− {formatPrice(order.discount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Livraison</dt>
                <dd>{order.shipping === 0 ? "Offerte" : formatPrice(order.shipping)}</dd>
              </div>
              <div className="flex justify-between font-semibold">
                <dt>Total</dt>
                <dd>{formatPrice(order.total)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-sm text-muted">
              {PAYMENT_LABELS[order.paymentMethod]} · {order.paymentStatus}
            </p>
          </div>
        </section>

        <aside className="space-y-5">
          {writable ? (
            <div className="rounded-2xl bg-white p-5">
              <h2 className="text-sm font-semibold">Statut</h2>
              <div className="mt-3 grid gap-2">
                {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[])
                  .filter((status) => status !== "remboursee" || refundable)
                  .map((status) => (
                    <form key={status} action={updateOrderStatus.bind(null, order.id, status)}>
                      <button
                        type="submit"
                        className="h-10 w-full rounded-xl border border-line text-sm hover:bg-cream disabled:opacity-40"
                        disabled={order.status === status}
                      >
                        {ORDER_STATUS_LABELS[status]}
                      </button>
                    </form>
                  ))}
              </div>
            </div>
          ) : null}

          {canAssign ? (
            <form action={assignOrderCourier.bind(null, order.id)} className="rounded-2xl bg-white p-5">
              <h2 className="text-sm font-semibold">Livreur</h2>
              <select name="courierId" defaultValue={order.courierId ?? ""} className="mt-3 h-10 w-full rounded-xl border border-line bg-cream px-3 text-sm">
                <option value="">Non assigné</option>
                {couriers.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <button type="submit" className="mt-3 h-10 w-full rounded-full bg-ink text-sm text-white">
                Assigner
              </button>
            </form>
          ) : null}

          <div className="rounded-2xl bg-white p-5">
            <h2 className="text-sm font-semibold">Historique</h2>
            <ol className="mt-3 space-y-3">
              {order.history.map((event, index) => (
                <li key={`${event.at}-${index}`} className="text-sm">
                  <span className="font-medium">{formatTime(event.at)}</span> {ORDER_STATUS_LABELS[event.status]}
                  <span className="block text-xs text-muted">{event.by}</span>
                </li>
              ))}
            </ol>
          </div>

          {writable ? (
            <form action={addOrderNote.bind(null, order.id)} className="rounded-2xl bg-white p-5">
              <h2 className="text-sm font-semibold">Note interne</h2>
              <textarea name="note" rows={3} className="mt-3 w-full rounded-xl border border-line bg-cream p-3 text-sm" />
              <button type="submit" className="mt-3 h-10 rounded-full bg-ink px-4 text-sm text-white">
                Ajouter
              </button>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {order.internalNotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </form>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
