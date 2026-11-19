import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Foliora — Stories deserve beautiful pages",
  description: "Create, publish and share beautiful digital magazines.",
  applicationName: "Foliora",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Foliora",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: "Foliora",
    title: "Foliora — Stories deserve beautiful pages",
    description: "Read and share beautiful digital magazines.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Foliora",
    description: "Stories deserve beautiful pages.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5ef" },
    { media: "(prefers-color-scheme: dark)", color: "#171715" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
