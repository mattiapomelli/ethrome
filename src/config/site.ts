export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
  };
};

export const siteConfig: SiteConfig = {
  name: "OnlyCast",
  description: "You pay you see",
  url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
  ogImage: "https://localhost:3000/og.png",
  links: {
    twitter: "",
  },
};
