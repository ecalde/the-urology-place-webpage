import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BTN_PRIMARY } from "@/app/lib/button-styles";
import {
  BLOG_CATEGORY_LABELS,
  blogCategoryLabel,
  client,
  postsQuery,
  urlFor,
} from "@/lib/sanity";
import { HERO_SUBTITLE_ON_LIGHT, HERO_TITLE_ON_LIGHT } from "@/app/lib/hero";

export const metadata: Metadata = {
  title: "Urology Blog in San Antonio",
};

type BlogPost = {
  _id: string;
  title: string | null;
  slug: { current?: string } | null;
  publishedAt: string | null;
  excerpt: string | null;
  mainImage: Parameters<typeof urlFor>[0] | null;
  featured: boolean | null;
  category: string | null;
  readTime: number | null;
  author: {
    _id: string;
    name: string | null;
    image: Parameters<typeof urlFor>[0] | null;
  } | null;
};

function BlogPostCard({
  post,
  featured,
}: {
  post: BlogPost;
  featured?: boolean;
}) {
  const href = `/patient-resources/blog/${post.slug?.current ?? ""}`;
  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  const imageUrl =
    post.mainImage != null
      ? urlFor(post.mainImage).width(800).height(600).url()
      : null;
  const authorAvatarUrl =
    post.author?.image != null
      ? urlFor(post.author.image).width(96).height(96).url()
      : null;
  const categoryLabel = blogCategoryLabel(post.category ?? undefined);

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md ${
        featured
          ? "border-blue-200 ring-2 ring-blue-600/15 ring-offset-0"
          : "border-slate-200/90 ring-1 ring-slate-200/80"
      }`}
    >
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        {featured ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
            Featured
          </span>
        ) : null}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title ?? "Blog post"}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            unoptimized
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col border-t border-slate-200 px-4 py-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-500">
          {categoryLabel ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
              {categoryLabel}
            </span>
          ) : null}
          {typeof post.readTime === "number" && post.readTime > 0 ? (
            <span>{post.readTime} min read</span>
          ) : null}
        </div>
        {(dateLabel || post.author?.name) && (
          <p className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            {authorAvatarUrl ? (
              <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-slate-200 ring-1 ring-slate-200/80">
                <Image
                  src={authorAvatarUrl}
                  alt=""
                  width={28}
                  height={28}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </span>
            ) : null}
            <span className="flex flex-wrap items-center gap-x-1">
              {dateLabel ? (
                <time dateTime={post.publishedAt ?? undefined}>
                  {dateLabel}
                </time>
              ) : null}
              {dateLabel && post.author?.name ? (
                <span className="text-slate-400" aria-hidden>
                  ·
                </span>
              ) : null}
              {post.author?.name ? (
                <span className="text-slate-600">{post.author.name}</span>
              ) : null}
            </span>
          </p>
        )}
        <h2 className="mt-2 text-lg font-bold leading-snug text-slate-900 md:text-xl">
          {post.title ?? "Untitled"}
        </h2>
        {post.excerpt ? (
          <p className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-slate-600">
            {post.excerpt}
          </p>
        ) : null}
        <div className="mt-4">
          <Link href={href} className={`inline-flex ${BTN_PRIMARY}`}>
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categoryParam } = await searchParams;
  const categoryFilter =
    categoryParam && categoryParam in BLOG_CATEGORY_LABELS
      ? categoryParam
      : undefined;

  const posts = await client.fetch<BlogPost[]>(postsQuery);

  const filtered = categoryFilter
    ? posts.filter((p) => p.category === categoryFilter)
    : posts;

  const featuredPosts = filtered.filter((p) => p.featured === true);
  const gridPosts = filtered.filter((p) => p.featured !== true);

  const chipBase =
    "rounded-full border px-3 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  const chipInactive =
    "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/80";
  const chipActive = "border-blue-600 bg-blue-600 text-white hover:bg-blue-700";

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h1 className={HERO_TITLE_ON_LIGHT}>
          Blog
        </h1>
        <p className={`mt-6 max-w-2xl ${HERO_SUBTITLE_ON_LIGHT}`}>
          Educational articles and practice updates from our clinic.
        </p>

        {posts.length > 0 ? (
          <nav
            className="mt-8 flex flex-wrap gap-2"
            aria-label="Filter by category"
          >
            <Link
              href="/patient-resources/blog"
              className={`${chipBase} ${!categoryFilter ? chipActive : chipInactive}`}
              aria-current={!categoryFilter ? "page" : undefined}
            >
              All
            </Link>
            {Object.entries(BLOG_CATEGORY_LABELS).map(([value, label]) => (
              <Link
                key={value}
                href={`/patient-resources/blog?category=${encodeURIComponent(value)}`}
                className={`${chipBase} ${categoryFilter === value ? chipActive : chipInactive}`}
                aria-current={categoryFilter === value ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
        ) : null}

        {filtered.length === 0 ? (
          <p className="mt-12 text-slate-600">
            {posts.length === 0
              ? "No posts yet. Check back soon."
              : "No posts in this category."}
          </p>
        ) : (
          <>
            {featuredPosts.length > 0 ? (
              <div className="mt-12">
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  Featured
                </h2>
                <ul className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                  {featuredPosts.map((post) => (
                    <li key={post._id}>
                      <BlogPostCard post={post} featured />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {gridPosts.length > 0 ? (
              <ul
                className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${featuredPosts.length > 0 ? "mt-10" : "mt-12"}`}
              >
                {gridPosts.map((post) => (
                  <li key={post._id}>
                    <BlogPostCard post={post} />
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}
