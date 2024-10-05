import { createFrames } from "frames.js/next";

export const frames = createFrames({
  basePath: "/frames",
  debug: process.env.NODE_ENV === "development",
});
