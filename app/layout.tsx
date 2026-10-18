import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Urologist in San Antonio | The Urology Place",
    template: "%s | The Urology Place",
  },
  description: "The Urology Place in San Antonio, TX.",
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
