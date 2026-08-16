import { NextResponse } from "next/server";
import { ingestCheckoutOrder, type StorefrontOrderInput } from "@/lib/admin/storefront";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as StorefrontOrderInput;
    const order = ingestCheckoutOrder(input);
    revalidatePath("/admin", "layout");
    return NextResponse.json({ id: order.id });
  } catch {
    return NextResponse.json({ error: "Commande incomplète." }, { status: 400 });
  }
}
