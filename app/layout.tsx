import type React from "react";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Focus Streak by SB",
    template: "%s | Focus Streak by SB",
  },
  description:
    "Build unbreakable discipline with a simple daily check‑in streak.",
  metadataBase: new URL("https://discipline-tracker-nine.vercel.app"),
  openGraph: {
    title: "Focus Streak by SB",
    description:
      "Build unbreakable discipline with a simple daily check‑in streak.",
    url: "https://discipline-tracker-nine.vercel.app",
    siteName: "Focus Streak by SB",
    images: [
      {
        url: "/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "Focus Streak preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focus Streak by SB",
    description:
      "Build unbreakable discipline with a simple daily check‑in streak.",
    images: ["/placeholder.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={`${dmSans.className} font-sans antialiased`}>
          {children}
          <Analytics />
        </body>
      </ClerkProvider>
    </html>
  );
}
