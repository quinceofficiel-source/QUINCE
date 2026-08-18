import Link from "next/link";
import { DualBars, KpiCard, MetricBars } from "@/components/admin/Charts";
import { BoxProfitPanel } from "@/components/admin/BoxProfitPanel";
import { MarginBadge } from "@/components/admin/MarginBadge";
import { ProfitSettingsForm } from "@/components/admin/ProfitSettingsForm";
import { ProfitabilityTable } from "@/components/admin/ProfitabilityTable";
import { requireAdmin } from "@/lib/admin/dal";
import {
  buildProfitAlerts,
  boxRows,
  ingredientTrend,
  marginByCategory,
  monthlySeries,
  rowsForProducts,
  todayProfitKpis,
} from "@/lib/admin/profit-report";
import { getAdminStore } from "@/lib/admin/store";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Marges & Rentabilité" };

function pct(value: number) {
  return `${value.toFixed(1).replace(".", ",")} %`;
}

export default async function ProfitabilityPage() {
  await requireAdmin("profitability");
  const store = getAdminStore();
  const products = store.products();
  const profit = store.profitability();
  const orders = store.orders();
  const rows = rowsForProducts(products, profit.cards, profit.settings);
  const kpis = todayProfitKpis(
    orders,
    (id) => store.costCard(id),
    (id) => products.find((item) => item.id === id)?.price ?? 0,
    profit.settings,
  );
  const alerts = buildProfitAlerts(rows, profit.history, profit.settings);
  const ranked = rows.slice().sort((a, b) => b.marginPercent - a.marginPercent);
  const top = ranked.slice(0, 5);
  const flop = ranked.slice(-5).reverse();
  const danger = rows.filter((row) => row.status === "bad" || row.marginEuro < 0);
  const months = monthlySeries(
    orders,
    (id) => store.costCard(id),
    (id) => products.find((item) => item.id === id)?.price ?? 0,
    profit.settings,
  );
  const trends = ingredientTrend(profit.history).slice(0, 6);
  const categories = marginByCategory(rows);
  const boxes = boxRows(rows, profit.settings);
  const orderMargins = orders
    .filter((order) => order.status !== "annulee" && order.status !== "remboursee")
    .slice(0, 8)
    .map((order) => ({
      label: order.id.replace("ord-", "#"),
      value: order.costSnapshot?.margin ?? 0,
    }));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">Pilotage financier</p>
        <h1 className="mt-1 font-display text-3xl">Marges & Rentabilité</h1>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        <KpiCard label="CA aujourd’hui" value={formatPrice(kpis.revenue)} />
        <KpiCard label="Coût matières" value={formatPrice(kpis.ingredients)} />
        <KpiCard label="Coût packaging" value={formatPrice(kpis.packaging)} />
        <KpiCard label="Coût livraison" value={formatPrice(kpis.delivery)} />
        <KpiCard label="Marge brute" value={formatPrice(kpis.margin)} />
        <KpiCard label="Bénéfice estimé" value={formatPrice(kpis.margin)} hint={`${kpis.orders} commandes`} />
        <KpiCard label="Marge moyenne" value={pct(kpis.marginPercent)} />
      </div>

      {alerts.length ? (
        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Alertes</h2>
          <ul className="mt-3 space-y-2">
            {alerts.map((alert) => (
              <li key={alert.id}>
                <Link href={alert.href} className="flex items-start justify-between gap-3 rounded-xl bg-cream px-3 py-2 text-sm">
                  <span>
                    <span className="font-medium">{alert.title}</span>
                    <span className="mt-0.5 block text-xs text-muted">{alert.body}</span>
                  </span>
                  <MarginBadge status={alert.tone === "info" ? "ok" : alert.tone} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-3">
        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Top 5 plats les plus rentables</h2>
          <ol className="mt-3 space-y-2 text-sm">
            {top.map((row, index) => (
              <li key={row.productId} className="flex justify-between gap-3">
                <Link href={`/admin/profitability/${row.productId}`}>
                  {index + 1}. {row.name}
                </Link>
                <span className="font-medium">{pct(row.marginPercent)}</span>
              </li>
            ))}
          </ol>
        </section>
        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Top 5 plats les moins rentables</h2>
          <ol className="mt-3 space-y-2 text-sm">
            {flop.map((row, index) => (
              <li key={row.productId} className="flex justify-between gap-3">
                <Link href={`/admin/profitability/${row.productId}`}>
                  {index + 1}. {row.name}
                </Link>
                <span className="font-medium">{pct(row.marginPercent)}</span>
              </li>
            ))}
          </ol>
        </section>
        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Plats dangereux</h2>
          {danger.length ? (
            <ul className="mt-3 space-y-2 text-sm">
              {danger.map((row) => (
                <li key={row.productId} className="flex items-center justify-between gap-3">
                  <Link href={`/admin/profitability/${row.productId}`}>{row.name}</Link>
                  <MarginBadge status={row.marginEuro < 0 ? "bad" : row.status} label={row.marginEuro < 0 ? "Marge négative" : "Marge faible"} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">Aucun plat sous le seuil critique.</p>
          )}
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Marge moyenne par mois</h2>
          <div className="mt-4">
            <MetricBars data={months.map((item) => ({ label: item.date, value: item.marginPercent }))} format={(value) => pct(value)} />
          </div>
        </section>
        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">CA vs coût total</h2>
          <p className="mt-1 text-xs text-muted">Noir = CA · Jaune = coût</p>
          <div className="mt-4">
            <DualBars data={months.map((item) => ({ label: item.date, a: item.revenue, b: item.cost }))} />
          </div>
        </section>
        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Évolution du coût des ingrédients</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {trends.map((item) => (
              <li key={item.key} className="flex justify-between gap-3">
                <span>{item.name}</span>
                <span>
                  {formatPrice(item.last.price)}{" "}
                  <span className={item.change > 0 ? "text-rose-800" : "text-emerald-800"}>
                    {item.change > 0 ? "+" : ""}
                    {item.change.toFixed(0)} %
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Marge par catégorie</h2>
          <div className="mt-4">
            <MetricBars data={categories.map((item) => ({ label: item.label, value: item.value }))} format={(value) => pct(value)} />
          </div>
        </section>
        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Rentabilité des box (auto)</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {boxes.map((box) => (
              <li key={box.size} className="flex justify-between">
                <span>Box {box.size} plats</span>
                <span>
                  {formatPrice(box.marginEuro)} · {pct(box.marginPercent)}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Bénéfice par commande</h2>
          <div className="mt-4">
            <MetricBars data={orderMargins} format={(value) => formatPrice(value)} />
          </div>
        </section>
      </div>

      <BoxProfitPanel rows={rows} settings={profit.settings} />

      <ProfitabilityTable rows={rows} />

      <ProfitSettingsForm settings={profit.settings} />
    </div>
  );
}
