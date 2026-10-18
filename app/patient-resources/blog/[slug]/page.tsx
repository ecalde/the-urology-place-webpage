import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type {
  ArbitraryTypedObject,
  PortableTextBlock,
} from "@portabletext/types";
import { BTN_PRIMARY } from "@/app/lib/button-styles";
import { blogCategoryLabel, client, urlFor } from "@/lib/sanity";

/** Fetches published post fields. Editors must Publish in Studio for changes to appear on the site; production static pages update on the next deploy unless revalidation is configured. */
const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage,
  body,
  featured,
  category,
  tags,
  readTime,
  updatedAt,
  seoTitle,
  seoDescription,
  ctaText,
  ctaLink,
  relatedPosts[]->{
    _id,
    title,
    slug,
    excerpt,
    mainImage
  },
  author->{
    _id,
    name,
    image
  }
}`;

const allSlugsQuery = `*[_type == "post" && defined(slug.current)].slug.current`;

function PostCta({ href, label }: { href: string; label: string }) {
  const external =
    href.startsWith("http://") || href.startsWith("https://");
  const className = `inline-flex ${BTN_PRIMARY}`;
  if (external) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

type Author = {
  _id: string;
  name: string | null;
  image: Parameters<typeof urlFor>[0] | null;
};

/** Dereferenced related post from GROQ (may include nulls from broken refs) */
type RelatedPostProjection = {
  _id: string;
  title: string | null;
  slug: { current?: string } | null;
  excerpt: string | null;
  mainImage: Parameters<typeof urlFor>[0] | null;
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
  tags: string[] | null;
  readTime: number | null;
  updatedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  /** Portable Text blocks + image objects from Sanity */
  body: Array<PortableTextBlock | ArbitraryTypedObject> | null;
  ctaText: string | null;
  ctaLink: string | null;
  relatedPosts: (RelatedPostProjection | null)[] | null;
  author: Author | null;
};

function normalizeRelatedPosts(
  currentId: string,
  raw: BlogPost["relatedPosts"],
): RelatedPostProjection[] {
  if (!raw?.length) return [];
  return raw.filter(
    (r): r is RelatedPostProjection =>
      r != null &&
      typeof r._id === "string" &&
      r._id !== currentId &&
      Boolean(r.slug?.current),
  );
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h2 className="mt-10 text-3xl font-bold tracking-tight text-slate-900 first:mt-0">
        {children}
      </h2>
    ),
    h2: ({ children }) => (
      <h3 className="mt-10 text-2xl font-bold tracking-tight text-slate-900 first:mt-0">
        {children}
      </h3>
    ),
    h3: ({ children }) => (
      <h4 className="mt-8 text-xl font-bold text-slate-900 first:mt-0">
        {children}
      </h4>
    ),
    h4: ({ children }) => (
      <h5 className="mt-6 text-lg font-semibold text-slate-900 first:mt-0">
        {children}
      </h5>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-blue-600 pl-4 text-slate-700 italic">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="mb-4 text-base leading-relaxed text-slate-700 last:mb-0">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-disc space-y-2 pl-6 text-slate-700 marker:text-slate-400">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-decimal space-y-2 pl-6 text-slate-700 marker:text-slate-500">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-slate-900">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href = value?.href ?? "#";
      const external =
        href.startsWith("http://") || href.startsWith("https://");
      const className =
        "font-medium text-blue-600 underline decoration-blue-600/30 underline-offset-2 transition hover:text-blue-700 hover:decoration-blue-700";
      if (external) {
        return (
          <a
            href={href}
            className={className}
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={className}>
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const src = urlFor(value).width(1200).url();
      const alt =
        typeof value.alt === "string" && value.alt.trim() !== ""
          ? value.alt
          : "";
      const caption =
        typeof value.caption === "string" && value.caption.trim() !== ""
          ? value.caption
          : null;
      return (
        <figure className="my-8">
          <div className="relative w-full overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200/80">
            <Image
              src={src}
              alt={alt}
              width={1200}
              height={675}
              className="h-auto w-full object-cover"
              sizes="(min-width: 768px) 48rem, 100vw"
              unoptimized
            />
          </div>
          {caption ? (
            <figcaption className="mt-2 text-center text-sm text-slate-500">
              {caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(allSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await client.fetch<
    Pick<BlogPost, "title" | "excerpt" | "seoTitle" | "seoDescription"> | null
  >(
    `*[_type == "post" && slug.current == $slug][0]{ title, excerpt, seoTitle, seoDescription }`,
    { slug },
  );
  if (!post?.title) {
    return { title: "Urology Blog in San Antonio" };
  }
  const raw = (post.seoTitle?.trim() || post.title).trim();
  const title = /the urology place/i.test(raw)
    ? { absolute: raw }
    : /san antonio/i.test(raw)
      ? raw
      : `${raw} in San Antonio`;
  const metaDesc =
    post.seoDescription?.trim() || post.excerpt?.trim() || undefined;
  return {
    title,
    description: metaDesc,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await client.fetch<BlogPost | null>(postBySlugQuery, { slug });

  if (!post) {
    notFound();
  }

  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const imageUrl =
    post.mainImage != null
      ? urlFor(post.mainImage).width(1200).height(675).url()
      : null;

  const relatedPosts = normalizeRelatedPosts(post._id, post.relatedPosts);

  const categoryLabel = blogCategoryLabel(post.category ?? undefined);
  const tags = post.tags?.filter((t) => t && String(t).trim() !== "") ?? [];
  const updatedLabel = post.updatedAt
    ? new Date(post.updatedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  const authorAvatarUrl =
    post.author?.image != null
      ? urlFor(post.author.image).width(128).height(128).url()
      : null;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <p className="text-sm">
          <Link
            href="/patient-resources/blog"
            className="font-medium text-blue-600 transition hover:text-blue-700"
          >
            ← Blog
          </Link>
        </p>

        <header className="mt-8">
          {(post.featured === true || categoryLabel || tags.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {post.featured === true ? (
                <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                  Featured
                </span>
              ) : null}
              {categoryLabel ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {categoryLabel}
                </span>
              ) : null}
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1
            className={`text-4xl font-bold tracking-tight text-slate-900 md:text-5xl ${post.featured === true || categoryLabel || tags.length > 0 ? "mt-4" : ""}`}
          >
            {post.title ?? "Untitled"}
          </h1>
          {(authorAvatarUrl ||
            dateLabel ||
            post.author?.name ||
            (typeof post.readTime === "number" && post.readTime > 0) ||
            updatedLabel) && (
            <div className="mt-4 flex flex-col gap-2 text-sm font-medium text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
              <span className="flex flex-wrap items-center gap-2">
                {authorAvatarUrl ? (
                  <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-200 ring-1 ring-slate-200/80">
                    <Image
                      src={authorAvatarUrl}
                      alt=""
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </span>
                ) : null}
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
              <span className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                {typeof post.readTime === "number" && post.readTime > 0 ? (
                  <span>{post.readTime} min read</span>
                ) : null}
                {updatedLabel ? (
                  <>
                    {(typeof post.readTime === "number" && post.readTime > 0) ||
                    dateLabel ||
                    post.author?.name ? (
                      <span className="text-slate-400" aria-hidden>
                        ·
                      </span>
                    ) : null}
                    <span>
                      Updated{" "}
                      <time dateTime={post.updatedAt ?? undefined}>
                        {updatedLabel}
                      </time>
                    </span>
                  </>
                ) : null}
              </span>
            </div>
          )}
        </header>

        {imageUrl ? (
          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200/80">
            <Image
              src={imageUrl}
              alt={post.title ?? "Blog post"}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 768px) 48rem, 100vw"
              unoptimized
            />
          </div>
        ) : null}

        {post.excerpt ? (
          <p className="mt-8 text-lg leading-relaxed text-slate-600">
            {post.excerpt}
          </p>
        ) : null}

        {post.body && post.body.length > 0 ? (
          <div className="mt-10 border-t border-slate-200 pt-10">
            <PortableText
              value={post.body}
              components={portableTextComponents}
            />
          </div>
        ) : null}

        {relatedPosts.length > 0 ? (
          <section
            className="mt-12 border-t border-slate-200 pt-10"
            aria-labelledby="related-posts-heading"
          >
            <h2
              id="related-posts-heading"
              className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl"
            >
              Related posts
            </h2>
            <ul className="mt-6 flex flex-col gap-4">
              {relatedPosts.map((related) => {
                const href = `/patient-resources/blog/${related.slug?.current ?? ""}`;
                const thumbUrl =
                  related.mainImage != null
                    ? urlFor(related.mainImage).width(400).height(300).url()
                    : null;
                return (
                  <li key={related._id}>
                    <Link
                      href={href}
                      className="group flex gap-4 overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-md"
                    >
                      <div className="relative aspect-[4/3] w-28 shrink-0 bg-slate-100 sm:w-36">
                        {thumbUrl ? (
                          <Image
                            src={thumbUrl}
                            alt={related.title ?? ""}
                            fill
                            className="object-cover transition group-hover:opacity-95"
                            sizes="144px"
                            unoptimized
                          />
                        ) : null}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center py-3 pr-4">
                        <span className="font-bold leading-snug text-slate-900 group-hover:text-blue-700">
                          {related.title ?? "Untitled"}
                        </span>
                        {related.excerpt ? (
                          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">
                            {related.excerpt}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {post.ctaLink?.trim() ? (
          <div className="mt-12 flex justify-center border-t border-slate-200 pt-10">
            <PostCta
              href={post.ctaLink.trim()}
              label={post.ctaText?.trim() || "Learn more"}
            />
          </div>
        ) : null}
      </article>
    </main>
  );
}
