import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers } from "@/context/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${inter.variable} ${dmSerif.variable} h-full antialiased`}>
      <body className="min-h-full bg-cream font-sans text-ink">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
