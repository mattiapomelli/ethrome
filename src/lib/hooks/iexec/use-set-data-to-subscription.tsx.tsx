import { useSignMessage } from "@privy-io/react-auth";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { TransactionLinkButton } from "@/components/transaction-link-button";
import { BELLECOUR_CHAIN_ID } from "@/lib/chains";
import { toast } from "@/lib/hooks/use-toast";
import {
  getDataProtectorCore,
  getDataProtectorSharing,
  PROTECTED_DATA_DELIVERY_WHITELIST_ADDRESS,
} from "@/lib/iexec";
import { deriveAccountFromUid } from "@/lib/utils";

type SetDataToSubscriptionParams = {
  data: Record<string, any>;
  name: string;
  price: number;
  duration: number;
  collectionId?: number | null;
};

type SetDataToSubscriptionResponse = {
  protectedDataAddress: string;
  collectionId: number;
};

export function useSetDataToSubscription(
  options?: Omit<
    UseMutationOptions<SetDataToSubscriptionResponse, Error, SetDataToSubscriptionParams, unknown>,
    "mutationFn"
  >,
) {
  const { address } = useAccount();
  const { signMessage } = useSignMessage();

  return useMutation({
    mutationFn: async ({
      data,
      name,
      price,
      duration,
      collectionId: _collectionId,
    }: SetDataToSubscriptionParams) => {
      if (!address) throw new Error("No address found");

      const signature = await signMessage(address);
      const privateKey = deriveAccountFromUid(signature);

      const dataProtectorCore = getDataProtectorCore(privateKey);
      const dataProtectorSharing = getDataProtectorSharing(privateKey);

      // -------- Create Collection --------
      let collectionId: number;

      if (!_collectionId) {
        const createCollectionResult = await dataProtectorSharing.createCollection();
        collectionId = createCollectionResult.collectionId;

        console.log("createCollectionResult", createCollectionResult);

        toast({
          title: "Collection created",
          description: "Successfully created collection.",
          action: (
            <TransactionLinkButton
              chainId={BELLECOUR_CHAIN_ID}
              txnHash={createCollectionResult.txHash as `0x${string}`}
            />
          ),
          variant: "default",
        });
      } else {
        collectionId = _collectionId;
      }

      // -------- Protect Data --------
      const protectedData = await dataProtectorCore.protectData({
        data,
        name,
      });

      console.log("protectedData", protectedData);

      toast({
        title: "Protected data",
        description: "Successfully protected data.",
        action: (
          <TransactionLinkButton
            chainId={BELLECOUR_CHAIN_ID}
            txnHash={protectedData.transactionHash as `0x${string}`}
          />
        ),
        variant: "default",
      });

      // -------- Add Data To Collection --------
      const addToCollectionResult = await dataProtectorSharing.addToCollection({
        protectedData: protectedData.address,
        collectionId,
        addOnlyAppWhitelist: PROTECTED_DATA_DELIVERY_WHITELIST_ADDRESS,
      });

      console.log("addToCollectionResult", addToCollectionResult);

      toast({
        title: "Added to collection",
        description: "Successfully added to collection.",
        action: (
          <TransactionLinkButton
            chainId={BELLECOUR_CHAIN_ID}
            txnHash={addToCollectionResult.txHash as `0x${string}`}
          />
        ),
        variant: "default",
      });

      // -------- Set Subscription Params --------
      const setSubscriptionParamsResult = await dataProtectorSharing.setSubscriptionParams({
        collectionId,
        price,
        duration,
      });

      console.log("setSubscriptionParamsResult", setSubscriptionParamsResult);

      toast({
        title: "Set subscription params",
        description: "Successfully set subscription params.",
        action: (
          <TransactionLinkButton
            chainId={BELLECOUR_CHAIN_ID}
            txnHash={setSubscriptionParamsResult.txHash as `0x${string}`}
          />
        ),
        variant: "default",
      });

      // -------- Set Protected Data To Subscription --------
      const setToSubscriptionResult = await dataProtectorSharing.setProtectedDataToSubscription({
        protectedData: protectedData.address,
      });

      console.log("setToSubscriptionResult", setToSubscriptionResult);

      toast({
        title: "Set protected data to subscription",
        description: "Successfully set protected data to subscription.",
        action: (
          <TransactionLinkButton
            chainId={BELLECOUR_CHAIN_ID}
            txnHash={setToSubscriptionResult.txHash as `0x${string}`}
          />
        ),
        variant: "default",
      });

      return { protectedDataAddress: protectedData.address, collectionId };
    },
    onError(error, variables, context) {
      console.log("Error: ", error.message);

      toast({
        title: "Set data to subscription failed!",
        description: error.message,
        variant: "destructive",
      });
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}
