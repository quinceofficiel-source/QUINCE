import { getAdminStore } from "@/lib/admin/store";
import { pickActiveEditorial, type EditorialBanner } from "@/lib/editorial";

export function getActiveEditorialBanner(): EditorialBanner | null {
  return pickActiveEditorial(getAdminStore().editorialCampaigns());
}
