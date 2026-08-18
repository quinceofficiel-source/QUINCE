import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, readSession } from "@/lib/admin/crypto";
import { DELIVERY_COOKIE, isOpenWithoutAddress, parseDelivery } from "@/lib/delivery-zones";

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

  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const location = parseDelivery(request.cookies.get(DELIVERY_COOKIE)?.value);
  if (!location && !isOpenWithoutAddress(pathname)) {
    const home = new URL("/", request.nextUrl);
    home.searchParams.set("next", pathname);
    return NextResponse.redirect(home);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|ico)$).*)"],
};
