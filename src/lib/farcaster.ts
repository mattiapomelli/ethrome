import { FarcasterWithMetadata, usePrivy } from "@privy-io/react-auth";

export const useFarcasterAccount = () => {
  const { user } = usePrivy();

  const farcasterAccount = user?.linkedAccounts.find(
    (account: { type: string }) => account.type === "farcaster",
  ) as FarcasterWithMetadata | undefined;

  const hasGivenAuthorization = !!farcasterAccount?.signerPublicKey;

  return { farcasterAccount, hasGivenAuthorization };
};
