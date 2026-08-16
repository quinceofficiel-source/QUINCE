export function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[0_10px_30px_-24px_rgba(17,17,17,0.2)]">
      <p className="text-xs font-medium tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function BarChart({
  data,
  valueKey,
}: {
  data: Array<{ date: string; revenue: number; orders: number }>;
  valueKey: "revenue" | "orders";
}) {
  const max = Math.max(...data.map((item) => item[valueKey]), 1);
  return (
    <div className="flex h-40 items-end gap-1">
      {data.map((item) => (
        <div key={item.date} className="flex flex-1 flex-col items-center justify-end gap-1">
          <div
            className="w-full rounded-t-md bg-ink"
            style={{ height: `${Math.max(6, (item[valueKey] / max) * 100)}%` }}
            title={`${item.date} · ${item[valueKey]}`}
          />
        </div>
      ))}
    </div>
  );
}
