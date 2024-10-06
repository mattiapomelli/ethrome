import { Home, Plus } from "lucide-react";
import { ReactNode } from "react";

import { Dock } from "@/components/ui/dock";

const links = [
  {
    title: "Feeds",
    icon: <Home className="size-4 text-white" />,
    href: "/feed",
  },
  {
    title: "Create",
    icon: <Plus className="size-4 text-white" />,
    href: "/create",
  },
];

const Layout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <>
      {children}
      <Dock items={links} />
    </>
  );
};

export default Layout;
