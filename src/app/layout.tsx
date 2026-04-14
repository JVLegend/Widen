import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Widen — Spreading the Word through Content",
    template: "%s | Widen",
  },
  description:
    "Connecting churches to young content creators. Multiply your ministry's reach with viral short-form content.",
  keywords: [
    "church content",
    "ministry",
    "sermons",
    "short-form video",
    "reels",
    "tiktok",
    "shorts",
    "gospel",
    "outreach",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
