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

export function MetricBars({
  data,
  format = (value) => String(value),
}: {
  data: Array<{ label: string; value: number }>;
  format?: (value: number) => string;
}) {
  const max = Math.max(...data.map((item) => Math.abs(item.value)), 1);
  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="capitalize">{item.label}</span>
            <span className="font-medium">{format(item.value)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-cream">
            <div
              className="h-full rounded-full bg-ink"
              style={{ width: `${Math.max(4, (Math.abs(item.value) / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DualBars({
  data,
}: {
  data: Array<{ label: string; a: number; b: number }>;
}) {
  const max = Math.max(...data.flatMap((item) => [item.a, item.b]), 1);
  return (
    <div className="flex h-40 items-end gap-2">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 items-end justify-center gap-0.5">
          <div className="flex w-full flex-col items-center justify-end gap-1">
            <div className="flex w-full items-end gap-0.5" title={item.label}>
              <div className="flex-1 rounded-t-md bg-ink" style={{ height: `${Math.max(6, (item.a / max) * 140)}px` }} />
              <div className="flex-1 rounded-t-md bg-quince" style={{ height: `${Math.max(6, (item.b / max) * 140)}px` }} />
            </div>
            <span className="text-[10px] text-muted">{item.label.slice(5)}</span>
          </div>
        </div>
      ))}
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
