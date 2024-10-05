import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { TransactionLinkButton } from "@/components/transaction-link-button";
import { BELLECOUR_CHAIN_ID } from "@/lib/chains";
import { toast } from "@/lib/hooks/use-toast";
import {
  DEMO_WORKERPOOL_ADDRESS,
  getDataProtectorSharing,
  PROTECTED_DATA_DELIVERY_DAPP_ADDRESS,
} from "@/lib/iexec";

type RentDataParams = {
  protectedDataAddress: string;
  price: number;
  duration: number;
};

export function useRentData(
  options?: Omit<
    UseMutationOptions<{ taskId: string; content: string }, Error, RentDataParams, unknown>,
    "mutationFn"
  >,
) {
  return useMutation({
    mutationFn: async ({ protectedDataAddress, price, duration }: RentDataParams) => {
      const dataProtectorSharing = getDataProtectorSharing();

      // const oneProtectedData = await dataProtectorCore.getProtectedData({
      //   protectedDataAddress: '0x123abc...',
      // });

      const rentResult = await dataProtectorSharing.rentProtectedData({
        protectedData: protectedDataAddress,
        price,
        duration,
      });

      console.log("rentResult", rentResult);

      toast({
        title: "Rent protected data",
        description: "Successfully rented protected data.",
        action: (
          <TransactionLinkButton
            chainId={BELLECOUR_CHAIN_ID}
            txnHash={rentResult.txHash as `0x${string}`}
          />
        ),
        variant: "default",
      });

      const consumeResult = await dataProtectorSharing.consumeProtectedData({
        protectedData: protectedDataAddress,
        app: PROTECTED_DATA_DELIVERY_DAPP_ADDRESS,
        workerpool: DEMO_WORKERPOOL_ADDRESS,
        onStatusUpdate: (status) => {
          console.log("[consumeProtectedData] status", status);
        },
      });

      console.log("consumeResult", consumeResult.result);

      toast({
        title: "Consumed protected data",
        description: "Successfully consumed protected data.",
        action: (
          <TransactionLinkButton
            chainId={BELLECOUR_CHAIN_ID}
            txnHash={consumeResult.txHash as `0x${string}`}
          />
        ),
        variant: "default",
      });

      const taskResult = await dataProtectorSharing.getResultFromCompletedTask({
        taskId: consumeResult.taskId,
        path: "content",
        onStatusUpdate: (status) => {
          console.log("[getResultFromCompletedTask] status", status);
        },
      });

      // const contentAsBlob = new Blob([consumeResult.result]);
      // const result = Buffer.from(await contentAsBlob.arrayBuffer());

      const decodedText = new TextDecoder().decode(taskResult.result);

      return {
        taskId: consumeResult.taskId,
        content: decodedText,
      };
    },
    onError(error, variables, context) {
      console.log("Error: ", error.message);

      toast({
        title: "Buy data failed!",
        description: error.message,
        variant: "destructive",
      });
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}
