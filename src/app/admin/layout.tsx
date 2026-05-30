import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={`${inter.className} font-sans`}>{children}</div>;
}
