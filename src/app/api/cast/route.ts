import { NextResponse } from "next/server";

import { neynarClient } from "@/lib/neynar";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const cast = await neynarClient.publishCast(body.signer_uuid, body.text, {
      embeds: body.embeds,
    });

    return NextResponse.json(cast, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
