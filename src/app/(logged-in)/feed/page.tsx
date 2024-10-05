"use client";

import { EmbeddedCast, EmbedUrl } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { Hex } from "viem";

import { useCasts } from "@/app/(logged-in)/feed/_hooks/use-casts";
import { Cast, UserInfo } from "@/components/ui/cast/cast";

const isEmbedUrl = (embed: EmbeddedCast): embed is EmbedUrl => {
  return (embed as EmbedUrl).url !== undefined;
};

const FeedPage = () => {
  const { data: casts, isLoading } = useCasts();

  if (isLoading) return <div>loading...</div>;
  if (!casts) return <div>No casts</div>;

  return casts.map((cast) => {
    const embeds = cast.embeds.map((embed) => {
      try {
        if (isEmbedUrl(embed)) {
          const parsedEmbed = JSON.parse(embed.url);
          return parsedEmbed;
        }
      } catch (error) {
        console.error("Failed to parse embed:", error);
      }

      return null;
    });

    if (!embeds[0]?.previewImg) return null;

    const userInfo: UserInfo = {
      address: cast.author.custody_address as Hex,
      username: cast.text,
    };

    return <Cast key={cast.hash} imgSrc={embeds[0].previewImg} userInfo={userInfo} />;
  });
};

export default FeedPage;
