"use client";

import { useCasts } from "@/app/(logged-in)/feed/_hooks/use-casts";
import { Cast } from "@/components/ui/cast/cast";

const FeedPage = () => {
  const { data: casts, isLoading } = useCasts();

  if (isLoading) return <div>loading...</div>;
  if (!casts) return <div>No casts</div>;

  return casts.map((cast) => <Cast key={cast.hash} imgSrc="" />);
};

export default FeedPage;
