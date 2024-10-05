"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth";
import { createConfig } from "@privy-io/wagmi";
import { WagmiProvider } from "@privy-io/wagmi";
// import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
// import { defineChain } from "viem";
import { type Chain } from "viem";
import { http } from "wagmi";

import { env } from "@/env.mjs";

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}

export const bellecour = {
  id: 134,
  name: "iExec Sidechain",
  nativeCurrency: {
    decimals: 18,
    name: "xRLC",
    symbol: "xRLC",
  },
  rpcUrls: {
    public: { http: ["https://bellecour.iex.ec"] },
    default: { http: ["https://bellecour.iex.ec"] },
  },
  blockExplorers: {
    etherscan: {
      name: "Blockscout",
      url: "https://blockscout-bellecour.iex.ec",
    },
    default: { name: "Blockscout", url: "https://blockscout-bellecour.iex.ec" },
  },
} as const satisfies Chain;

// const iexec = defineChain({
//   id: 134,
//   name: "iExec",
//   nativeCurrency: {
//     decimals: 18,
//     name: "xRLC",
//     symbol: "xRLC",
//   },
//   rpcUrls: {
//     default: {
//       http: ["https://bellecour.iex.ec"],
//     },
//   },
// });

export const wagmiConfig = createConfig({
  chains: [bellecour],
  multiInjectedProviderDiscovery: false,
  transports: {
    [bellecour.id]: http(),
  },
});

const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: false,
    noPromptOnSignature: false,
  },
  loginMethods: ["farcaster"],
};

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={env.NEXT_PUBLIC_PRIVY_APP_ID}
      config={{ ...privyConfig, defaultChain: bellecour, supportedChains: [bellecour] }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          {/* <RainbowKitProvider> */}
          {children}
          {/* </RainbowKitProvider> */}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
