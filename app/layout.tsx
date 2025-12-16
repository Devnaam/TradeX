import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TradeX - Investment Plan Management",
  description: "Invest in plans, earn daily income, manage referrals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
