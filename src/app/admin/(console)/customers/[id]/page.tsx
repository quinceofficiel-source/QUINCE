import Link from "next/link";
import { notFound } from "next/navigation";
import { addCustomerNote } from "@/lib/admin/actions";
import { can } from "@/lib/admin/permissions";
import { requireAdmin } from "@/lib/admin/dal";
import { getAdminStore } from "@/lib/admin/store";
import { formatDate, formatPrice } from "@/lib/format";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const actor = await requireAdmin("customers.read");
  const { id } = await params;
  const store = getAdminStore();
  const customer = store.customer(id);
  if (!customer) notFound();
  const orders = store.orders().filter((order) => order.customerId === id);
  const products = store.products();
  const writable = can(actor.role, "customers.write");

  return (
    <div className="space-y-5">
      <Link href="/admin/customers" className="text-sm text-muted">
        ← Clients
      </Link>
      <h1 className="font-display text-3xl">
        {customer.firstName} {customer.lastName}
      </h1>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 text-sm">
          <p>{customer.email}</p>
          <p>{customer.phone}</p>
          <p className="mt-2 text-muted">Inscrit le {formatDate(customer.createdAt)}</p>
          <p className="mt-3">Avoir : {formatPrice(customer.credit)}</p>
          <h2 className="mt-5 font-semibold">Adresses</h2>
          <ul className="mt-2 space-y-1">
            {customer.addresses.map((address) => (
              <li key={address.street}>
                {address.label} — {address.street}, {address.zip} {address.city}
              </li>
            ))}
          </ul>
          <h2 className="mt-5 font-semibold">Favoris</h2>
          <ul className="mt-2">
            {customer.favoriteProductIds.map((pid) => (
              <li key={pid}>{products.find((item) => item.id === pid)?.name ?? pid}</li>
            ))}
          </ul>
          <h2 className="mt-5 font-semibold">Codes promo</h2>
          <p>{customer.promoCodesUsed.join(", ") || "—"}</p>
        </section>
        <section className="rounded-2xl bg-white p-5">
          <h2 className="text-sm font-semibold">Notes internes</h2>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            {customer.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
          {writable ? (
            <form action={addCustomerNote.bind(null, customer.id)} className="mt-4">
              <textarea name="note" rows={3} className="w-full rounded-xl border border-line bg-cream p-3 text-sm" />
              <button type="submit" className="mt-2 h-10 rounded-full bg-ink px-4 text-sm text-white">
                Ajouter
              </button>
            </form>
          ) : null}
        </section>
      </div>
      <section className="rounded-2xl bg-white p-5">
        <h2 className="text-sm font-semibold">Commandes</h2>
        <ul className="mt-3 divide-y divide-line">
          {orders.map((order) => (
            <li key={order.id} className="flex items-center justify-between py-3 text-sm">
              <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                {order.id}
              </Link>
              <span>{formatPrice(order.total)}</span>
              <StatusBadge status={order.status} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
