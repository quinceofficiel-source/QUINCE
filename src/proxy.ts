import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, readSession } from "@/lib/admin/crypto";

const publicAdmin = ["/admin/login", "/admin/forgot-password"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
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

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", request.nextUrl));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|wav|mp3)$).*)"],
};
