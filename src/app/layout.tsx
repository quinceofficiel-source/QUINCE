import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { StoreChrome } from "@/components/StoreChrome";
import { Providers } from "@/context/Providers";
import { getDeliveryLocation } from "@/lib/delivery";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Quince — Des plats maison, comme si c’était les vôtres",
    template: "%s · Quince",
  },
  description:
    "Des recettes généreuses, préparées chaque jour avec des ingrédients frais et de saison. Livraison à domicile.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const address = await getDeliveryLocation();
  return (
    <html lang="fr" className={`${montserrat.variable} ${montserrat.className} h-full overflow-x-clip antialiased`}>
      <body className="min-h-full overflow-x-clip bg-cream font-sans text-ink">
        <Providers>
          <StoreChrome address={address}>{children}</StoreChrome>
        </Providers>
      </body>
    </html>
  );
}
