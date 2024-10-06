import "./globals.css";

import { GeistSans } from "geist/font/sans";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

import Providers from "@/app/providers";
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import type { Metadata, Viewport } from "next";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });

const fontHeading = Inter({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  applicationName: siteConfig.name,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: siteConfig.name,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          GeistSans.className,
          fontSans.variable,
          fontHeading.variable,
        )}
      >
        <Providers>
          <main className="flex min-h-screen flex-1 flex-col">{children} </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
