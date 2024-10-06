/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";

import { siteConfig } from "@/config/site";

import { frames } from "./frames";

const handleRequest = frames(async (ctx) => {
  const previewUrl = ctx.searchParams["preview-url"];

  return {
    // eslint-disable-next-line @next/next/no-img-element
    image: previewUrl,
    buttons: [
      <Button action="link" target={`${siteConfig.url}/feed`}>
        Buy on OnlyCast
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
