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
  url:
    process.env.NODE_ENV === "production"
      ? `https://onlycast.vercel.app/`
      : "http://localhost:3000",
  ogImage: "https://localhost:3000/og.png",
  links: {
    twitter: "",
  },
};
