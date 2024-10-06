import { CastWithInteractions } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { NextResponse } from "next/server";

import { env } from "@/env.mjs";
import { neynarClient } from "@/lib/neynar";
import { RerankedCast } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const viewerFid = searchParams.get("viewerFid");

  if (!viewerFid || isNaN(Number(viewerFid))) {
    return NextResponse.json({ error: "viewerFid is required" }, { status: 400 });
  }

  const result = await neynarClient.fetchFeed("filter", {
    filterType: "embed_url",
    embedUrl: "protectedDataAddress", // Filters only posts that contain the `protectedDataAddress` string
    // fid: Number(viewerFid), // Not sure if this is needed
    viewerFid: Number(viewerFid), // Repects users blocks + mutes
    limit: 100,
  });

  let casts = result.casts;

  // console.log(casts.map((cast) => cast.hash));

  if (!env.MBD_API_KEY) {
    return NextResponse.json({ error: "MBD_API_KEY is not set" }, { status: 500 });
  }

  const mbdResult = await fetch(`https://api.mbd.xyz/v1/farcaster/casts/feed/reranked`, {
    headers: {
      "x-api-key": env.MBD_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      user_id: viewerFid,
      items_list: casts.map((cast) => cast.hash),
      return_metadata: true,
    }),
  });

  const mbdData = await mbdResult.json();
  // console.log(mbdData);

  const rerankedCasts: CastWithInteractions[] = mbdData.body
    .map((mbdItem: RerankedCast) => {
      return casts.find((cast) => cast.hash === mbdItem.item_id);
    })
    .filter(Boolean);

  // console.log(rerankedCasts.map((cast) => cast.hash));

  return NextResponse.json(rerankedCasts, { status: 200 });
}
