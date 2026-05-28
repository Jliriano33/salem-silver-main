import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Salem Silver Capital | We Buy Homes for Cash",
    template: "%s | Salem Silver Capital",
  },
  description:
    "Get a fair cash offer for your home in 24 hours. No fees, no repairs, no hassle. Salem Silver Capital buys homes as-is across Massachusetts.",
  metadataBase: new URL("https://www.salemsilver.com"),
  alternates: {
    canonical: "https://www.salemsilver.com",
  },
  openGraph: {
    title: "Salem Silver Capital | We Buy Homes for Cash",
    description:
      "Get a fair cash offer for your home in 24 hours. No fees, no repairs, no hassle.",
    url: "https://www.salemsilver.com",
    siteName: "Salem Silver Capital",
    images: [
      {
        url: "/images/logo/logo-03.png",
        width: 1200,
        height: 630,
        alt: "Salem Silver Capital",
      },
    ],
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    // favicon.ico and apple-touch-icon.png should be generated from public/images/logo/logo-03.png
    // using https://realfavicongenerator.net — place output files in the app/ directory
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
