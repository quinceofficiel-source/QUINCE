"use client";

import { useState } from "react";
import { saveProfitSettings } from "@/lib/admin/actions";
import { deliveryTotal, type ProfitabilitySettings } from "@/lib/admin/profitability";
import { formatPrice } from "@/lib/format";

const input = "h-10 w-full rounded-xl border border-line bg-cream px-3 text-sm";

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

export function ProfitSettingsForm({ settings: initial }: { settings: ProfitabilitySettings }) {
  const [settings, setSettings] = useState(initial);
  const [saved, setSaved] = useState(false);
  const total = deliveryTotal(settings);

  return (
    <form
      action={async (formData) => {
        await saveProfitSettings(formData);
        setSaved(true);
      }}
      className="rounded-2xl bg-white p-5"
    >
      <input type="hidden" name="payload" value={JSON.stringify({ ...settings, deliveryPerOrder: total })} />
      <h2 className="text-sm font-semibold">Objectifs & livraison</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Objectif de marge (%)">
          <Num value={settings.targetMarginPercent} onChange={(value) => setSettings((current) => ({ ...current, targetMarginPercent: value }))} step="1" />
        </Field>
        <Field label="Food cost min (%)">
          <Num value={settings.foodCostMinPercent} onChange={(value) => setSettings((current) => ({ ...current, foodCostMinPercent: value }))} step="1" />
        </Field>
        <Field label="Food cost max (%)">
          <Num value={settings.foodCostMaxPercent} onChange={(value) => setSettings((current) => ({ ...current, foodCostMaxPercent: value }))} step="1" />
        </Field>
        <Field label="TVA (%)">
          <Num value={settings.vatRate} onChange={(value) => setSettings((current) => ({ ...current, vatRate: value }))} step="1" />
        </Field>
        <Field label="Livraison interne">
          <Num value={settings.deliveryInternal} onChange={(value) => setSettings((current) => ({ ...current, deliveryInternal: value }))} />
        </Field>
        <Field label="Prestataire externe">
          <Num value={settings.deliveryExternal} onChange={(value) => setSettings((current) => ({ ...current, deliveryExternal: value }))} />
        </Field>
        <Field label="Carburant">
          <Num value={settings.deliveryFuel} onChange={(value) => setSettings((current) => ({ ...current, deliveryFuel: value }))} />
        </Field>
        <Field label="Kilométrage">
          <Num value={settings.deliveryKmCost} onChange={(value) => setSettings((current) => ({ ...current, deliveryKmCost: value }))} />
        </Field>
      </div>
      <p className="mt-3 text-sm">
        Coût moyen par commande : <strong>{formatPrice(total)}</strong>
      </p>
      <label className="mt-3 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={settings.allocateDeliveryToDishes}
          onChange={(event) => setSettings((current) => ({ ...current, allocateDeliveryToDishes: event.target.checked }))}
        />
        Répartir la livraison sur le nombre de plats
      </label>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {settings.boxPackaging.map((line, index) => (
          <div key={line.id} className="grid grid-cols-[1fr_90px] gap-2">
            <input
              value={line.name}
              onChange={(event) =>
                setSettings((current) => {
                  const boxPackaging = current.boxPackaging.slice();
                  boxPackaging[index] = { ...line, name: event.target.value };
                  return { ...current, boxPackaging };
                })
              }
              className={input}
            />
            <Num
              value={line.unitPrice}
              onChange={(value) =>
                setSettings((current) => {
                  const boxPackaging = current.boxPackaging.slice();
                  boxPackaging[index] = { ...line, unitPrice: value };
                  return { ...current, boxPackaging };
                })
              }
            />
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2">
        {(["5", "7", "10", "14"] as const).map((size) => (
          <Field key={size} label={`Remise box ${size} (%)`}>
            <Num
              value={settings.boxDiscountPercent[size]}
              onChange={(value) =>
                setSettings((current) => ({
                  ...current,
                  boxDiscountPercent: { ...current.boxDiscountPercent, [size]: value },
                }))
              }
              step="1"
            />
          </Field>
        ))}
      </div>
      <button type="submit" className="mt-5 h-10 rounded-full bg-ink px-4 text-sm text-white">
        Enregistrer les objectifs
      </button>
      {saved ? <span className="ml-3 text-sm text-emerald-800">Enregistré.</span> : null}
    </form>
  );
}
