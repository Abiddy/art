import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Anam Siddiqui",
  description: "Artist portfolio of Anam Siddiqui",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.className} bg-white text-neutral-800 antialiased`}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
