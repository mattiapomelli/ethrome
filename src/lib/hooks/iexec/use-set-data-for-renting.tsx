import { useSignMessage } from "@privy-io/react-auth";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
// import { createWalletClient, http } from "viem";
import { useAccount } from "wagmi";

// import { bellecour } from "@/app/providers";
import { TransactionLinkButton } from "@/components/transaction-link-button";
import { BELLECOUR_CHAIN_ID } from "@/lib/chains";
import { toast } from "@/lib/hooks/use-toast";
import {
  getDataProtectorCore,
  getDataProtectorSharing,
  PROTECTED_DATA_DELIVERY_WHITELIST_ADDRESS,
} from "@/lib/iexec";
import { deriveAccountFromUid } from "@/lib/utils";

type SetDataForRentingParams = {
  data: Record<string, any>;
  name: string;
  price: number;
  duration: number;
  collectionId?: number | null;
};

type SetDataForRentingResponse = {
  protectedDataAddress: string;
  collectionId: number;
};

export function useSetDataForRenting(
  options?: Omit<
    UseMutationOptions<SetDataForRentingResponse, Error, SetDataForRentingParams, unknown>,
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
    }: SetDataForRentingParams) => {
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
      const addToCollectionResponse = await dataProtectorSharing.addToCollection({
        protectedData: protectedData.address,
        collectionId,
        addOnlyAppWhitelist: PROTECTED_DATA_DELIVERY_WHITELIST_ADDRESS,
      });

      console.log("addToCollectionResponse", addToCollectionResponse);

      toast({
        title: "Added to collection",
        description: "Successfully added to collection.",
        action: (
          <TransactionLinkButton
            chainId={BELLECOUR_CHAIN_ID}
            txnHash={addToCollectionResponse.txHash as `0x${string}`}
          />
        ),
        variant: "default",
      });

      // -------- Set Protected Data To Renting --------
      const setProtectedDataToRentingResponse =
        await dataProtectorSharing.setProtectedDataToRenting({
          protectedData: protectedData.address,
          price,
          duration,
        });

      console.log("setProtectedDataToRentingResponse", setProtectedDataToRentingResponse);

      toast({
        title: "Set protected data to renting",
        description: "Successfully set protected data to renting.",
        action: (
          <TransactionLinkButton
            chainId={BELLECOUR_CHAIN_ID}
            txnHash={setProtectedDataToRentingResponse.txHash as `0x${string}`}
          />
        ),
        variant: "default",
      });

      return {
        protectedDataAddress: protectedData.address,
        collectionId,
      };
    },
    onError(error, variables, context) {
      console.log("Error Cause: ", error.cause);
      console.log("Error Message: ", error.message);

      toast({
        title: "Set data for renting failed!",
        description: error.message,
        variant: "destructive",
      });
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}
