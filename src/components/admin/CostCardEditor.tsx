"use client";

import { useMemo, useState } from "react";
import { saveProductCostCard } from "@/lib/admin/actions";
import {
  PACKAGING_PRESETS,
  UNIT_LABELS,
  computeDishBreakdown,
  ingredientLineCost,
  laborCost,
  round2,
  type IngredientPricePoint,
  type MeasureUnit,
  type PackagingLine,
  type ProductCostCard,
  type ProfitabilitySettings,
  type RecipeIngredient,
} from "@/lib/admin/profitability";
import { MarginBadge, marginTextClass } from "@/components/admin/MarginBadge";
import { formatPrice } from "@/lib/format";

const input = "h-10 w-full rounded-xl border border-line bg-cream px-3 text-sm";
const units = Object.keys(UNIT_LABELS) as MeasureUnit[];

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function pct(value: number) {
  return `${value.toFixed(1).replace(".", ",")} %`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      {children}
    </label>
  );
}

function Num({
  value,
  onChange,
  step = "0.01",
}: {
  value: number;
  onChange: (value: number) => void;
  step?: string;
}) {
  return (
    <input
      type="number"
      min="0"
      step={step}
      value={Number.isFinite(value) ? value : 0}
      onChange={(event) => onChange(Number(event.target.value))}
      className={input}
    />
  );
}

