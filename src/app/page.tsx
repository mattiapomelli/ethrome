"use client";

import { useFarcasterSigner, usePrivy } from "@privy-io/react-auth";
import { redirect } from "next/navigation";

import { AnimatedText } from "@/components/animated-text";
import { LoginButton } from "@/components/login-button";
import { WordPullUp } from "@/components/typing-animation";
import { Button } from "@/components/ui/button";
import { useFarcasterAccount } from "@/lib/farcaster";

const App = () => {
  const { logout, ready } = usePrivy();
  const { requestFarcasterSignerFromWarpcast } = useFarcasterSigner();

  const { farcasterAccount, hasGivenAuthorization } = useFarcasterAccount();

  if (!ready) return null;

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
