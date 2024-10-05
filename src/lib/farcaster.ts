"use client";
import { FarcasterWithMetadata, useFarcasterSigner, usePrivy } from "@privy-io/react-auth";
import { HubRestAPIClient, ExternalEd25519Signer } from "@standard-crypto/farcaster-js";
import { useMutation } from "@tanstack/react-query";

export const farcasterClient = new HubRestAPIClient({
  hubUrl: "https://hub.farcaster.standardcrypto.vc:2281",
});

export const usePrivySigner = () => {
  const { getFarcasterSignerPublicKey, signFarcasterMessage } = useFarcasterSigner();
  const privySigner = new ExternalEd25519Signer(signFarcasterMessage, getFarcasterSignerPublicKey);

  return { privySigner };
};

export const useFarcasterAccount = () => {
  const { user } = usePrivy();

  const farcasterAccount = user?.linkedAccounts.find(
    (account: { type: string }) => account.type === "farcaster",
  ) as FarcasterWithMetadata | undefined;

  const hasGivenAuthorization = !!farcasterAccount?.signerPublicKey;

  return { farcasterAccount, hasGivenAuthorization };
};

export const useSubmitCastMutation = () => {
  const { farcasterAccount } = useFarcasterAccount();
  const { privySigner } = usePrivySigner();

  const mutation = useMutation({
    mutationFn: (cast: Parameters<typeof farcasterClient.submitCast>[0]) => {
      if (!farcasterAccount?.fid) {
        throw new Error("No farcaster account");
      }

      return farcasterClient.submitCast(cast, farcasterAccount.fid, privySigner);
    },
  });

  return mutation;
};
