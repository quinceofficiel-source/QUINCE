import { cache } from "react";
import { redirect } from "next/navigation";
import { can, firstAllowedPath } from "@/lib/admin/permissions";
import { getAdminSession } from "@/lib/admin/session";
import { getAdminStore } from "@/lib/admin/store";
import type { Permission } from "@/lib/admin/types";

export const getAdminActor = cache(async () => {
  const session = await getAdminSession();
  if (!session) return null;
  const staff = getAdminStore().staffById(session.userId);
  if (!staff || !staff.active) return null;
  return staff;
});

export async function requireAdmin(permission?: Permission) {
  const actor = await getAdminActor();
  if (!actor) redirect("/admin/login");
  if (permission && !can(actor.role, permission)) {
    redirect(firstAllowedPath(actor.role));
  }
  return actor;
}
