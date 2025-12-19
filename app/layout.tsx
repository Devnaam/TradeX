import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TradeX - Investment Plan Management",
  description: "Invest in plans, earn daily income, manage referrals",
  icons: {
    icon: '/Trade_logo-removebg-preview.png', // This will be your favicon
    apple: '/tradex-logo.png', // For Apple devices
  },
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
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
