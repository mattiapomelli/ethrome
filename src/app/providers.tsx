"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth";
import { createConfig } from "@privy-io/wagmi";
import { WagmiProvider } from "@privy-io/wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { defineChain } from "viem";
import { http } from "wagmi";

import { env } from "@/env.mjs";

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}

const iexec = defineChain({
  id: 134,
  name: "iExec",
  nativeCurrency: {
    decimals: 18,
    name: "xRLC",
    symbol: "xRLC",
  },
  rpcUrls: {
    default: {
      http: ["https://bellecour.iex.ec"],
    },
  },
});

export const wagmiConfig = createConfig({
  chains: [iexec],
  transports: {
    [iexec.id]: http(),
  },
});

const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: false,
    noPromptOnSignature: true,
  },
  loginMethods: ["farcaster"],
};

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <PrivyProvider appId={env.NEXT_PUBLIC_PRIVY_APP_ID} config={privyConfig}>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>
            <RainbowKitProvider>{children}</RainbowKitProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </PrivyProvider>
    </ThemeProvider>
  );
}
