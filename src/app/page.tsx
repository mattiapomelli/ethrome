"use client";

import { useFarcasterSigner, usePrivy } from "@privy-io/react-auth";
import { redirect } from "next/navigation";

import { LoginButton } from "@/components/login-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const App = () => {
  const { user, logout, ready } = usePrivy();
  const { requestFarcasterSignerFromWarpcast } = useFarcasterSigner();

  const farcasterAccount = user?.linkedAccounts.find(
    (account: { type: string }) => account.type === "farcaster",
  );

  if (!ready) return <Skeleton className="flex-1" />;

  if (!farcasterAccount) {
    return <LoginButton />;
  }

  // @ts-expect-error - `signerPublicKey` is not defined on `farcasterAccount`
  if (!farcasterAccount.signerPublicKey) {
    return (
      <div className="flex size-full flex-1 items-center justify-center gap-2">
        <Button variant="outline" onClick={() => requestFarcasterSignerFromWarpcast()}>
          Authorize Farcaster
        </Button>
        <Button variant="destructive" onClick={logout}>
          Log out
        </Button>
      </div>
    );
  }

  return redirect("/feed");
};

export default App;
