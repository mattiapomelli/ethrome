"use client";

import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type CastProps = {
  className?: string;
};

export const Cast = ({ className, children }: CastProps & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "z-10 flex h-screen w-full flex-none snap-center items-center justify-center",
        className,
      )}
    >
      {children}
    </div>
  );
};
