import { Suspense } from "react";
import { AddressLanding } from "@/components/AddressLanding";
import { CatalogView } from "@/components/CatalogView";
import { Container } from "@/components/Container";
import { getDeliveryLocation } from "@/lib/delivery";
import { getActiveEditorialBanner } from "@/lib/editorial-storefront";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const location = await getDeliveryLocation();
  const params = await searchParams;
  const nextRaw = Array.isArray(params.next) ? params.next[0] : params.next;
  const nextPath =
    nextRaw && nextRaw.startsWith("/") && !nextRaw.startsWith("//") && !nextRaw.startsWith("/admin") ? nextRaw : "/";

  if (!location) {
    return <AddressLanding nextPath={nextPath} />;
  }

  const banner = getActiveEditorialBanner();

  return (
    <Container className="py-10">
      <Suspense>
        <CatalogView banner={banner} />
      </Suspense>
    </Container>
  );
}
