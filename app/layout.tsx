import type { Metadata, Viewport } from "next";
import "./globals.css";
import InstallPWA from "@/components/InstallPWA";
import Script from "next/script";

const APP_NAME = 'TradeX';
const APP_DESCRIPTION = 'Invest in plans, earn daily income, manage referrals';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: "TradeX - Investment Plan Management",
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  icons: {
    icon: '/Trade_logo-removebg-preview.png',
    apple: '/tradex-logo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/tradex-logo.png" />
      </head>
      <body className="antialiased">
        {children}
        <InstallPWA />
        <Script
          src="/register-sw.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
