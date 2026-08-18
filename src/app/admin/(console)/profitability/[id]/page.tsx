import Link from "next/link";
import { notFound } from "next/navigation";
import { CostCardEditor } from "@/components/admin/CostCardEditor";
import { emptyCard } from "@/lib/admin/profitability";
import { requireAdmin } from "@/lib/admin/dal";
import { getAdminStore } from "@/lib/admin/store";

export const metadata = { title: "Rentabilité plat" };

export default async function DishProfitabilityPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin("profitability");
  const { id } = await params;
  const store = getAdminStore();
  const product = store.product(id);
  if (!product) notFound();
  const profit = store.profitability();
  const card = store.costCard(id) ?? emptyCard(id);

  return (
    <div className="space-y-5">
      <div>
        <Link href="/admin/profitability" className="text-sm text-muted hover:text-ink">
          ← Marges & Rentabilité
        </Link>
        <h1 className="mt-2 font-display text-3xl">{product.name}</h1>
        <p className="mt-1 text-sm text-muted">
          <Link href={`/admin/products/${product.id}`} className="underline-offset-2 hover:underline">
            Fiche plat
          </Link>
        </p>
      </div>
      <CostCardEditor
        productId={product.id}
        productName={product.name}
        price={product.promoPrice ?? product.price}
        card={card}
        settings={profit.settings}
        history={profit.history}
      />
    </div>
  );
}
