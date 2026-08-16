import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { StoreChrome } from "@/components/StoreChrome";
import { Providers } from "@/context/Providers";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Quince",
  description: "Quince.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${montserrat.className} h-full overflow-x-clip antialiased`}>
      <body className="min-h-full overflow-x-clip bg-black font-sans text-ink">
        <Providers>
          <StoreChrome>{children}</StoreChrome>
        </Providers>
      </body>
    </html>
  );
}
