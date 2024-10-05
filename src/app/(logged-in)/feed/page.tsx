"use client";

import { EmbeddedCast, EmbedUrl } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { LockOpen } from "lucide-react";
import { Hex } from "viem";

import { useCasts } from "@/app/(logged-in)/feed/_hooks/use-casts";
import { Cast, UserInfo } from "@/components/ui/cast/cast";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const isEmbedUrl = (embed: EmbeddedCast): embed is EmbedUrl => {
  return (embed as EmbedUrl).url !== undefined;
};

const FeedPage = () => {
  const { data: casts, isLoading } = useCasts();

  if (isLoading) return <Skeleton className="flex-1" />;

  return casts?.map((cast) => {
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

    return (
      <>
        <Cast key={cast.hash} imgSrc={embeds[0].previewImg} userInfo={userInfo} />
        <button
          className={cn(
            "absolute bottom-40 right-2 z-50 flex aspect-square items-center justify-center rounded-full border border-primary p-2 transition-colors duration-300 ease-out hover:bg-primary/20",
          )}
          onClick={() => console.log("unlock")}
        >
          <LockOpen className="size-4 text-primary" />
        </button>
      </>
    );
  });
};

export default FeedPage;
