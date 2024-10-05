import { ProtectedDataWithSecretProps } from "@iexec/dataprotector";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import { getDataProtectorCore } from "@/lib/iexec";

type ProtectDataParams = {
  data: Record<string, any>;
  name: string;
};

export function useProtectData(
  options?: Omit<
    UseMutationOptions<ProtectedDataWithSecretProps, Error, ProtectDataParams, unknown>,
    "mutationFn"
  >,
) {
  return useMutation({
    mutationFn: async ({ data, name }: ProtectDataParams) => {
      const dataProtectorCore = getDataProtectorCore();
      return await dataProtectorCore.protectData({
        data,
        name,
      });
    },
    ...options,
  });
}
