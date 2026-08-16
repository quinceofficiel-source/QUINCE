import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/admin/dal";
import { getAdminStore } from "@/lib/admin/store";
import { ORDER_STATUS_LABELS, PAYMENT_LABELS, type OrderStatus } from "@/lib/admin/types";
import { formatDateTime, formatPrice } from "@/lib/format";

export const metadata = { title: "Commandes" };

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin("orders.read");
  const params = await searchParams;
  const q = (one(params.q) ?? "").toLowerCase();
  const status = one(params.status) as OrderStatus | undefined;
  const city = (one(params.city) ?? "").toLowerCase();
  const courier = one(params.courier);
  const date = one(params.date);

  const store = getAdminStore();
  const couriers = store.couriers();
  let orders = store.orders();
  if (q) {
    orders = orders.filter(
      (order) =>
        order.id.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerEmail.toLowerCase().includes(q),
    );
  }
  if (status) orders = orders.filter((order) => order.status === status);
  if (city) orders = orders.filter((order) => order.city.toLowerCase().includes(city));
  if (courier) orders = orders.filter((order) => order.courierId === courier);
  if (date) orders = orders.filter((order) => order.createdAt.slice(0, 10) === date);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Commandes</h1>
          <p className="mt-1 text-sm text-muted">{orders.length} résultat{orders.length > 1 ? "s" : ""}</p>
        </div>
      </div>
      <form className="grid gap-2 rounded-2xl bg-white p-4 sm:grid-cols-2 lg:grid-cols-6">
        <input name="q" defaultValue={q} placeholder="N° commande, client…" className="h-10 rounded-xl border border-line bg-cream px-3 text-sm lg:col-span-2" />
        <input type="date" name="date" defaultValue={date} className="h-10 rounded-xl border border-line bg-cream px-3 text-sm" />
        <select name="status" defaultValue={status ?? ""} className="h-10 rounded-xl border border-line bg-cream px-3 text-sm">
          <option value="">Tous les statuts</option>
          {Object.entries(ORDER_STATUS_LABELS).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
        <input name="city" defaultValue={city} placeholder="Ville" className="h-10 rounded-xl border border-line bg-cream px-3 text-sm" />
        <select name="courier" defaultValue={courier ?? ""} className="h-10 rounded-xl border border-line bg-cream px-3 text-sm">
          <option value="">Tous les livreurs</option>
          {couriers.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <button type="submit" className="h-10 rounded-full bg-ink text-sm font-medium text-white sm:col-span-2 lg:col-span-6">
          Filtrer
        </button>
      </form>
      <div className="overflow-x-auto rounded-2xl bg-white">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-line text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">N°</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Plats</th>
              <th className="px-4 py-3 font-medium">Montant</th>
              <th className="px-4 py-3 font-medium">Paiement</th>
              <th className="px-4 py-3 font-medium">Adresse</th>
              <th className="px-4 py-3 font-medium">Créneau</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-line/70 last:border-0">
                <td className="px-4 py-3 font-medium">{order.id}</td>
                <td className="px-4 py-3">{order.customerName}</td>
                <td className="px-4 py-3 text-muted">{formatDateTime(order.createdAt)}</td>
                <td className="px-4 py-3">{order.lines.reduce((sum, line) => sum + line.quantity, 0)}</td>
                <td className="px-4 py-3">{formatPrice(order.total)}</td>
                <td className="px-4 py-3">{PAYMENT_LABELS[order.paymentMethod]}</td>
                <td className="px-4 py-3">
                  {order.zip} {order.city}
                </td>
                <td className="px-4 py-3">{order.slotLabel}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="text-sm font-medium underline-offset-2 hover:underline">
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
