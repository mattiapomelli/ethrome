import { SuccessWithTransactionHash } from "@iexec/dataprotector";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { getDataProtectorSharing } from "@/lib/iexec";

type RentDataParams = {
  protectedDataAddress: string;
  price: number;
  duration: number;
};

export function useRentData(
  options?: Omit<
    UseMutationOptions<SuccessWithTransactionHash, Error, RentDataParams, unknown>,
    "mutationFn"
  >,
) {
  return useMutation({
    mutationFn: async ({ protectedDataAddress, price, duration }: RentDataParams) => {
      const dataProtectorSharing = getDataProtectorSharing();
      return await dataProtectorSharing.rentProtectedData({
        protectedData: protectedDataAddress,
        price,
        duration,
      });
    },
    ...options,
  });
}
