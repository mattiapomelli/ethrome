import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_PRIVY_APP_ID: z.string().min(1),
    NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
    NEXT_PUBLIC_SUPABASE_KEY: z.string().min(1),
  },
  // Only need to destructure client variables
  experimental__runtimeEnv: {
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
