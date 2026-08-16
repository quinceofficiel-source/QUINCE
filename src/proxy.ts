import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, readSession } from "@/lib/admin/crypto";

const publicAdmin = ["/admin/login", "/admin/forgot-password"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const session = readSession(request.cookies.get(SESSION_COOKIE)?.value);
  const isPublic = publicAdmin.includes(pathname);

  if (!session && !isPublic) {
    const login = new URL("/admin/login", request.nextUrl);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  if (session && isPublic) {
    return NextResponse.redirect(new URL("/admin", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
