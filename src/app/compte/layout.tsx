import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mon compte" };

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
