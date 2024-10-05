"use client";
import { usePrivy } from "@privy-io/react-auth";

export const useFarcasterAccount = () => {
  const { user } = usePrivy();

  const farcasterAccount = user?.linkedAccounts.find(
    (account: { type: string }) => account.type === "farcaster",
  ) as FarcasterWithMetadata | undefined;

  return { farcasterAccount };
};
