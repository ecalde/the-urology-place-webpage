import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_SHARE_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
  TITLE_TEMPLATE,
} from "./lib/site-metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: TITLE_TEMPLATE,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: SITE_URL,
    title: {
      default: DEFAULT_TITLE,
      template: TITLE_TEMPLATE,
    },
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: DEFAULT_TITLE,
      template: TITLE_TEMPLATE,
    },
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_SHARE_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white text-slate-900 antialiased`}
      >
        <Navbar />
        {/* bg-white comes from body; omit here so page-level fixed backgrounds (e.g. Robotic Prostatectomy) are visible */}
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
