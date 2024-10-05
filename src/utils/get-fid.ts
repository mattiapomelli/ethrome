import { mnemonicToAccount } from "viem/accounts";

import { env } from "@/env.mjs";
import { neynarClient } from "@/lib/neynar";

export const getFid = async () => {
  const account = mnemonicToAccount(env.FARCASTER_DEVELOPER_MNEMONIC);

  // Lookup user details using the custody address.
  const { user: farcasterDeveloper } = await neynarClient.lookupUserByCustodyAddress(
    account.address,
  );

  return Number(farcasterDeveloper.fid);
};
