import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: "https://www.theurologyplace.com/sitemap.xml",
    rules: [
      {
        userAgent: "*",
        disallow: [
          "/studio",
          "/studio/",
          "/studio/*",
          "/api",
          "/api/",
          "/api/*",
          "/circumcision-photos",
          "/circumcision-photos/",
          "/circumcision-photos/*",
        ],
      },
    ],
  };
}

