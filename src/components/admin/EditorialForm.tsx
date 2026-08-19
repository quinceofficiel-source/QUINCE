import { saveEditorialCampaign } from "@/lib/admin/actions";
import { EDITORIAL_TYPE_LABELS, type EditorialCampaign } from "@/lib/admin/types";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium">{label}</span>
      {children}
    </label>
  );
}

const input = "h-11 w-full rounded-xl border border-line bg-cream px-3 text-sm";

function toLocalInput(iso?: string) {
  const date = iso ? new Date(iso) : new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function themeValue(campaign?: EditorialCampaign) {
  if (campaign?.backgroundColor === "#ffd400") return "jaune";
  if (campaign?.backgroundColor === "#ffffff") return "blanc";
  return "noir";
}

export function EditorialForm({ campaign }: { campaign?: EditorialCampaign }) {
  const isNew = !campaign;
  return (
    <form action={saveEditorialCampaign} className="grid gap-4 rounded-2xl bg-white p-6 lg:grid-cols-2">
      <input type="hidden" name="id" value={campaign?.id ?? ""} />
      <input type="hidden" name="isNew" value={isNew ? "1" : "0"} />
      <Field label="Titre">
        <input name="title" required defaultValue={campaign?.title} className={input} placeholder="Quince chaque semaine." />
      </Field>
      <Field label="Badge (optionnel)">
        <input name="badge" defaultValue={campaign?.badge} className={input} placeholder="Routine" />
      </Field>
      <div className="lg:col-span-2">
        <Field label="Sous-titre">
          <textarea
            name="subtitle"
            rows={3}
            defaultValue={campaign?.subtitle}
            className="w-full rounded-xl border border-line bg-cream p-3 text-sm"
            placeholder="Vos plats préférés reviennent chez vous, sans avoir à y penser."
          />
        </Field>
      </div>
      <Field label="Texte du bouton">
        <input name="buttonLabel" required defaultValue={campaign?.buttonLabel} className={input} />
      </Field>
      <Field label="Lien du bouton">
        <input name="buttonLink" required defaultValue={campaign?.buttonLink ?? "/composer-ma-box"} className={input} placeholder="/composer-ma-box" />
      </Field>
      <Field label="Type de campagne">
        <select name="campaignType" defaultValue={campaign?.campaignType ?? "subscription"} className={input}>
          {Object.entries(EDITORIAL_TYPE_LABELS).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Couleurs">
        <select name="theme" defaultValue={themeValue(campaign)} className={input}>
          <option value="noir">Noir, texte blanc</option>
          <option value="jaune">Jaune Quince, texte noir</option>
          <option value="blanc">Blanc, texte noir</option>
        </select>
      </Field>
      <Field label="Image (URL)">
        <input name="image" defaultValue={campaign?.image} className={input} placeholder="https://…" />
      </Field>
      <Field label="Ou importer une image">
        <input name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="w-full text-sm" />
      </Field>
      <Field label="Début">
        <input name="startsAt" type="datetime-local" required defaultValue={toLocalInput(campaign?.startsAt)} className={input} />
      </Field>
      <Field label="Fin">
        <input name="endsAt" type="datetime-local" required defaultValue={toLocalInput(campaign?.endsAt)} className={input} />
      </Field>
      <Field label="Ordre d’affichage (1 = prioritaire)">
        <input name="order" type="number" min={1} defaultValue={campaign?.order ?? 1} className={input} />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" defaultChecked={campaign?.active ?? false} /> Active
      </label>
      <div className="lg:col-span-2">
        <p className="mb-3 text-xs text-muted">Une seule bannière active s’affiche sur le catalogue, celle au plus petit ordre et dans sa période.</p>
        <button type="submit" className="h-11 rounded-full bg-ink px-6 text-sm font-medium text-white">
          Enregistrer
        </button>
      </div>
    </form>
  );
}
