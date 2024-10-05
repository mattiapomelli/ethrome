import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { TransactionLinkButton } from "@/components/transaction-link-button";
import { toast } from "@/hooks/use-toast";
import { BELLECOUR_CHAIN_ID } from "@/lib/chains";
import {
  getDataProtectorCore,
  getDataProtectorSharing,
  PROTECTED_DATA_DELIVERY_WHITELIST_ADDRESS,
} from "@/lib/iexec";

type AddDataToCollectionParams = {
  data: Record<string, any>;
  name: string;
  price: number;
  duration: number;
  collectionId: number;
};

export function useSellData(
  options?: Omit<
    UseMutationOptions<string, Error, AddDataToCollectionParams, unknown>,
    "mutationFn"
  >,
) {
  return useMutation({
    mutationFn: async ({
      data,
      name,
      price,
      duration,
      collectionId,
    }: AddDataToCollectionParams) => {
      const dataProtectorCore = getDataProtectorCore();
      const dataProtectorSharing = getDataProtectorSharing();

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

      return protectedData.address;
    },
    onError(error, variables, context) {
      console.log("Error: ", error.message);

      toast({
        title: "Sell data failed!",
        description: error.message,
        variant: "destructive",
      });
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}
