import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/dal";
import { getAdminStore } from "@/lib/admin/store";

export default async function AdminAppLayout({ children }: { children: React.ReactNode }) {
  const actor = await requireAdmin();
  const notifications = getAdminStore().notifications();
  return (
    <AdminShell name={actor.name} role={actor.role} notifications={notifications}>
      {children}
    </AdminShell>
  );
}
