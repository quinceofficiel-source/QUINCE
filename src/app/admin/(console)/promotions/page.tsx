import { savePromotion, togglePromotion } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/dal";
import { getAdminStore } from "@/lib/admin/store";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Promotions" };

export default async function PromotionsPage() {
  await requireAdmin("promotions.read");
  const promotions = getAdminStore().promotions();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Promotions</h1>
      <div className="overflow-x-auto rounded-2xl bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Valeur</th>
              <th className="px-4 py-3 font-medium">Période</th>
              <th className="px-4 py-3 font-medium">Min.</th>
              <th className="px-4 py-3 font-medium">Utilisations</th>
              <th className="px-4 py-3 font-medium">État</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo) => (
              <tr key={promo.id} className="border-b border-line/70">
                <td className="px-4 py-3 font-semibold">{promo.code}</td>
                <td className="px-4 py-3">{promo.type}</td>
                <td className="px-4 py-3">{promo.type === "percent" ? `${promo.value} %` : promo.value}</td>
                <td className="px-4 py-3">
                  {formatDate(promo.startsAt)} → {formatDate(promo.endsAt)}
                </td>
                <td className="px-4 py-3">{promo.minOrder} €</td>
                <td className="px-4 py-3">
                  {promo.used} / {promo.maxUses}
                </td>
                <td className="px-4 py-3">
                  <form action={togglePromotion.bind(null, promo.id)}>
                    <button type="submit" className="text-sm">
                      {promo.active ? "Actif" : "Inactif"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form action={savePromotion} className="grid gap-3 rounded-2xl bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
        <h2 className="text-sm font-semibold sm:col-span-2 lg:col-span-3">Créer une promotion</h2>
        <input type="hidden" name="isNew" value="1" />
        <input name="code" required placeholder="Code" className="h-11 rounded-xl border border-line bg-cream px-3 text-sm" />
        <select name="type" className="h-11 rounded-xl border border-line bg-cream px-3 text-sm">
          <option value="percent">Réduction %</option>
          <option value="fixed">Réduction fixe</option>
          <option value="free_shipping">Livraison gratuite</option>
          <option value="first_order">Première commande</option>
          <option value="referral">Parrainage</option>
        </select>
        <input name="value" type="number" defaultValue={10} className="h-11 rounded-xl border border-line bg-cream px-3 text-sm" />
        <input name="startsAt" type="datetime-local" required className="h-11 rounded-xl border border-line bg-cream px-3 text-sm" />
        <input name="endsAt" type="datetime-local" required className="h-11 rounded-xl border border-line bg-cream px-3 text-sm" />
        <input name="minOrder" type="number" placeholder="Minimum commande" className="h-11 rounded-xl border border-line bg-cream px-3 text-sm" />
        <input name="maxUses" type="number" placeholder="Max utilisations" className="h-11 rounded-xl border border-line bg-cream px-3 text-sm" />
        <select name="eligible" className="h-11 rounded-xl border border-line bg-cream px-3 text-sm">
          <option value="all">Tous les clients</option>
          <option value="new">Nouveaux clients</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked /> Active
        </label>
        <button type="submit" className="h-11 rounded-full bg-ink text-sm text-white sm:col-span-2 lg:col-span-3">
          Enregistrer
        </button>
      </form>
    </div>
  );
}
