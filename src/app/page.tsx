"use client";

import { useFarcasterSigner, usePrivy } from "@privy-io/react-auth";
import { redirect } from "next/navigation";

import { LoginButton } from "@/components/login-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFarcasterAccount } from "@/lib/farcaster";

const App = () => {
  const { logout, ready } = usePrivy();
  const { requestFarcasterSignerFromWarpcast } = useFarcasterSigner();

  const { farcasterAccount, hasGivenAuthorization } = useFarcasterAccount();

  if (!ready) return <Skeleton className="flex-1" />;

  if (!farcasterAccount) {
    return <LoginButton />;
  }

  if (!hasGivenAuthorization) {
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
