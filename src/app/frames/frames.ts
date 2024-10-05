import { createFrames } from "frames.js/next";

export const frames = createFrames({
  basePath: "/frames",
  debug: process.env.NODE_ENV === "development",
});

/**
 *
 * @param previewUrl - The URL of the preview image (blurred image)
 * @returns - The URL of the embed page that farcaster will use to get metadata and remnder the preview on its clients (eg. warpcast)
 */
export const createEmbedUrl = (previewUrl: string) => {
  const encodedPreviewUrl = encodeURIComponent(previewUrl);
  return new URL(
    `/frames?preview-url=${encodedPreviewUrl}`,
    process.env.NEXT_PUBLIC_SITE_URL,
  ).toString();
};

export const extractPreviewUrl = (embedUrl: string) => {
  const url = new URL(embedUrl);
  return decodeURIComponent(url.searchParams.get("preview-url") ?? "");
};
