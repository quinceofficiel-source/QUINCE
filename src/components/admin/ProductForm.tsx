import { saveProduct } from "@/lib/admin/actions";
import { CATEGORY_OPTIONS, type AdminProduct } from "@/lib/admin/types";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium">{label}</span>
      {children}
    </label>
  );
}

const input = "h-11 w-full rounded-xl border border-line bg-cream px-3 text-sm";

export function ProductForm({ product }: { product?: AdminProduct }) {
  const isNew = !product;
  return (
    <form action={saveProduct} className="grid gap-4 rounded-2xl bg-white p-6 lg:grid-cols-2">
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <input type="hidden" name="isNew" value={isNew ? "1" : "0"} />
      <Field label="Nom">
        <input name="name" required defaultValue={product?.name} className={input} />
      </Field>
      <Field label="Catégorie">
        <select name="category" defaultValue={product?.category ?? "maison"} className={input}>
          {CATEGORY_OPTIONS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Description courte">
        <input name="shortDescription" defaultValue={product?.shortDescription} className={input} />
      </Field>
      <Field label="Photo (URL)">
        <input name="image" defaultValue={product?.image} className={input} />
      </Field>
      <div className="lg:col-span-2">
        <Field label="Description">
          <textarea name="description" rows={4} defaultValue={product?.description} className="w-full rounded-xl border border-line bg-cream p-3 text-sm" />
        </Field>
      </div>
      <Field label="Prix">
        <input name="price" type="number" step="0.1" required defaultValue={product?.price} className={input} />
      </Field>
      <Field label="Prix promotionnel">
        <input name="promoPrice" type="number" step="0.1" defaultValue={product?.promoPrice ?? ""} className={input} />
      </Field>
      <Field label="Stock">
        <input name="stock" type="number" defaultValue={product?.stock ?? 0} className={input} />
      </Field>
      <Field label="Stock minimum">
        <input name="minStock" type="number" defaultValue={product?.minStock ?? 8} className={input} />
      </Field>
      <Field label="Poids (g)">
        <input name="weightGrams" type="number" defaultValue={product?.weightGrams ?? 400} className={input} />
      </Field>
      <Field label="Conservation">
        <input name="conservation" defaultValue={product?.conservation} className={input} />
      </Field>
      <Field label="Calories">
        <input name="calories" type="number" defaultValue={product?.calories} className={input} />
      </Field>
      <Field label="Protéines">
        <input name="protein" type="number" defaultValue={product?.protein} className={input} />
      </Field>
      <Field label="Glucides">
        <input name="carbs" type="number" defaultValue={product?.nutrition.carbs} className={input} />
      </Field>
      <Field label="Lipides">
        <input name="fat" type="number" defaultValue={product?.nutrition.fat} className={input} />
      </Field>
      <div className="lg:col-span-2">
        <Field label="Ingrédients (séparés par des virgules)">
          <input name="ingredients" defaultValue={product?.ingredients.join(", ")} className={input} />
        </Field>
      </div>
      <div className="lg:col-span-2">
        <Field label="Tags (famille, kids, proteine…)">
          <input name="tags" defaultValue={product?.tags.join(", ")} className={input} />
        </Field>
      </div>
      <div className="lg:col-span-2">
        <Field label="Allergènes">
          <input name="allergens" defaultValue={product?.allergens.join(", ")} className={input} />
        </Field>
      </div>
      <div className="flex flex-wrap gap-4 text-sm lg:col-span-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="active" defaultChecked={product?.active ?? true} /> Actif
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isNewFlag" defaultChecked={product?.isNew} /> Nouveauté
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isPopular" defaultChecked={product?.isPopular} /> Populaire
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isVegetarian" defaultChecked={product?.isVegetarian} /> Végétarien
        </label>
      </div>
      <div className="lg:col-span-2">
        <button type="submit" className="h-11 rounded-full bg-ink px-6 text-sm font-medium text-white">
          Enregistrer
        </button>
      </div>
    </form>
  );
}
