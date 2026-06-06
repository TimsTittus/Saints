import type { Metadata } from "next";
import { Crimson_Pro, Inter } from "next/font/google";
import "../index.css";
import Header from "@/components/header";
import Providers from "@/components/providers";
import LoadingScreen from "@/components/loading-screen";

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sancti — The Catholic Saints Encyclopedia",
    template: "%s · Sancti",
  },
  description:
    "Explore the lives, legacies, and patronages of Catholic saints, blesseds, and martyrs across every era and region of the world.",
  keywords: ["catholic saints", "hagiography", "saint biography", "patron saints"],
  openGraph: {
    title: "Sancti — The Catholic Saints Encyclopedia",
    description: "Discover the lives of Catholic saints across history.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${crimsonPro.variable} ${inter.variable} antialiased min-h-dvh`}
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
      >
        <LoadingScreen />
        <Providers>
          <div className="flex flex-col min-h-dvh">
            <Header />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}