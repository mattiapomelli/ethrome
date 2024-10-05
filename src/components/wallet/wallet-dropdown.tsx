import { Copy, ExternalLink, LogOut } from "lucide-react";
import { useDisconnect } from "wagmi";

import { Address } from "@/components/address";
import { AddressAvatar } from "@/components/address-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { BELLECOUR_CHAIN_ID } from "@/lib/chains";
import { getExplorerAddressUrl } from "@/lib/explorer";
import { copyToClipboard } from "@/lib/utils";

interface WalletDropdownMenuProps {
  address: `0x${string}`;
}

export const WalletDropdownMenu = ({ address }: WalletDropdownMenuProps) => {
  const { disconnect } = useDisconnect();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline">
          <AddressAvatar address={address} />
          <Address address={address} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => copyToClipboard(address)}>
          <Copy className="mr-2 size-4" />
          Copy address
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={getExplorerAddressUrl(BELLECOUR_CHAIN_ID, address)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-2 size-4" />
            See in explorer
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => disconnect()}>
          <LogOut className="mr-2 size-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
