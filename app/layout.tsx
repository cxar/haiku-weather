import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Haiku Weather",
  description: "A simple app that generates a haiku based on the current weather.",
};

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.className} antialiased`}>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
