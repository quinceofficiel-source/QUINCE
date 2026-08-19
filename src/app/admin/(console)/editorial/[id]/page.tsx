import { notFound } from "next/navigation";
import { EditorialForm } from "@/components/admin/EditorialForm";
import { requireAdmin } from "@/lib/admin/dal";
import { getAdminStore } from "@/lib/admin/store";

export const metadata = { title: "Bannière éditoriale" };

export default async function EditEditorialPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin("promotions.write");
  const { id } = await params;
  const campaign = getAdminStore().editorialCampaign(id);
  if (!campaign) notFound();
  return (
    <div className="space-y-5">
      <h1 className="font-display text-3xl">Modifier la bannière</h1>
      <EditorialForm campaign={campaign} />
    </div>
  );
}
