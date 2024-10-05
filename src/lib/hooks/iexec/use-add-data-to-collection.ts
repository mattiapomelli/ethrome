import { SuccessWithTransactionHash } from "@iexec/dataprotector";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { getDataProtectorSharing, PROTECTED_DATA_DELIVERY_WHITELIST_ADDRESS } from "@/lib/iexec";

type AddDataToCollectionParams = {
  protectedDataAddress: string;
  collectionId: number;
};

export function useAddDataToCollection(
  options?: Omit<
    UseMutationOptions<SuccessWithTransactionHash, Error, AddDataToCollectionParams, unknown>,
    "mutationFn"
  >,
) {
  return useMutation({
    mutationFn: async ({ protectedDataAddress, collectionId }: AddDataToCollectionParams) => {
      const dataProtectorSharing = getDataProtectorSharing();
      return await dataProtectorSharing.addToCollection({
        protectedData: protectedDataAddress,
        collectionId,
        addOnlyAppWhitelist: PROTECTED_DATA_DELIVERY_WHITELIST_ADDRESS,
      });
    },
    ...options,
  });
}
