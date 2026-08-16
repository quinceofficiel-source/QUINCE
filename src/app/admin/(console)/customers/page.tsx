import Link from "next/link";
import { requireAdmin } from "@/lib/admin/dal";
import { getAdminStore } from "@/lib/admin/store";
import { formatDate, formatPrice } from "@/lib/format";

export const metadata = { title: "Clients" };

export default async function CustomersPage() {
  await requireAdmin("customers.read");
  const store = getAdminStore();
  const customers = store.customers();
  const orders = store.orders();

  const rows = customers.map((customer) => {
    const theirs = orders.filter((order) => order.customerId === customer.id);
    const spent = theirs
      .filter((order) => order.status !== "annulee" && order.status !== "remboursee")
      .reduce((sum, order) => sum + order.total, 0);
    const last = theirs.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0];
    return { customer, count: theirs.length, spent, last };
  });

  return (
    <div className="space-y-5">
      <h1 className="font-display text-3xl">Clients</h1>
      <div className="overflow-x-auto rounded-2xl bg-white">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-line text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Téléphone</th>
              <th className="px-4 py-3 font-medium">Commandes</th>
              <th className="px-4 py-3 font-medium">Total dépensé</th>
              <th className="px-4 py-3 font-medium">Dernière commande</th>
              <th className="px-4 py-3 font-medium">Inscription</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ customer, count, spent, last }) => (
              <tr key={customer.id} className="border-b border-line/70">
                <td className="px-4 py-3">
                  <Link href={`/admin/customers/${customer.id}`} className="font-medium hover:underline">
                    {customer.firstName} {customer.lastName}
                  </Link>
                </td>
                <td className="px-4 py-3">{customer.email}</td>
                <td className="px-4 py-3">{customer.phone}</td>
                <td className="px-4 py-3">{count}</td>
                <td className="px-4 py-3">{formatPrice(spent)}</td>
                <td className="px-4 py-3">{last ? last.id : "—"}</td>
                <td className="px-4 py-3 text-muted">{formatDate(customer.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
