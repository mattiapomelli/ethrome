"use client";

import { EmbeddedCast, EmbedUrl } from "@neynar/nodejs-sdk/build/neynar-api/v2";

import { CastWithEmbedUrl, FeedItem } from "@/components/feed-item";
import { CastWrapper } from "@/components/ui/cast/cast-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { useCasts } from "@/lib/hooks/use-casts";

const isEmbedUrl = (embed: EmbeddedCast): embed is EmbedUrl => {
  return (embed as EmbedUrl)?.url !== undefined;
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const FeedPage = () => {
  const { data: casts, isLoading } = useCasts();

  const filteredCasts = casts?.filter((cast) => {
    const firstEmbed = cast.embeds[0];
    if (!isEmbedUrl(firstEmbed)) return false;

    const secondEmbed = cast.embeds[1];
    if (!isEmbedUrl(secondEmbed) || !isValidUrl(secondEmbed.url)) return false;

    return true;
  }) as CastWithEmbedUrl[];

  if (isLoading) return <Skeleton className="flex-1" />;

  console.log("filteredCasts: ", filteredCasts);

  return (
    <CastWrapper>
      <div>{filteredCasts?.map((cast) => <FeedItem key={cast.hash} cast={cast} />)}</div>
    </CastWrapper>
  );
};

export default FeedPage;
