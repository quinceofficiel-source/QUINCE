import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE, readSession, signSession } from "@/lib/admin/crypto";
import type { StaffRole } from "@/lib/admin/types";

export async function createAdminSession(userId: string, role: StaffRole) {
  const token = signSession({ userId, role });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroyAdminSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getAdminSession() {
  const store = await cookies();
  return readSession(store.get(SESSION_COOKIE)?.value);
}
