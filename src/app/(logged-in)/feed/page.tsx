"use client";

import { Cast } from "@/components/ui/cast/cast";
import { CastWithInteractions, EmbedUrl } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { usePrivy } from "@privy-io/react-auth";
import { useCallback, useEffect, useState } from "react";

const FeedPage = () => {
  const [casts, setCasts] = useState<CastWithInteractions[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = usePrivy();

  const fetchFeed = useCallback(async () => {
    if (!user || !user.farcaster) return;

    setLoading(true);

    const viewerFid = user.farcaster.fid;

    const response = await fetch(`/api/feed?viewerFid=${viewerFid}`);

    if (!response.ok) {
      console.error("Failed to fetch feed");
      return;
    }

    const data = await response.json();

    console.log(data);

    setCasts(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  return (
    <div className="size-full flex-1">
      <div className="text-2xl font-bold">feed page</div>
      {loading && <div>loading...</div>}
      {!loading && (
        <Cast className="flex flex-col gap-4">
          {casts.map((cast) => (
            <div key={cast.hash}>
              <div>text: {cast.text}</div>
              <div>url: {(cast.embeds?.[0] as EmbedUrl)?.url}</div>
            </div>
          ))}
        </Cast>
      )}
    </div>
  );
};

export default FeedPage;
