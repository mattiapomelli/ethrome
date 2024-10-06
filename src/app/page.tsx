"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { redirect } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

import { AnimatedText } from "@/components/animated-text";
import { LoginButton } from "@/components/login-button";
import { WordPullUp } from "@/components/typing-animation";
import { Button } from "@/components/ui/button";
import { useFarcasterAccount } from "@/lib/farcaster";

interface FarcasterUser {
  signer_uuid: string;
  public_key: string;
  status: string;
  signer_approval_url?: string;
  fid?: number;
}

const App = () => {
  const { logout, ready } = usePrivy();

  const { farcasterAccount } = useFarcasterAccount();

  const { data: signer, isLoading } = useQuery<FarcasterUser | null>({
    queryKey: ["farcaster-signer"],
    queryFn: async () => {
      const signerUuid = localStorage.getItem("farcaster-signer-uuid");
      if (signerUuid) {
        return await ky.get(`/api/signer?signer_uuid=${signerUuid}`).json<FarcasterUser>();
      }

      const data = await ky.post("/api/signer").json<FarcasterUser>();
      localStorage.setItem("farcaster-signer-uuid", data.signer_uuid);

      if (data && data.status !== "approved" && data.signer_approval_url) {
        window.location.href = data.signer_approval_url;
      }

      return data;
    },
    enabled: !!farcasterAccount,
    refetchInterval: 2000,
  });

  if (!ready || isLoading) return null;

  if (!farcasterAccount) {
    return (
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-y-6">
        <div>
          <WordPullUp words="Welcome to" className="text-center text-xl"></WordPullUp>
          <AnimatedText
            word="OnlyCast"
            className="text-center text-5xl font-semibold text-primary"
          />
        </div>
        <LoginButton />
      </div>
    );
  }

  if (signer && signer.status !== "approved") {
    return (
      <div className="flex size-full flex-1 items-center justify-center gap-2">
        {signer.signer_approval_url && (
          <div className="flex flex-col items-center gap-3">
            <QRCodeSVG value={signer.signer_approval_url} />
            <Button>
              <a href={signer.signer_approval_url} target="_blank" rel="noopener noreferrer">
                Open in Farcaster
              </a>
            </Button>
          </div>
        )}

        {/* <Button variant="outline" onClick={() => requestFarcasterSignerFromWarpcast()}>
          Authorize Farcaster
        </Button> */}
        <Button variant="destructive" onClick={logout}>
          Log out
        </Button>
      </div>
    );
  }

  return redirect("/feed");
};

export default App;
