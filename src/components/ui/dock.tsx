"use client";

import Link from "next/link";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DockItem = {
  title: string;
  icon: ReactNode;
  href: string;
};

type DockProps = {
  items: Array<DockItem>;
  className?: string;
};

export const Dock = ({ items, className }: DockProps) => {
  return (
    <div
      className={cn(
        "fixed inset-x-5 bottom-5 z-50 mx-auto flex w-fit items-center justify-center gap-x-2 rounded-full bg-black/20 px-3 py-2 backdrop-blur-sm",
        className,
      )}
    >
      {items.map(({ title, icon, href }) => (
        <Link key={title} href={href}>
          <div className="relative flex aspect-square items-center justify-center rounded-full p-2 transition-colors duration-300 ease-out hover:bg-white/10 dark:hover:bg-neutral-800">
            {icon}
          </div>
        </Link>
      ))}
    </div>
  );
};
