"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MarginBadge, marginTextClass } from "@/components/admin/MarginBadge";
import type { DishProfitRow } from "@/lib/admin/profit-report";
import { formatPrice } from "@/lib/format";

type SortKey = "name" | "price" | "ingredients" | "total" | "marginEuro" | "marginPercent";

function pct(value: number) {
  return `${value.toFixed(1).replace(".", ",")} %`;
}

export function ProfitabilityTable({ rows }: { rows: DishProfitRow[] }) {
  const [sort, setSort] = useState<SortKey>("marginPercent");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    return rows.slice().sort((a, b) => {
      const av = a[sort];
      const bv = b[sort];
      if (typeof av === "string" && typeof bv === "string") {
        return dir === "asc" ? av.localeCompare(bv, "fr") : bv.localeCompare(av, "fr");
      }
      return dir === "asc" ? Number(av) - Number(bv) : Number(bv) - Number(av);
    });
  }, [rows, sort, dir]);

  function toggle(key: SortKey) {
    if (sort === key) setDir((current) => (current === "asc" ? "desc" : "asc"));
    else {
      setSort(key);
      setDir(key === "name" ? "asc" : "desc");
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white">
      <table className="w-full min-w-[980px] text-left text-sm">
        <thead className="border-b border-line text-xs text-muted">
          <tr>
            <Th onClick={() => toggle("name")} label="Plat" />
            <Th onClick={() => toggle("price")} label="Prix" />
            <Th onClick={() => toggle("ingredients")} label="Ingrédients" />
            <th className="px-4 py-3 font-medium">Packaging</th>
            <th className="px-4 py-3 font-medium">Production</th>
            <Th onClick={() => toggle("total")} label="Coût total" />
            <Th onClick={() => toggle("marginEuro")} label="Marge €" />
            <Th onClick={() => toggle("marginPercent")} label="Marge %" />
            <th className="px-4 py-3 font-medium">Bénéfice</th>
            <th className="px-4 py-3 font-medium">Statut</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.productId} className="border-b border-line/70">
              <td className="px-4 py-3 font-medium">
                <Link href={`/admin/profitability/${row.productId}`} className="hover:underline">
                  {row.name}
                </Link>
              </td>
              <td className="px-4 py-3">{formatPrice(row.price)}</td>
              <td className="px-4 py-3">{formatPrice(row.ingredients)}</td>
              <td className="px-4 py-3">{formatPrice(row.packaging)}</td>
              <td className="px-4 py-3">{formatPrice(row.production)}</td>
              <td className="px-4 py-3">{formatPrice(row.total)}</td>
              <td className={`px-4 py-3 font-medium ${marginTextClass(row.status)}`}>{formatPrice(row.marginEuro)}</td>
              <td className={`px-4 py-3 font-medium ${marginTextClass(row.status)}`}>{pct(row.marginPercent)}</td>
              <td className="px-4 py-3">{formatPrice(row.marginEuro)}</td>
              <td className="px-4 py-3">
                <MarginBadge status={row.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <th className="px-4 py-3 font-medium">
      <button type="button" onClick={onClick} className="hover:text-ink">
        {label}
      </button>
    </th>
  );
}
