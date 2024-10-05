"use client";
import { Button } from "@/components/ui/button";
import { useSubmitCastMutation } from "@/lib/farcaster";

const TestPage = () => {
  const { mutate: submitCast, isPending, error } = useSubmitCastMutation();

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Button
        onClick={() => {
          submitCast({
            text: "Testing custom cast",
            // embeds: [{ url: "using random data as url" }],
          });
        }}
      >
        Cast it
      </Button>
    </div>
  );
};

export default TestPage;
