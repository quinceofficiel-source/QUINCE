"use client";

import { useMemo, useState } from "react";
import { MarginBadge } from "@/components/admin/MarginBadge";
import { computeBoxBreakdown, marginStatus, type ProfitabilitySettings } from "@/lib/admin/profitability";
import type { DishProfitRow } from "@/lib/admin/profit-report";
import { formatPrice } from "@/lib/format";

const SIZES = [5, 7, 10, 14] as const;

function fill(values: number[], size: number) {
  if (!values.length) return Array.from({ length: size }, () => 0);
  return Array.from({ length: size }, (_, index) => values[index % values.length]!);
}

function pct(value: number) {
  return `${value.toFixed(1).replace(".", ",")} %`;
}

export function BoxProfitPanel({ rows, settings }: { rows: DishProfitRow[]; settings: ProfitabilitySettings }) {
  const [selected, setSelected] = useState<string[]>(() => rows.slice(0, 10).map((row) => row.productId));
  const [size, setSize] = useState<(typeof SIZES)[number]>(10);

  const chosen = useMemo(() => {
    const map = new Map(rows.map((row) => [row.productId, row]));
    return selected.map((id) => map.get(id)).filter(Boolean) as DishProfitRow[];
  }, [rows, selected]);

  const box = computeBoxBreakdown(
    size,
    fill(chosen.map((row) => row.total), size),
    fill(chosen.map((row) => row.price), size),
    settings,
  );
  const status = marginStatus(box.marginPercent, settings.targetMarginPercent);

  function toggle(id: string) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <section className="rounded-2xl bg-white p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Rentabilité des box</h2>
          <p className="mt-1 text-xs text-muted">Sélectionnez des plats, puis une taille de box.</p>
        </div>
        <div className="flex gap-2">
          {SIZES.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setSize(value)}
              className={`h-9 rounded-full px-3 text-sm ${size === value ? "bg-ink text-white" : "bg-cream"}`}
            >
              {value} plats
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 grid max-h-48 gap-1 overflow-auto text-sm">
        {rows.map((row) => (
          <label key={row.productId} className="flex items-center gap-2">
            <input type="checkbox" checked={selected.includes(row.productId)} onChange={() => toggle(row.productId)} />
            <span className="flex-1">{row.name}</span>
            <span className="text-muted">{formatPrice(row.price)}</span>
          </label>
        ))}
      </div>
      <dl className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
        <div className="flex justify-between">
          <dt>Coût des plats</dt>
          <dd>{formatPrice(box.dishesCost)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Packaging box</dt>
          <dd>{formatPrice(box.packaging)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Livraison</dt>
          <dd>{formatPrice(box.delivery)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Réduction box</dt>
          <dd>{box.discount} %</dd>
        </div>
        <div className="flex justify-between font-semibold">
          <dt>Coût total</dt>
          <dd>{formatPrice(box.totalCost)}</dd>
        </div>
        <div className="flex justify-between font-semibold">
          <dt>Prix client</dt>
          <dd>{formatPrice(box.clientPrice)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Bénéfice</dt>
          <dd>{formatPrice(box.marginEuro)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Marge</dt>
          <dd className="flex items-center gap-2">
            {pct(box.marginPercent)}
            <MarginBadge status={status} />
          </dd>
        </div>
      </dl>
    </section>
  );
}
