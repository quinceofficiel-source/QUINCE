import Link from "next/link";
import { removeEditorialCampaign, toggleEditorialCampaign } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/dal";
import { getAdminStore } from "@/lib/admin/store";
import { EDITORIAL_TYPE_LABELS } from "@/lib/admin/types";
import { isEditorialLive } from "@/lib/editorial";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Éditorial" };

export default async function EditorialAdminPage() {
  await requireAdmin("promotions.read");
  const campaigns = getAdminStore().editorialCampaigns().sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Éditorial catalogue</h1>
          <p className="mt-1 max-w-xl text-sm text-muted">
            Une seule bannière s’affiche au milieu du catalogue, après les premiers plats. Activez celle que vous voulez
            mettre en avant.
          </p>
        </div>
        <Link href="/admin/editorial/new" className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-sm font-medium text-white">
          Nouvelle bannière
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-line text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Ordre</th>
              <th className="px-4 py-3 font-medium">Titre</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Période</th>
              <th className="px-4 py-3 font-medium">Live</th>
              <th className="px-4 py-3 font-medium">État</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="border-b border-line/70">
                <td className="px-4 py-3">{campaign.order}</td>
                <td className="px-4 py-3 font-medium">{campaign.title}</td>
                <td className="px-4 py-3">{EDITORIAL_TYPE_LABELS[campaign.campaignType]}</td>
                <td className="px-4 py-3">
                  {formatDate(campaign.startsAt)} → {formatDate(campaign.endsAt)}
                </td>
                <td className="px-4 py-3">{isEditorialLive(campaign) ? "Visible" : "—"}</td>
                <td className="px-4 py-3">
                  <form action={toggleEditorialCampaign.bind(null, campaign.id)}>
                    <button type="submit" className="text-sm underline-offset-2 hover:underline">
                      {campaign.active ? "Actif" : "Inactif"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/editorial/${campaign.id}`} className="mr-3 text-sm hover:underline">
                    Modifier
                  </Link>
                  <form action={removeEditorialCampaign.bind(null, campaign.id)} className="inline">
                    <button type="submit" className="text-sm text-muted hover:text-ink">
                      Supprimer
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
