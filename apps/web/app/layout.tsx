import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import CookieConsent from "@/components/CookieConsent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sona",
  description: "Stay close. Stay real.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[var(--sona-color-bg-canvas)] text-[var(--sona-color-text-primary)]`}>
        <Header />
        <main className="mx-auto max-w-[680px] w-full px-4 py-6 pb-20 sm:pb-6">
          {children}
        </main>
        <Footer />
        <BottomNav />
        <CookieConsent />
      </body>
    </html>
  );
}
