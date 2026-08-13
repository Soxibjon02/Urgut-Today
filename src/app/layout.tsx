import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Urgut Today — Urgut tumani yangiliklari",
  description:
    "Urgut tumani va Samarqand viloyati bo'yicha eng so'nggi yangiliklar, e'lonlar va muhim ma'lumotlar.",
  keywords: "Urgut, Urgut tumani, Samarqand, yangiliklar, xabarlar",
  openGraph: {
    title: "Urgut Today",
    description: "Urgut tumani mahalliy yangiliklar portali",
    locale: "uz_UZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
