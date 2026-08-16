"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LogOut, Search } from "lucide-react";
import { logoutAdmin, markAdminNotificationsRead } from "@/lib/admin/actions";
import { can } from "@/lib/admin/permissions";
import { ROLE_LABELS, type AdminNotification, type StaffRole } from "@/lib/admin/types";
import { ADMIN_NAV } from "@/components/admin/nav";
import { OrderAlert } from "@/components/admin/OrderAlert";
import { OrderSoundToggle } from "@/components/admin/OrderSoundToggle";
import { cn } from "@/lib/cn";
import { formatTime } from "@/lib/format";

export function AdminShell({
  children,
  name,
  role,
  notifications,
}: {
  children: React.ReactNode;
  name: string;
  role: StaffRole;
  notifications: AdminNotification[];
}) {
  const pathname = usePathname();
  const unread = notifications.filter((item) => !item.read).length;
  const links = ADMIN_NAV.filter((item) => can(role, item.permission));

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-line bg-white print:hidden lg:flex lg:flex-col">
        <div className="flex h-16 items-center px-5">
          <Link href="/admin" className="inline-flex items-center" aria-label="Back-office Quince">
            <Image src="/logo.png" alt="Quince" width={870} height={252} className="h-6 w-auto" />
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-2">
          {links.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active ? "bg-ink text-white" : "text-ink/70 hover:bg-cream",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-line p-4">
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-xs text-muted">{ROLE_LABELS[role]}</p>
        </div>
      </aside>

      <div className="print:pl-0 lg:pl-60">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur print:hidden">
          <Link href="/admin" className="lg:hidden">
            <Image src="/logo.png" alt="Quince" width={870} height={252} className="h-5 w-auto" />
          </Link>
          <form action="/admin/orders" className="relative hidden min-w-0 flex-1 md:block">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              name="q"
              placeholder="Rechercher une commande, un client, un plat…"
              className="h-10 w-full max-w-xl rounded-full border border-line bg-cream pl-10 pr-4 text-sm"
            />
          </form>
          <OrderSoundToggle />
          <details className="relative">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full hover:bg-cream">
              <Bell className="h-4 w-4" />
              {unread > 0 ? (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-quince" />
              ) : null}
            </summary>
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-line bg-white p-3 shadow-lg">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold">Notifications</p>
                <form action={markAdminNotificationsRead}>
                  <button type="submit" className="text-xs text-muted hover:text-ink">
                    Tout lu
                  </button>
                </form>
              </div>
              <ul className="max-h-80 space-y-2 overflow-auto">
                {notifications.slice(0, 8).map((item) => (
                  <li key={item.id}>
                    <Link href={item.href} className="block rounded-xl px-2 py-2 hover:bg-cream">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted">{item.body}</p>
                      <p className="mt-1 text-[11px] text-muted">{formatTime(item.at)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </details>
          <form action={logoutAdmin}>
            <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm text-ink/70 hover:bg-cream">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Quitter</span>
            </button>
          </form>
        </header>
        <div className="flex gap-2 overflow-x-auto border-b border-line bg-white px-3 py-2 print:hidden lg:hidden">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="shrink-0 rounded-full bg-cream px-3 py-1.5 text-xs font-medium">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
      <OrderAlert />
    </div>
  );
}
