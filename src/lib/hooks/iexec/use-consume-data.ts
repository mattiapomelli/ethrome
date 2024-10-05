import { ConsumeProtectedDataResponse } from "@iexec/dataprotector";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import {
  DEMO_WORKERPOOL_ADDRESS,
  getDataProtectorSharing,
  PROTECTED_DATA_DELIVERY_DAPP_ADDRESS,
} from "@/lib/iexec";

type ConsumeDataParams = {
  protectedDataAddress: string;
};

export function useConsumeData(
  options?: Omit<
    UseMutationOptions<ConsumeProtectedDataResponse, Error, ConsumeDataParams, unknown>,
    "mutationFn"
  >,
) {
  return useMutation({
    mutationFn: async ({ protectedDataAddress }: ConsumeDataParams) => {
      const dataProtectorSharing = getDataProtectorSharing();
      return await dataProtectorSharing.consumeProtectedData({
        protectedData: protectedDataAddress,
        app: PROTECTED_DATA_DELIVERY_DAPP_ADDRESS,
        workerpool: DEMO_WORKERPOOL_ADDRESS,
        onStatusUpdate: (status) => {
          console.log("[consumeProtectedData] status", status);
        },
      });
    },
    ...options,
  });
}
