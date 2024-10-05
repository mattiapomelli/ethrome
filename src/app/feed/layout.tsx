import { ReactNode } from "react";

import { CastWrapper } from "@/components/ui/cast/cast-wrapper";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feed",
  description: "Feed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <CastWrapper>{children}</CastWrapper>;
}
