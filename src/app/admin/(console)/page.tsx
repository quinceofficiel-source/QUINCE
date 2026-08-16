import { BarChart, KpiCard } from "@/components/admin/Charts";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireAdmin } from "@/lib/admin/dal";
import { getAdminStore } from "@/lib/admin/store";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/admin/types";
import { formatNumber, formatPrice } from "@/lib/format";

export const metadata = { title: "Dashboard" };

const todayKeys: OrderStatus[] = [
  "nouvelle",
  "confirmee",
  "en_preparation",
  "prete",
  "en_livraison",
  "livree",
  "annulee",
];

export default async function AdminDashboardPage() {
  await requireAdmin("dashboard");
  const stats = getAdminStore().dashboard();
  const recent = getAdminStore().orders().slice(0, 6);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">Aujourd’hui</p>
        <h1 className="mt-1 font-display text-3xl">Pilotage Quince</h1>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Commandes" value={formatNumber(stats.ordersToday)} />
        <KpiCard label="Chiffre d’affaires" value={formatPrice(stats.revenueToday)} />
        <KpiCard label="Panier moyen" value={formatPrice(stats.averageBasket)} />
        <KpiCard label="Nouveaux clients" value={formatNumber(stats.newCustomers)} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {todayKeys.map((key) => (
          <KpiCard key={key} label={ORDER_STATUS_LABELS[key]} value={formatNumber(stats.byStatus[key])} />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Ventes · 7 jours</h2>
          <div className="mt-4">
            <BarChart data={stats.sales7d} valueKey="revenue" />
          </div>
        </section>
        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Ventes · 30 jours</h2>
          <div className="mt-4">
            <BarChart data={stats.sales30d} valueKey="revenue" />
          </div>
        </section>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Plats les plus vendus</h2>
          <ul className="mt-4 space-y-3">
            {stats.topProducts.map((item) => (
              <li key={item.name} className="flex items-center justify-between text-sm">
                <span>{item.name}</span>
                <span className="font-medium">
                  {item.quantity} · {formatPrice(item.revenue)}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Dernières commandes</h2>
          <ul className="mt-4 divide-y divide-line">
            {recent.map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-xs text-muted">{order.customerName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span>{formatPrice(order.total)}</span>
                  <StatusBadge status={order.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
