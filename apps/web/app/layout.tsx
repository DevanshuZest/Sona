import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sona",
  description: "Privacy-first, unbiased, open-source social platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#FDFCFA] text-[#1C1917]`}>
        <div className="mx-auto max-w-2xl px-4 py-6">{children}</div>
      </body>
    </html>
  );
}
