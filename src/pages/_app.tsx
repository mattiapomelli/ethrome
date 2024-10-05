import "../globals.css";

import Providers from "@/app/providers";
import { Toaster } from "@/components/ui/toaster";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <main className="flex min-h-screen flex-1 flex-col">
        <Component {...pageProps} />
      </main>
      <Toaster />
    </Providers>
  );
}

export default MyApp;
