import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/dal";
import { getAdminStore } from "@/lib/admin/store";

export default async function LabelPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin("orders.read");
  const { id } = await params;
  const order = getAdminStore().order(id);
  if (!order) notFound();

  return (
    <div className="mx-auto mt-10 w-[360px] rounded-xl border border-neutral-300 bg-white p-6">
      <p className="text-xs tracking-[0.2em] uppercase">Quince</p>
      <p className="mt-2 text-2xl font-semibold">{order.id}</p>
      <p className="mt-4 text-sm font-medium">{order.customerName}</p>
      <p className="text-sm">
        {order.address}
        <br />
        {order.zip} {order.city}
      </p>
      <p className="mt-3 text-sm">{order.slotLabel}</p>
      {order.instructions ? <p className="mt-3 text-xs">{order.instructions}</p> : null}
    </div>
  );
}
