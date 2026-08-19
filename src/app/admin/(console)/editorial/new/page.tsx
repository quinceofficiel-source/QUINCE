import { EditorialForm } from "@/components/admin/EditorialForm";
import { requireAdmin } from "@/lib/admin/dal";

export const metadata = { title: "Nouvelle bannière" };

export default async function NewEditorialPage() {
  await requireAdmin("promotions.write");
  return (
    <div className="space-y-5">
      <h1 className="font-display text-3xl">Nouvelle bannière</h1>
      <EditorialForm />
    </div>
  );
}
