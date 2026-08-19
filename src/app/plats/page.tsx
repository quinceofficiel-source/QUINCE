import { redirect } from "next/navigation";

export const metadata = {
  title: "Nos plats",
};

export default async function PlatsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const next = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const text = Array.isArray(value) ? value[0] : value;
    if (text) next.set(key, text);
  }
  redirect(next.size ? `/?${next.toString()}` : "/");
}
