import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import MeshBackground from "@/components/ui/MeshBackground";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import ScrollProgress from "@/components/ui/ScrollProgress";
import { ToastProvider } from "@/components/ui/ToastProvider";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import CookieConsent from "@/components/CookieConsent";
import SidebarNav from "@/components/layout/SidebarNav";
import ContextPanel from "@/components/layout/ContextPanel";

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
        <ToastProvider>
          <MeshBackground />
          <NoiseOverlay />
          <ScrollProgress />
          <Header />
          <main className="mx-auto w-full max-w-[1320px] px-4 py-6 pb-20 sm:pb-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[80px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)_320px]">
              <SidebarNav />
              <div className="min-w-0 max-w-[640px] mx-auto">{children}</div>
              <ContextPanel />
            </div>
          </main>
          <Footer />
          <BottomNav />
          <CookieConsent />
        </ToastProvider>
      </body>
    </html>
  );
}
