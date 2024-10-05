import { buttonVariants } from "@/components/ui/button";
import { getExplorerTransactionUrl } from "@/lib/explorer";
import { cn } from "@/lib/utils";

interface TransactionLinkButtonProps {
  chainId: number;
  txnHash: `0x${string}`;
}

export function TransactionLinkButton({ chainId, txnHash }: TransactionLinkButtonProps) {
  return (
    <a
      href={getExplorerTransactionUrl(chainId, txnHash)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ size: "sm" }), "text-sm")}
    >
      See on Explorer
    </a>
  );
}
