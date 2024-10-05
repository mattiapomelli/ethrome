import { BELLECOUR_CHAIN_ID } from "@/lib/chains";

export const EXPLORER_URL: Record<number, string> = {
  [BELLECOUR_CHAIN_ID]: "https://blockscout-bellecour.iex.ec/",
};

export function getExplorerAddressUrl(chainId: number, address: string) {
  return `${EXPLORER_URL[chainId]}/address/${address}`;
}

export function getExplorerTransactionUrl(chainId: number, txHash: string) {
  return `${EXPLORER_URL[chainId]}/tx/${txHash}`;
}
