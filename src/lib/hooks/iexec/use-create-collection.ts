import { CreateCollectionResponse } from "@iexec/dataprotector";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { getDataProtectorSharing } from "@/lib/iexec";

export function useCreateCollection(
  options?: Omit<UseMutationOptions<CreateCollectionResponse, Error, void, unknown>, "mutationFn">,
) {
  return useMutation({
    mutationFn: async () => {
      const dataProtectorSharing = getDataProtectorSharing();
      return await dataProtectorSharing.createCollection();
    },
    ...options,
  });
}
