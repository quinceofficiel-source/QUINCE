import { BarChart, KpiCard } from "@/components/admin/Charts";
import { requireAdmin } from "@/lib/admin/dal";
import { getAdminStore } from "@/lib/admin/store";
import { formatNumber, formatPrice } from "@/lib/format";

export const metadata = { title: "Analytics" };

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin("analytics");
  const params = await searchParams;
  const range = (Array.isArray(params.range) ? params.range[0] : params.range) === "7" ? 7 : 30;
  const store = getAdminStore();
  const stats = store.dashboard();
  const series = range === 7 ? stats.sales7d : stats.sales30d;
  const orders = store.orders().filter((order) => order.status !== "annulee" && order.status !== "remboursee");
  const customers = store.customers();
  const promotions = store.promotions();
  const repeat = customers.filter((customer) => orders.filter((order) => order.customerId === customer.id).length > 1).length;
  const cities = new Map<string, number>();
  orders.forEach((order) => cities.set(order.city, (cities.get(order.city) ?? 0) + 1));
  const categories = new Map<string, number>();
  const products = store.products();
  orders.forEach((order) => {
    order.lines.forEach((line) => {
      const product = products.find((item) => item.id === line.productId);
      const key = product?.category ?? "autre";
      categories.set(key, (categories.get(key) ?? 0) + line.quantity);
    });
  });

  const revenue = series.reduce((sum, item) => sum + item.revenue, 0);
  const count = series.reduce((sum, item) => sum + item.orders, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-3xl">Analytics</h1>
        <form className="flex gap-2">
          <select name="range" defaultValue={String(range)} className="h-10 rounded-full border border-line bg-white px-3 text-sm">
            <option value="7">7 jours</option>
            <option value="30">30 jours</option>
          </select>
          <button type="submit" className="h-10 rounded-full bg-ink px-4 text-sm text-white">
            Appliquer
          </button>
        </form>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="CA période" value={formatPrice(revenue)} />
        <KpiCard label="Commandes" value={formatNumber(count)} />
        <KpiCard label="Panier moyen" value={formatPrice(count ? revenue / count : 0)} />
        <KpiCard label="Taux de réachat" value={`${customers.length ? Math.round((repeat / customers.length) * 100) : 0} %`} />
      </div>
      <section className="rounded-2xl bg-white p-5">
        <h2 className="text-sm font-semibold">Évolution</h2>
        <div className="mt-4">
          <BarChart data={series} valueKey="revenue" />
        </div>
      </section>
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Top plats</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {stats.topProducts.map((item) => (
              <li key={item.name} className="flex justify-between">
                <span>{item.name}</span>
                <span>{item.quantity}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Top catégories</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {[...categories.entries()]
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([name, qty]) => (
                <li key={name} className="flex justify-between">
                  <span className="capitalize">{name}</span>
                  <span>{qty}</span>
                </li>
              ))}
          </ul>
        </section>
        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Villes</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {[...cities.entries()]
              .sort((a, b) => b[1] - a[1])
              .map(([name, qty]) => (
                <li key={name} className="flex justify-between">
                  <span>{name}</span>
                  <span>{qty}</span>
                </li>
              ))}
          </ul>
        </section>
      </div>
      <section className="rounded-2xl bg-white p-5">
        <h2 className="text-sm font-semibold">Codes promo</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {promotions
            .slice()
            .sort((a, b) => b.used - a.used)
            .map((promo) => (
              <li key={promo.id} className="flex justify-between">
                <span>{promo.code}</span>
                <span>{promo.used} utilisations</span>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
