"use client";
import { usePrivy } from "@privy-io/react-auth";

import { Button } from "@/components/ui/button";

export const LoginButton = () => {
  const { ready, authenticated, login } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  return (
    <Button size="sm" className="min-w-32" disabled={disableLogin} onClick={login}>
      Log in
    </Button>
  );
};
