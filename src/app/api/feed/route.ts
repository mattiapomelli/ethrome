import { NextResponse } from "next/server";

import { neynarClient } from "@/lib/neynar";

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

  return NextResponse.json(casts, { status: 200 });
}
