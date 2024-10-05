import { siteConfig } from "@/config/site";

/**
 *
 * @param previewUrl - The URL of the preview image (blurred image)
 * @returns - The URL of the embed page that farcaster will use to get metadata and remnder the preview on its clients (eg. warpcast)
 */
export const createEmbedUrl = (previewUrl: string) => {
  const encodedPreviewUrl = encodeURIComponent(previewUrl);
  return `${siteConfig.url}/frames/${encodedPreviewUrl}/cast`;
};

export const extractPreviewUrl = (embedUrl: string) => {
  const url = new URL(embedUrl);
  const encodedPreviewUrl = url.searchParams.get("preview-url");
  return encodedPreviewUrl ? decodeURIComponent(encodedPreviewUrl) : null;
};