export function CostCardEditor({
  productId,
  productName,
  price,
  card: initial,
  settings,
  history,
}: {
  productId: string;
  productName: string;
  price: number;
  card: ProductCostCard;
  settings: ProfitabilitySettings;
  history: IngredientPricePoint[];
}) {
  const [card, setCard] = useState(initial);
  const [simulating, setSimulating] = useState(false);
  const [simPrice, setSimPrice] = useState(price);
  const [simIngredients, setSimIngredients] = useState(0);
  const [simPackaging, setSimPackaging] = useState(0);
  const [simDelivery, setSimDelivery] = useState(settings.deliveryPerOrder);
  const [simPromo, setSimPromo] = useState(card.other.promo);
  const [saved, setSaved] = useState(false);

  const live = useMemo(() => {
    const delivery = simulating
      ? simDelivery
      : settings.allocateDeliveryToDishes
        ? settings.deliveryPerOrder
        : 0;
    return computeDishBreakdown(card, simulating ? simPrice : price, settings, {
      delivery,
      promo: simulating ? simPromo : card.other.promo,
      ingredientsAbsolute: simulating ? simIngredients : undefined,
      packagingAbsolute: simulating ? simPackaging : undefined,
    });
  }, [card, price, settings, simulating, simPrice, simIngredients, simPackaging, simDelivery, simPromo]);

  const relatedHistory = history
    .filter((point) => card.ingredients.some((line) => line.name.toLowerCase() === point.name.toLowerCase()))
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 12);

  function startSim() {
    setSimPrice(price);
    setSimIngredients(live.ingredients);
    setSimPackaging(live.packaging);
    setSimDelivery(settings.deliveryPerOrder);
    setSimPromo(card.other.promo);
    setSimulating(true);
  }

  function updateIngredient(id: string, patch: Partial<RecipeIngredient>) {
    setCard((current) => ({
      ...current,
      ingredients: current.ingredients.map((line) => (line.id === id ? { ...line, ...patch } : line)),
    }));
  }

  function updatePack(id: string, patch: Partial<PackagingLine>) {
    setCard((current) => ({
      ...current,
      packaging: current.packaging.map((line) => (line.id === id ? { ...line, ...patch } : line)),
    }));
  }

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        {simulating ? (
          <section className="rounded-2xl border border-ink bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold">Simulation</h2>
                <p className="text-xs text-muted">Aucun enregistrement : les vraies données restent intactes.</p>
              </div>
              <button type="button" onClick={() => setSimulating(false)} className="rounded-full bg-cream px-3 py-1.5 text-sm">
                Quitter
              </button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label={`Prix de vente ${formatPrice(simPrice)}`}>
                <input type="range" min="4" max="24" step="0.1" value={simPrice} onChange={(event) => setSimPrice(Number(event.target.value))} className="w-full" />
              </Field>
              <Field label={`Ingrédients ${formatPrice(simIngredients)}`}>
                <input type="range" min="0" max="12" step="0.05" value={simIngredients} onChange={(event) => setSimIngredients(Number(event.target.value))} className="w-full" />
              </Field>
              <Field label={`Packaging ${formatPrice(simPackaging)}`}>
                <input type="range" min="0" max="6" step="0.05" value={simPackaging} onChange={(event) => setSimPackaging(Number(event.target.value))} className="w-full" />
              </Field>
              <Field label={`Livraison ${formatPrice(simDelivery)}`}>
                <input type="range" min="0" max="12" step="0.1" value={simDelivery} onChange={(event) => setSimDelivery(Number(event.target.value))} className="w-full" />
              </Field>
              <Field label={`Remise client ${formatPrice(simPromo)}`}>
                <input type="range" min="0" max="5" step="0.05" value={simPromo} onChange={(event) => setSimPromo(Number(event.target.value))} className="w-full" />
              </Field>
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">Ingrédients</h2>
            <button
              type="button"
              className="text-sm underline-offset-2 hover:underline"
              onClick={() =>
                setCard((current) => ({
                  ...current,
                  ingredients: [
                    ...current.ingredients,
                    { id: uid("ing"), name: "", quantityUsed: 100, unit: "g", purchasePrice: 0, purchaseQty: 1, purchaseUnit: "kg" },
                  ],
                }))
              }
            >
              Ajouter
            </button>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs text-muted">
                <tr>
                  <th className="pb-2 font-medium">Nom</th>
                  <th className="pb-2 font-medium">Qté recette</th>
                  <th className="pb-2 font-medium">Unité</th>
                  <th className="pb-2 font-medium">Prix d’achat</th>
                  <th className="pb-2 font-medium">Qté achetée</th>
                  <th className="pb-2 font-medium">Unité achat</th>
                  <th className="pb-2 font-medium">Coût</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {card.ingredients.map((line) => (
                  <tr key={line.id} className="border-t border-line/70">
                    <td className="py-2 pr-2">
                      <input value={line.name} onChange={(event) => updateIngredient(line.id, { name: event.target.value })} className={input} />
                    </td>
                    <td className="py-2 pr-2">
                      <Num value={line.quantityUsed} onChange={(value) => updateIngredient(line.id, { quantityUsed: value })} step="1" />
                    </td>
                    <td className="py-2 pr-2">
                      <select value={line.unit} onChange={(event) => updateIngredient(line.id, { unit: event.target.value as MeasureUnit })} className={input}>
                        {units.map((unit) => (
                          <option key={unit} value={unit}>
                            {UNIT_LABELS[unit]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 pr-2">
                      <Num value={line.purchasePrice} onChange={(value) => updateIngredient(line.id, { purchasePrice: value })} />
                    </td>
                    <td className="py-2 pr-2">
                      <Num value={line.purchaseQty} onChange={(value) => updateIngredient(line.id, { purchaseQty: value })} />
                    </td>
                    <td className="py-2 pr-2">
                      <select value={line.purchaseUnit} onChange={(event) => updateIngredient(line.id, { purchaseUnit: event.target.value as MeasureUnit })} className={input}>
                        {units.map((unit) => (
                          <option key={unit} value={unit}>
                            {UNIT_LABELS[unit]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 font-medium">{formatPrice(ingredientLineCost(line))}</td>
                    <td className="py-2">
                      <button type="button" className="text-xs text-muted" onClick={() => setCard((current) => ({ ...current, ingredients: current.ingredients.filter((item) => item.id !== line.id) }))}>
                        Retirer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm font-semibold">Coût total ingrédients : {formatPrice(live.ingredients)}</p>
        </section>

        <section className="rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">Coût du packaging</h2>
            <button
              type="button"
              className="text-sm underline-offset-2 hover:underline"
              onClick={() =>
                setCard((current) => ({
                  ...current,
                  packaging: [...current.packaging, { id: uid("pack"), name: "Autre", unitPrice: 0, quantity: 1, scope: "dish" }],
                }))
              }
            >
              Ajouter
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {card.packaging.map((line) => (
              <li key={line.id} className="grid gap-2 rounded-xl bg-cream p-3 sm:grid-cols-[1.3fr_0.7fr_0.5fr_0.9fr_auto]">
                <input list="pack-presets" value={line.name} onChange={(event) => updatePack(line.id, { name: event.target.value })} className={input} />
                <Num value={line.unitPrice} onChange={(value) => updatePack(line.id, { unitPrice: value })} />
                <Num value={line.quantity} onChange={(value) => updatePack(line.id, { quantity: value })} step="1" />
                <select value={line.scope} onChange={(event) => updatePack(line.id, { scope: event.target.value as PackagingLine["scope"] })} className={input}>
                  <option value="dish">Par plat</option>
                  <option value="order">Par commande / box</option>
                </select>
                <button type="button" className="text-xs text-muted" onClick={() => setCard((current) => ({ ...current, packaging: current.packaging.filter((item) => item.id !== line.id) }))}>
                  Retirer
                </button>
              </li>
            ))}
          </ul>
          <datalist id="pack-presets">
            {PACKAGING_PRESETS.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
          <p className="mt-3 text-sm font-semibold">Coût packaging par plat : {formatPrice(live.packagingDish)}</p>
          <p className="text-xs text-muted">
            Les lignes « commande / box » ne sont pas imputées au plat : elles apparaissent dans la rentabilité de la commande.
          </p>
        </section>

        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Coût de production</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Temps de préparation (min)">
              <Num value={card.production.prepMinutes} onChange={(value) => setCard((current) => ({ ...current, production: { ...current.production, prepMinutes: value } }))} step="1" />
            </Field>
            <Field label="Coût horaire cuisine">
              <Num value={card.production.hourlyRate} onChange={(value) => setCard((current) => ({ ...current, production: { ...current.production, hourlyRate: value } }))} />
            </Field>
            <Field label="Énergie">
              <Num value={card.production.energy} onChange={(value) => setCard((current) => ({ ...current, production: { ...current.production, energy: value } }))} />
            </Field>
            <Field label="Stockage">
              <Num value={card.production.storage} onChange={(value) => setCard((current) => ({ ...current, production: { ...current.production, storage: value } }))} />
            </Field>
            <Field label="Pertes alimentaires (%)">
              <Num value={card.production.foodWastePercent} onChange={(value) => setCard((current) => ({ ...current, production: { ...current.production, foodWastePercent: value } }))} step="0.1" />
            </Field>
            <Field label="Frais de production divers">
              <Num value={card.production.misc} onChange={(value) => setCard((current) => ({ ...current, production: { ...current.production, misc: value } }))} />
            </Field>
          </div>
          <p className="mt-3 text-sm font-semibold">Main-d’œuvre estimée : {formatPrice(laborCost(card.production))}</p>
        </section>

        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Coût de livraison</h2>
          <p className="mt-2 text-sm text-muted">
            Coût moyen par commande : {formatPrice(settings.deliveryPerOrder)} · interne {formatPrice(settings.deliveryInternal)} · prestataire {formatPrice(settings.deliveryExternal)} · carburant {formatPrice(settings.deliveryFuel)} · kilométrage {formatPrice(settings.deliveryKmCost)}.
          </p>
          <p className="mt-2 text-sm">
            {settings.allocateDeliveryToDishes
              ? "Réparti sur les plats de la commande."
              : "Compté séparément dans la rentabilité de la commande."}
          </p>
        </section>

        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Autres coûts</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Commission paiement (%)">
              <Num value={card.other.paymentPercent} onChange={(value) => setCard((current) => ({ ...current, other: { ...current.other, paymentPercent: value } }))} step="0.1" />
            </Field>
            <Field label="Commission Stripe / fixe">
              <Num value={card.other.paymentFixed} onChange={(value) => setCard((current) => ({ ...current, other: { ...current.other, paymentFixed: value } }))} />
            </Field>
            <Field label="Frais bancaires">
              <Num value={card.other.bankFees ?? 0} onChange={(value) => setCard((current) => ({ ...current, other: { ...current.other, bankFees: value } }))} />
            </Field>
            <Field label="Marketing">
              <Num value={card.other.marketing} onChange={(value) => setCard((current) => ({ ...current, other: { ...current.other, marketing: value } }))} />
            </Field>
            <Field label="Remise / code promo">
              <Num value={card.other.promo} onChange={(value) => setCard((current) => ({ ...current, other: { ...current.other, promo: value } }))} />
            </Field>
            <Field label="Coût d’acquisition">
              <Num value={card.other.cac} onChange={(value) => setCard((current) => ({ ...current, other: { ...current.other, cac: value } }))} />
            </Field>
            <Field label="Pertes">
              <Num value={card.other.losses} onChange={(value) => setCard((current) => ({ ...current, other: { ...current.other, losses: value } }))} />
            </Field>
            <Field label="Remboursement moyen">
              <Num value={card.other.avgRefund} onChange={(value) => setCard((current) => ({ ...current, other: { ...current.other, avgRefund: value } }))} />
            </Field>
            <Field label="Autres frais variables">
              <Num value={card.other.misc} onChange={(value) => setCard((current) => ({ ...current, other: { ...current.other, misc: value } }))} />
            </Field>
          </div>
          <p className="mt-3 text-xs text-muted">TVA {settings.vatRate} % : le prix HT et la marge sont calculés hors taxe, la TVA n’est pas un coût.</p>
        </section>

        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Historique des coûts</h2>
          {relatedHistory.length ? (
            <ul className="mt-3 space-y-2 text-sm">
              {relatedHistory.map((point) => (
                <li key={point.id} className="flex justify-between gap-3">
                  <span>
                    {point.name} · {new Date(point.at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                  </span>
                  <span>
                    {formatPrice(point.price)} / {point.qty} {UNIT_LABELS[point.unit]}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">Les évolutions de prix d’achat apparaîtront ici.</p>
          )}
          <p className="mt-3 text-xs text-muted">Les commandes déjà passées conservent le snapshot de coûts du moment : rien n’est recalculé rétroactivement.</p>
        </section>

        {!simulating ? (
          <form
            action={async (formData) => {
              await saveProductCostCard(formData);
              setSaved(true);
            }}
            className="flex flex-wrap items-center gap-3"
          >
            <input type="hidden" name="productId" value={productId} />
            <input type="hidden" name="payload" value={JSON.stringify(card)} />
            <button type="submit" className="h-11 rounded-full bg-ink px-5 text-sm font-medium text-white">
              Enregistrer les coûts
            </button>
            <button type="button" onClick={startSim} className="h-11 rounded-full border border-line bg-white px-5 text-sm">
              Simuler une modification
            </button>
            {saved ? <span className="text-sm text-emerald-800">Enregistré.</span> : null}
          </form>
        ) : null}
      </div>

      <aside className="space-y-4 xl:sticky xl:top-20">
        <section className="rounded-2xl bg-ink p-5 text-white">
          <p className="text-xs font-semibold tracking-[0.16em] uppercase text-white/60">{productName}</p>
          <p className="mt-3 text-sm text-white/70">Prix de vente</p>
          <p className="text-3xl font-semibold">{formatPrice(live.sellPriceTtc)}</p>
          <p className="mt-1 text-xs text-white/50">HT {formatPrice(live.sellPriceHt)} · TVA {formatPrice(live.vat)}</p>
          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>Ingrédients</dt>
              <dd>{formatPrice(live.ingredients)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Packaging</dt>
              <dd>{formatPrice(live.packaging)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Production</dt>
              <dd>{formatPrice(live.production)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Paiement</dt>
              <dd>{formatPrice(live.payment)}</dd>
            </div>
            {live.delivery ? (
              <div className="flex justify-between">
                <dt>Livraison</dt>
                <dd>{formatPrice(live.delivery)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-white/15 pt-2 font-semibold">
              <dt>Coût total</dt>
              <dd>{formatPrice(live.total)}</dd>
            </div>
          </dl>
        </section>
        <section className="rounded-2xl bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium tracking-wide text-muted uppercase">Bénéfice</p>
            <MarginBadge status={live.status} />
          </div>
          <p className={`mt-2 text-3xl font-semibold ${marginTextClass(live.status)}`}>{formatPrice(live.marginEuro)}</p>
          <p className={`mt-1 text-lg font-semibold ${marginTextClass(live.status)}`}>{pct(live.marginPercent)}</p>
          <p className="mt-3 text-sm">
            Food Cost {pct(live.foodCostPercent)}
            <span className="text-muted"> · cible {settings.foodCostMinPercent}–{settings.foodCostMaxPercent} %</span>
          </p>
          <p className="mt-4 text-sm">
            Objectif marge {settings.targetMarginPercent} %
            <span className="mt-1 block text-xs text-muted">Prix conseillé {formatPrice(live.suggestedPriceTtc)}</span>
          </p>
          {live.gapToTarget > 0.04 ? (
            <p className="mt-3 rounded-xl bg-quince/40 px-3 py-2 text-sm">
              Il manque {formatPrice(live.gapToTarget)} pour atteindre votre objectif de marge.
            </p>
          ) : (
            <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">Objectif de marge atteint ou dépassé.</p>
          )}
          <p className="mt-3 text-xs text-muted">Prix actuel {formatPrice(live.sellPriceTtc)} · conseillé {formatPrice(round2(live.suggestedPriceTtc))}</p>
        </section>
      </aside>
    </div>
  );
}
