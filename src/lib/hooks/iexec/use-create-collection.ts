import { CreateCollectionResponse } from "@iexec/dataprotector";
import { useSignMessage } from "@privy-io/react-auth";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import { getDataProtectorSharing } from "@/lib/iexec";
import { deriveAccountFromUid } from "@/lib/utils";

export function useCreateCollection(
  options?: Omit<UseMutationOptions<CreateCollectionResponse, Error, void, unknown>, "mutationFn">,
) {
  const { address } = useAccount();
  const { signMessage } = useSignMessage();

  return useMutation({
    mutationFn: async () => {
      if (!address) throw new Error("No address found");

      const signature = await signMessage(address);
      const privateKey = deriveAccountFromUid(signature);

      const dataProtectorSharing = getDataProtectorSharing(privateKey);
      return await dataProtectorSharing.createCollection();
    },
    ...options,
  });
}
