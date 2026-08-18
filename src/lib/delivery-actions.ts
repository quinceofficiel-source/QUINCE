"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  coverageFor,
  DELIVERY_COOKIE,
  DELIVERY_COOKIE_MAX_AGE,
  parseDelivery,
  serializeDelivery,
  type DeliveryLocation,
  type DeliveryWhen,
} from "@/lib/delivery-zones";

export async function saveDeliveryLocation(input: Omit<DeliveryLocation, "status" | "whenLabel"> & { when?: DeliveryWhen }) {
  const coverage = coverageFor(input.zip, input.city);
  if (coverage.status !== "available") {
    return { ok: false as const, coverage };
  }
  const location: DeliveryLocation = {
    ...input,
    status: "available",
    when: input.when ?? "now",
    whenLabel: input.when === "later" ? "Plus tard" : "Maintenant",
  };
  const store = await cookies();
  store.set(DELIVERY_COOKIE, serializeDelivery(location), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: DELIVERY_COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
  revalidatePath("/", "layout");
  return { ok: true as const, location };
}

export async function updateDeliveryWhen(when: DeliveryWhen) {
  const store = await cookies();
  const current = store.get(DELIVERY_COOKIE)?.value;
  if (!current) return { ok: false as const };
  const location = parseDelivery(current);
  if (!location) return { ok: false as const };
  const next: DeliveryLocation = {
    ...location,
    when,
    whenLabel: when === "later" ? "Plus tard" : "Maintenant",
  };
  store.set(DELIVERY_COOKIE, serializeDelivery(next), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: DELIVERY_COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
  revalidatePath("/", "layout");
  return { ok: true as const, location: next };
}

export async function clearDeliveryLocation() {
  const store = await cookies();
  store.delete(DELIVERY_COOKIE);
  revalidatePath("/", "layout");
}
