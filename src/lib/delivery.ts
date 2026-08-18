import { cookies } from "next/headers";
import { DELIVERY_COOKIE, parseDelivery, type DeliveryLocation } from "@/lib/delivery-zones";

export async function getDeliveryLocation(): Promise<DeliveryLocation | null> {
  const store = await cookies();
  return parseDelivery(store.get(DELIVERY_COOKIE)?.value);
}
