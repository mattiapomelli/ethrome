import { NextResponse } from "next/server";

import { neynarClient } from "@/lib/neynar";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const like = await neynarClient.publishReactionToCast(body.signer_uuid, "like", body.cast_hash);

    if (like.success) {
      return NextResponse.json(like, { status: 200 });
    } else {
      return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
