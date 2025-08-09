import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Joom | 简单录屏",
  description: "简单快速的录屏分享",
  icons: "/assets/icons/logo-light.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
