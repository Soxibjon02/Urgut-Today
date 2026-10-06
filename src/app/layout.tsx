import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#b91c1c",
};

export const metadata: Metadata = {
  title: "Urgut Today — Urgut tumani yangiliklari va ilovasi",
  description:
    "Urgut tumani va Samarqand viloyati bo'yicha eng so'nggi yangiliklar, e'lonlar va muhim ma'lumotlar. Rasmiy mobil va desktop ilova.",
  keywords: "Urgut, Urgut tumani, Samarqand, yangiliklar, xabarlar, urgut today app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Urgut Today",
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/icons/icon-192x192.png',
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "Urgut Today",
    description: "Urgut tumani mahalliy yangiliklar portali va ilovasi",
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
    <html lang="uz" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
      </head>
      <body className="font-sans antialiased selection:bg-red-700 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
