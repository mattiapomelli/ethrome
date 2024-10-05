"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import ky from "ky";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface FarcasterUser {
  signer_uuid: string;
  public_key: string;
  status: string;
  signer_approval_url?: string;
  fid?: number;
}

export default function Home() {
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(null);

  const signerUuid = "8268deeb-69a0-424d-8210-b5af93c5148c";

  const { data: signer } = useQuery({
    queryKey: ["signer", signerUuid],
    queryFn: () => ky.get(`/api/signer?signer_uuid=${signerUuid}`).json<FarcasterUser>(),
  });

  const { mutate: cast } = useMutation({
    mutationFn: (text: string) =>
      ky.post("/api/cast", { json: { signer_uuid: signerUuid, text } }).json<FarcasterUser>(),
  });

  console.log("Signer: ", signer);

  const onLogin = async () => {
    const data = await ky.post("/api/signer").json<FarcasterUser>();
    console.log("Data: ", data);
  };

  const onCast = () => {
    cast("Hello!");
  };

  return (
    <div>
      <Button onClick={onLogin}>Login</Button>
      <Button onClick={onCast}>Cast</Button>

      {farcasterUser?.status == "pending_approval" && farcasterUser?.signer_approval_url && (
        <div>
          <QRCodeSVG value={farcasterUser.signer_approval_url} />
          <div>OR</div>
          <a href={farcasterUser.signer_approval_url} target="_blank" rel="noopener noreferrer">
            Click here to view the signer URL (on mobile)
          </a>
        </div>
      )}
    </div>
  );
}
