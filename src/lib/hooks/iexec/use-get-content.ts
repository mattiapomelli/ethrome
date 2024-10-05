import { useSignMessage } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { getDataProtectorSharing } from "@/lib/iexec";
import { deriveAccountFromUid } from "@/lib/utils";

export function useGetContent(protectedDataAddress: string) {
  const { address } = useAccount();
  const { signMessage } = useSignMessage();

  return useQuery({
    queryKey: ["content", protectedDataAddress],
    queryFn: async () => {
      if (!address) throw new Error("No address found");

      const taskId = localStorage.getItem(`task-id-${protectedDataAddress}`);
      if (!taskId) return null;

      const signature = await signMessage(address);
      const privateKey = deriveAccountFromUid(signature);

      const dataProtectorSharing = getDataProtectorSharing(privateKey);

      const taskResult = await dataProtectorSharing.getResultFromCompletedTask({
        taskId,
        path: "content",
        onStatusUpdate: (status) => {
          console.log("[getResultFromCompletedTask] status", status);
        },
      });

      const decodedText = new TextDecoder().decode(taskResult.result);
      return decodedText;
    },
    enabled: !!address,
  });
}
