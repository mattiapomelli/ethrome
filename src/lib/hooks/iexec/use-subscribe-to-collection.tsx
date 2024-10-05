import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { TransactionLinkButton } from "@/components/transaction-link-button";
import { buttonVariants } from "@/components/ui/button";
import { BELLECOUR_CHAIN_ID } from "@/lib/chains";
import { toast } from "@/lib/hooks/use-toast";
import {
  DEMO_WORKERPOOL_ADDRESS,
  getDataProtectorSharing,
  PROTECTED_DATA_DELIVERY_DAPP_ADDRESS,
} from "@/lib/iexec";
import { cn } from "@/lib/utils";

type RentDataParams = {
  protectedDataAddress: string;
  price: number;
  duration: number;
  collectionId: number;
};

export function useSubscribeToCollection(
  options?: Omit<
    UseMutationOptions<{ taskId: string; content: string }, Error, RentDataParams, unknown>,
    "mutationFn"
  >,
) {
  return useMutation({
    mutationFn: async ({ protectedDataAddress, price, duration, collectionId }: RentDataParams) => {
      console.log("protectedDataAddress", protectedDataAddress);
      console.log("price", price);
      console.log("duration", duration);
      console.log("collectionId", collectionId);

      // const dataProtectorCore = getDataProtectorCore();
      const dataProtectorSharing = getDataProtectorSharing();

      // const pricingParams = await dataProtectorSharing.getProtectedDataPricingParams({
      //   protectedData: protectedDataAddress,
      // });

      // const { price, duration } = pricingParams.protectedDataPricingParams.rentalParam || {};
      // if (!price || !duration) {
      //   throw new Error("Price or duration is not set");
      // }

      // -------- Rent Protected Data --------
      const subscribeResult = await dataProtectorSharing.subscribeToCollection({
        collectionId,
        price,
        duration,
      });

      console.log("subscribeResult", subscribeResult);

      toast({
        title: "Subscribed to collection",
        description: "Successfully subscribed to collection.",
        action: (
          <TransactionLinkButton
            chainId={BELLECOUR_CHAIN_ID}
            txnHash={subscribeResult.txHash as `0x${string}`}
          />
        ),
        variant: "default",
      });

      // -------- Consume Protected Data --------
      const consumeResult = await dataProtectorSharing.consumeProtectedData({
        protectedData: protectedDataAddress,
        app: PROTECTED_DATA_DELIVERY_DAPP_ADDRESS,
        workerpool: DEMO_WORKERPOOL_ADDRESS,
        onStatusUpdate: (status) => {
          console.log("[consumeProtectedData] status", status);

          if (status.title === "CONSUME_TASK" && !status.isDone) {
            toast({
              title: "Consuming protected data",
              description: "Successfully consuming protected data.",
              action: (
                <a
                  href={`https://explorer.iex.ec/bellecour/task/${status.payload?.taskId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ size: "sm" }), "text-sm", "bg-yellow-500")}
                >
                  See on Explorer
                </a>
              ),
              variant: "default",
            });
          }
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

      // -------- Get Result From Completed Task --------
      const taskResult = await dataProtectorSharing.getResultFromCompletedTask({
        taskId: consumeResult.taskId,
        path: "content",
        onStatusUpdate: (status) => {
          console.log("[getResultFromCompletedTask] status", status);
        },
      });

      console.log("taskResult", taskResult);

      // const contentAsBlob = new Blob([consumeResult.result]);
      // const result = Buffer.from(await contentAsBlob.arrayBuffer());

      const decodedText = new TextDecoder().decode(taskResult.result);

      return {
        taskId: consumeResult.taskId,
        content: decodedText,
      };
    },
    onError(error, variables, context) {
      console.log("Cause: ", error.cause);
      // @ts-ignore
      console.log("Error Cause: ", error.errorCause);
      console.log("Error: ", error.message);

      toast({
        title: "Rent data failed!",
        description: error.message,
        variant: "destructive",
      });
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}
