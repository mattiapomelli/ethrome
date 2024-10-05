"use client";

import { usePrivy } from "@privy-io/react-auth";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const { logout } = usePrivy();
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-5 bottom-5 z-50">
      <div
        className={cn(
          "mx-auto flex w-fit items-center justify-center gap-x-4 rounded-xl bg-foreground/10 px-3 py-2 backdrop-blur-sm",
          className,
        )}
      >
        {items.map(({ title, icon, href }) => (
          <Link key={title} href={href}>
            <div
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-full p-2 transition-colors duration-300 ease-out hover:bg-foreground/20",
                pathname === href && "border border-foreground/50",
              )}
            >
              {icon}
            </div>
          </Link>
        ))}

        <button
          className={cn(
            "relative flex aspect-square items-center justify-center rounded-full p-2 transition-colors duration-300 ease-out hover:bg-foreground/20",
          )}
          onClick={logout}
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </div>
  );
};
