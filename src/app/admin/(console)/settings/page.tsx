import { requireAdmin } from "@/lib/admin/dal";
import { getAdminStore } from "@/lib/admin/store";
import { ROLE_LABELS } from "@/lib/admin/types";
import { formatDateTime } from "@/lib/format";
import { DEMO_PASSWORD } from "@/lib/admin/seed";

export const metadata = { title: "Paramètres" };

export default async function SettingsPage() {
  const actor = await requireAdmin("settings");
  const store = getAdminStore();
  const staff = store.staffList();
  const logs = store.logs().slice(0, 20);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Paramètres</h1>
      <section className="rounded-2xl bg-white p-5">
        <h2 className="text-sm font-semibold">Équipe</h2>
        <ul className="mt-4 divide-y divide-line text-sm">
          {staff.map((item) => (
            <li key={item.id} className="flex justify-between py-3">
              <span>
                {item.name}
                <span className="ml-2 text-muted">{item.email}</span>
              </span>
              <span>{ROLE_LABELS[item.role]}</span>
            </li>
          ))}
        </ul>
        {actor.role === "super_admin" ? (
          <p className="mt-4 rounded-xl bg-cream px-4 py-3 text-xs text-muted">
            Comptes de démonstration (à remplacer par une base réelle) · mot de passe commun : {DEMO_PASSWORD}
          </p>
        ) : null}
      </section>
      <section className="rounded-2xl bg-white p-5">
        <h2 className="text-sm font-semibold">Journal d’activité</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {logs.map((log) => (
            <li key={log.id} className="flex justify-between gap-3">
              <span>
                {log.actorName} · {log.action} · {log.entityId}
              </span>
              <span className="text-muted">{formatDateTime(log.at)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
