import { CastWithInteractions } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { usePrivy } from "@privy-io/react-auth";
import { queryOptions, useQuery } from "@tanstack/react-query";
import invariant from "tiny-invariant";

type CastsQueryOptionsArgs = {
  viewerFid: number | null | undefined;
};

const fetchCasts = async (
  viewerFid: number | null | undefined,
): Promise<Array<CastWithInteractions>> => {
  const response = await fetch(`/api/feed?viewerFid=${viewerFid}`);
  if (!response.ok) throw new Error("Cannot get casts");

  return response.json();
};

const castsQueryOptions = ({ viewerFid }: CastsQueryOptionsArgs) =>
  queryOptions({
    queryKey: ["casts-info", viewerFid],
    queryFn: async () => {
      invariant(viewerFid);
      return await fetchCasts(viewerFid);
    },
    enabled: !!viewerFid,
    staleTime: Infinity,
  });

export const useCasts = () => {
  const { user } = usePrivy();

  const fid = user?.farcaster?.fid;

  const result = useQuery(castsQueryOptions({ viewerFid: fid }));

  return result;
};
