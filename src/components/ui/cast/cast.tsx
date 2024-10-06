import Image from "next/image";
import { HTMLAttributes } from "react";
import { Hex } from "viem";

import { AddressAvatar } from "@/components/address-avatar";
import { cn } from "@/lib/utils";

export type UserInfo = {
  creatorImgUrl?: string;
  name?: string;
  address: Hex;
  text: string;
};

type CastProps = {
  userInfo: UserInfo;
  imgSrc: string;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export const Cast = ({ userInfo, imgSrc, className, ...props }: CastProps) => {
  return (
    <div
      className={cn(
        "relative z-10 flex h-screen w-full flex-none snap-center items-center",
        className,
      )}
      {...props}
    >
      {/* User Information */}
      {userInfo.creatorImgUrl && userInfo.name ? (
        <div className="absolute inset-x-2 bottom-36 z-20 flex w-3/4 max-w-lg flex-col gap-y-2 rounded-sm bg-foreground/25 px-2.5 py-2 shadow-md backdrop-blur-md">
          <div className="flex items-center justify-start gap-x-2">
            <Image
              src={userInfo.creatorImgUrl}
              alt="Creator Profile Image"
              className="rounded-full object-cover"
              height={32}
              width={32}
            />
            <h2 className="truncate text-sm font-semibold text-white">{userInfo.name}</h2>
          </div>

          <p className="text-sm text-white">{userInfo.text}</p>
        </div>
      ) : (
        <div className="absolute inset-x-2 bottom-36 z-20 flex w-3/4 max-w-lg flex-col gap-y-2 rounded-sm bg-foreground/25 px-2.5 py-2 shadow-md backdrop-blur-md">
          <div className="flex items-center justify-start gap-x-2">
            <AddressAvatar address={userInfo.address} size={4} />
            <h2 className="truncate text-sm font-semibold text-white">{userInfo.address}</h2>
          </div>

          <p className="text-sm text-white">{userInfo.text}</p>
        </div>
      )}

      {/* Cast Content */}
      <Image src={imgSrc} alt="Cast Image" fill objectFit="cover" className="absolute" />
    </div>
  );
};
