import { useSignMessage } from "@privy-io/react-auth";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { TransactionLinkButton } from "@/components/transaction-link-button";
import { buttonVariants } from "@/components/ui/button";
import { BELLECOUR_CHAIN_ID } from "@/lib/chains";
import { toast } from "@/lib/hooks/use-toast";
import {
  DEMO_WORKERPOOL_ADDRESS,
  getDataProtectorSharing,
  PROTECTED_DATA_DELIVERY_DAPP_ADDRESS,
} from "@/lib/iexec";
import { cn, deriveAccountFromUid } from "@/lib/utils";

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
  const { address } = useAccount();
  const { signMessage } = useSignMessage();

  return useMutation({
    mutationFn: async ({ protectedDataAddress, price, duration }: RentDataParams) => {
      if (!address) throw new Error("No address found");

      const signature = await signMessage(address);
      const privateKey = deriveAccountFromUid(signature);

      // const dataProtectorCore = getDataProtectorCore();
      const dataProtectorSharing = getDataProtectorSharing(privateKey);

      // const pricingParams = await dataProtectorSharing.getProtectedDataPricingParams({
      //   protectedData: protectedDataAddress,
      // });

      // const { price, duration } = pricingParams.protectedDataPricingParams.rentalParam || {};
      // if (!price || !duration) {
      //   throw new Error("Price or duration is not set");
      // }

      // -------- Rent Protected Data --------
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

      // -------- Consume Protected Data --------
      const consumeResult = await dataProtectorSharing.consumeProtectedData({
        protectedData: protectedDataAddress,
        app: PROTECTED_DATA_DELIVERY_DAPP_ADDRESS,
        workerpool: DEMO_WORKERPOOL_ADDRESS,
        onStatusUpdate: (status) => {
          console.log("[consumeProtectedData] status", status);

          if (status.title === "CONSUME_TASK" && !status.isDone) {
            toast({
              title: "Started to consume protected data",
              description: "Consuming protected data.",
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

      console.log("consumeResult", consumeResult);

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

      console.log("decodedText", decodedText);

      return {
        taskId: consumeResult.taskId,
        content: decodedText,
      };
    },
    onError(error, variables, context) {
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
