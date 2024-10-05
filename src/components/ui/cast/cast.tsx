import Image from "next/image";
import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type UserInfo = {
  avatarImgSrc: string;
  username: string;
};

type CastProps = {
  userInfo?: UserInfo;
  imgSrc: string;
  description?: string;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export const Cast = ({ userInfo, imgSrc, description, className, ...props }: CastProps) => {
  return (
    <div
      className={cn(
        "relative z-10 flex h-screen w-full flex-none snap-center items-center",
        className,
      )}
      {...props}
    >
      {/* User Information */}
      {userInfo && (
        <div className="absolute inset-x-2 bottom-20 z-20 flex max-w-md flex-col gap-y-2 rounded-sm bg-black/20 p-2 backdrop-blur-sm">
          <div className="flex items-center justify-start gap-x-2">
            <Image
              src={userInfo.avatarImgSrc}
              alt={`${userInfo.username} profile image`}
              className="size-6 rounded-full"
              width={24}
              height={24}
            />
            <h2 className="text-sm font-semibold">{userInfo.username}</h2>
          </div>

          <p className="max-h-10 overflow-y-scroll text-sm font-light">{description}</p>
        </div>
      )}

      {/* Cast Content */}
      <Image src={imgSrc} alt="Cast Image" fill objectFit="cover" className="absolute" />
    </div>
  );
};
