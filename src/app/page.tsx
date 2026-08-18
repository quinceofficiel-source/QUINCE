import { AddressLanding } from "@/components/AddressLanding";
import { StoreHome } from "@/components/StoreHome";
import { getDeliveryLocation } from "@/lib/delivery";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const location = await getDeliveryLocation();
  const params = await searchParams;
  const nextRaw = Array.isArray(params.next) ? params.next[0] : params.next;
  const nextPath = nextRaw && nextRaw.startsWith("/") && !nextRaw.startsWith("//") && !nextRaw.startsWith("/admin") ? nextRaw : "/";

  if (!location) {
    return <AddressLanding nextPath={nextPath} />;
  }

  return <StoreHome />;
}
