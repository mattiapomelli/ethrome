import { useQuery } from "@tanstack/react-query";

import { getDataProtectorSharing } from "@/lib/iexec";

export function useGetContent(taskId: string) {
  return useQuery({
    queryKey: ["content", taskId],
    queryFn: async () => {
      const dataProtectorSharing = getDataProtectorSharing();

      const taskResult = await dataProtectorSharing.getResultFromCompletedTask({
        taskId,
        path: "content",
        onStatusUpdate: (status) => {
          console.log("[getResultFromCompletedTask] status", status);
        },
      });

      console.log("taskResult", taskResult);

      const decodedText = new TextDecoder().decode(taskResult.result);
      return decodedText;
    },
  });
}
