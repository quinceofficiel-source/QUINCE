import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/session";
import { getAdminStore } from "@/lib/admin/store";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const notifications = getAdminStore()
    .notifications()
    .filter((item) => item.type === "order")
    .slice(0, 12);
  return NextResponse.json({ notifications });
}
