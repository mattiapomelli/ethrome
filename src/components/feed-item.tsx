import { CastWithInteractions, EmbedUrl } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { LockOpen, Lock } from "lucide-react";
import { useState } from "react";
import { Hex } from "viem";

import { Cast, UserInfo } from "@/components/ui/cast/cast";
import { Spinner } from "@/components/ui/spinner";
import { extractPreviewUrl } from "@/lib/frames";
import { useGetContent } from "@/lib/hooks/iexec/use-get-content";
import { useRentData } from "@/lib/hooks/iexec/use-rent-data";
import { cn } from "@/lib/utils";

export interface CastWithEmbedUrl extends CastWithInteractions {
  embeds: EmbedUrl[];
}

interface FeedItemProps {
  cast: CastWithEmbedUrl;
}

export const FeedItem: React.FC<FeedItemProps> = ({ cast }) => {
  const [paidContent, setPaidContent] = useState<string | null>(null);

  const { protectedDataAddress, duration, price } = JSON.parse(cast.embeds[0].url);
  const previewUrl = extractPreviewUrl(cast.embeds[1].url);

  const { mutate: rentData, isPending } = useRentData({
    onSuccess({ content, taskId }) {
      setPaidContent(content);
      localStorage.setItem(`task-id-${protectedDataAddress}`, taskId);

      // Like the cast for engagement/personalization bonus
      (async () => {
        const signerUuid = localStorage.getItem("farcaster-signer-uuid");

        try {
          await fetch("/api/cast/like", {
            method: "POST",
            body: JSON.stringify({
              signer_uuid: signerUuid!,
              cast_hash: cast.hash,
            }),
          });

        } catch (error) {
          console.error("Error liking cast: ", error);
        }
      })();
    },
  });

  const { data: savedContent } = useGetContent(protectedDataAddress);

  const userInfo: UserInfo = {
    creatorImgUrl: cast.author.pfp_url,
    name: cast.author.display_name,
    address: cast.author.custody_address as Hex,
    text: cast.text,
  };

  const onBuy = () => {
    rentData({
      protectedDataAddress,
      price: 0,
      duration,
    });
  };

  if (!previewUrl) return null;

  return (
    <div className="relative">
      <Cast
        key={cast.hash}
        imgSrc={savedContent ?? paidContent ?? previewUrl}
        userInfo={userInfo}
      />

      <button
        className={cn(
          "absolute bottom-36 right-2 z-50 flex size-[50px] w-fit items-center justify-center gap-x-2 rounded-lg bg-primary px-2 shadow-md transition-colors duration-300 ease-out hover:bg-primary/80 disabled:cursor-not-allowed disabled:bg-primary/50 disabled:hover:bg-primary/50",
        )}
        onClick={onBuy}
        disabled={savedContent !== null || paidContent !== null}
      >
        {price && <span className="text-white">{price}</span>}
        {savedContent !== null || paidContent !== null ? (
          <LockOpen className="size-4 text-white" />
        ) : isPending ? (
          <Spinner className="size-4 text-white" />
        ) : (
          <Lock className="size-4 text-white" />
        )}
      </button>
    </div>
  );
};
