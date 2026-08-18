import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Mon compte" };

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
