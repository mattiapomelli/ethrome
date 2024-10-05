import { fetchMetadata } from "frames.js/next";

import { siteConfig } from "@/config/site";

type Props = {
  params: { "preview-url": string };
};

export async function generateMetadata({ params }: Props) {
  // read route params
  const previewUrl = params["preview-url"];

  return {
    title: "OnlyCast",
    // provide a full URL to your /frames endpoint
    other: await fetchMetadata(new URL(`/frames?preview-url=${previewUrl}`, siteConfig.url)),
  };
}

const Page = function () {
  return null;
};
export default Page;
