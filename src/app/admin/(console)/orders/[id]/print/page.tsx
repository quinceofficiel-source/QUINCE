import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/dal";
import { getAdminStore } from "@/lib/admin/store";
import { formatDateTime, formatPrice } from "@/lib/format";

export default async function PrintOrderPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin("orders.read");
  const { id } = await params;
  const order = getAdminStore().order(id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-xl bg-white p-8 print:max-w-none">
      <p className="text-xs tracking-[0.2em] uppercase">Quince · Bon de préparation</p>
      <h1 className="mt-2 text-3xl font-semibold">{order.id}</h1>
      <p className="mt-1 text-sm">{formatDateTime(order.createdAt)} · {order.slotLabel}</p>
      <p className="mt-4 text-sm">
        {order.customerName}
        <br />
        {order.address}, {order.zip} {order.city}
      </p>
      {order.instructions ? <p className="mt-2 text-sm">Note : {order.instructions}</p> : null}
      <ul className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
        {order.lines.map((line) => (
          <li key={line.productId} className="flex justify-between py-3">
            <span>
              <strong>{line.quantity}×</strong> {line.name}
              {line.allergens.length ? <span className="block text-xs">Allergènes : {line.allergens.join(", ")}</span> : null}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm">Total {formatPrice(order.total)}</p>
    </div>
  );
}
