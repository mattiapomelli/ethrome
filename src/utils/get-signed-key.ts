import { ViemLocalEip712Signer } from "@farcaster/hub-nodejs";
import { bytesToHex, hexToBytes } from "viem";
import { mnemonicToAccount } from "viem/accounts";

import { env } from "@/env.mjs";
import { neynarClient } from "@/lib/neynar";

import { getFid } from "./get-fid";

export const getSignedKey = async () => {
  const createSigner = await neynarClient.createSigner();
  const { deadline, signature } = await generate_signature(createSigner.public_key);

  if (deadline === 0 || signature === "") {
    throw new Error("Failed to generate signature");
  }

  const fid = await getFid();

  const signedKey = await neynarClient.registerSignedKey(
    createSigner.signer_uuid,
    fid,
    deadline,
    signature,
  );

  return signedKey;
};

const generate_signature = async function (public_key: string) {
  const FID = await getFid();

  const account = mnemonicToAccount(env.FARCASTER_DEVELOPER_MNEMONIC);
  const appAccountKey = new ViemLocalEip712Signer(account as any);

  // Generates an expiration date for the signature (24 hours from now).
  const deadline = Math.floor(Date.now() / 1000) + 86400;

  const uintAddress = hexToBytes(public_key as `0x${string}`);

  const signature = await appAccountKey.signKeyRequest({
    requestFid: BigInt(FID),
    key: uintAddress,
    deadline: BigInt(deadline),
  });

  if (signature.isErr()) {
    return {
      deadline,
      signature: "",
    };
  }

  const sigHex = bytesToHex(signature.value);

  return { deadline, signature: sigHex };
};
