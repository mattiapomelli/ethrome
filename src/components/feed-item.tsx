import { CastWithInteractions, EmbedUrl } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { LockOpen } from "lucide-react";
import { Hex } from "viem";

import { Cast, UserInfo } from "@/components/ui/cast/cast";
import { useRentData } from "@/lib/hooks/iexec/use-rent-data";
import { cn } from "@/lib/utils";

export interface CastWithEmbedUrl extends CastWithInteractions {
  embeds: EmbedUrl[];
}

interface FeedItemProps {
  cast: CastWithEmbedUrl;
}

export const FeedItem: React.FC<FeedItemProps> = ({ cast }) => {
  const { mutate: rentData } = useRentData();

  const { protectedDataAddress, duration } = JSON.parse(cast.embeds[0].url);
  const previewUrl = cast.embeds[1].url;

  const userInfo: UserInfo = {
    address: cast.author.custody_address as Hex,
    username: cast.text,
  };

  const onBuy = () => {
    rentData({
      protectedDataAddress,
      price: 0,
      duration,
    });
  };

  return (
    <div className="relative">
      <Cast key={cast.hash} imgSrc={previewUrl} userInfo={userInfo} />
      <button
        className={cn(
          "absolute bottom-40 right-2 z-50 flex aspect-square items-center justify-center rounded-full border border-primary p-2 transition-colors duration-300 ease-out hover:bg-primary/20",
        )}
        onClick={() => console.log("unlock")}
      >
        <LockOpen className="size-4 text-primary" />
      </button>
    </div>
  );
};
