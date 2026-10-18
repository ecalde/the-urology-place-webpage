import type { MetadataRoute } from "next";
import { client } from "@/lib/sanity";
import { redirects, routeInventory } from "@/studio/routeInventory.generated";

const SITE_URL = "https://www.theurologyplace.com";

/**
 * Pages that should not be crawled: clinical photos blocked in robots.txt,
 * and routes that immediately redirect somewhere else.
 */
const EXCLUDED_PATHS = new Set<string>([
  "/circumcision-photos",
  "/men/bladder-cancer/zusduri-bcg",
  "/men/prostate-cancer/prostate-biopsy",
  ...redirects
    .map((entry) => entry.source)
    .filter((source) => source.startsWith("/") && !source.includes(":")),
]);

type BlogSitemapPost = {
  slug: string | null;
  publishedAt: string | null;
  updatedAt: string | null;
};

/** Pick up newly published blog posts without a full redeploy. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = routeInventory
    .filter((entry) => entry.kind === "static" && !EXCLUDED_PATHS.has(entry.path))
    .map((entry) => ({
      url: entry.path === "/" ? SITE_URL : `${SITE_URL}${entry.path}`,
    }));

  let posts: BlogSitemapPost[] = [];
  try {
    posts = await client.fetch<BlogSitemapPost[]>(
      `*[_type == "post" && defined(slug.current)]{
        "slug": slug.current,
        publishedAt,
        updatedAt
      }`,
    );
  } catch {
    posts = [];
  }

  const blogEntries: MetadataRoute.Sitemap = [];
  for (const post of posts) {
    const slug = post.slug?.trim();
    if (!slug) continue;
    const lastModified = post.updatedAt || post.publishedAt;
    blogEntries.push({
      url: `${SITE_URL}/patient-resources/blog/${slug}`,
      ...(lastModified ? { lastModified } : {}),
    });
  }

  return [...staticEntries, ...blogEntries];
}
