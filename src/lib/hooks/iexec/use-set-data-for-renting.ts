import { SetProtectedDataToRentingParams, SuccessWithTransactionHash } from "@iexec/dataprotector";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { getDataProtectorSharing } from "@/lib/iexec";

export function useSetDataForRenting(
  options?: Omit<
    UseMutationOptions<SuccessWithTransactionHash, Error, SetProtectedDataToRentingParams, unknown>,
    "mutationFn"
  >,
) {
  return useMutation({
    mutationFn: async ({ protectedData, price, duration }: SetProtectedDataToRentingParams) => {
      const dataProtectorSharing = getDataProtectorSharing();
      return await dataProtectorSharing.setProtectedDataToRenting({
        protectedData,
        price,
        duration,
      });
    },
    ...options,
  });
}
