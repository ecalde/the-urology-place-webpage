import {
  PortableText,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
} from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Link from "next/link";
import type { ReactNode } from "react";

import { safeTreatmentHref } from "@/app/lib/treatment-links";
import {
  TREATMENT_H2,
  TREATMENT_RICH_TEXT_LINK,
} from "@/app/components/treatment-page/treatment-styles";

function TreatmentLink({
  value,
  children,
}: PortableTextMarkComponentProps<{ _type: "link"; href?: string }>) {
  const href = safeTreatmentHref(value?.href);
  if (!href) return <>{children}</>;
  if (href.startsWith("https://")) {
    return (
      <a
        href={href}
        className={TREATMENT_RICH_TEXT_LINK}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={TREATMENT_RICH_TEXT_LINK}>
      {children}
    </Link>
  );
}

const marks: PortableTextComponents["marks"] = {
  strong: ({ children }) => (
    <strong className="font-semibold text-slate-900">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  link: TreatmentLink,
};

const lists: PortableTextComponents["list"] = {
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
};

const listItem: PortableTextComponents["listItem"] = {
  bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
  number: ({ children }) => <li className="leading-relaxed">{children}</li>,
};

function bodyParagraph({ children }: { children?: ReactNode }) {
  return (
    <p className="mb-4 text-base leading-relaxed text-slate-700 last:mb-0 md:text-lg">
      {children}
    </p>
  );
}

function faqParagraph({ children }: { children?: ReactNode }) {
  return <p className="mb-3 leading-relaxed last:mb-0">{children}</p>;
}

const bodyComponents: PortableTextComponents = {
  block: {
    normal: bodyParagraph,
    h1: ({ children }) => (
      <h2 className={`mt-10 first:mt-0 ${TREATMENT_H2}`}>{children}</h2>
    ),
    h2: ({ children }) => (
      <h2 className={`mt-10 first:mt-0 ${TREATMENT_H2}`}>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-xl font-bold tracking-tight text-slate-900 first:mt-0">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 text-lg font-semibold text-slate-900 first:mt-0">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="mt-6 text-base font-semibold text-slate-900 first:mt-0">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-900 first:mt-0">
        {children}
      </h6>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-blue-600 pl-4 text-slate-700 italic">
        {children}
      </blockquote>
    ),
  },
  list: lists,
  listItem,
  marks,
};

const faqComponents: PortableTextComponents = {
  block: {
    normal: faqParagraph,
    h1: faqParagraph,
    h2: faqParagraph,
    h3: faqParagraph,
    h4: faqParagraph,
    h5: faqParagraph,
    h6: faqParagraph,
    blockquote: faqParagraph,
  },
  list: lists,
  listItem,
  marks,
};

function portableTextBlocks(value: PortableTextBlock[] | null | undefined) {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (block): block is PortableTextBlock =>
      Boolean(block) &&
      typeof block === "object" &&
      (block as { _type?: string })._type === "block",
  );
}

export function TreatmentPortableText({
  value,
  variant,
}: {
  value: PortableTextBlock[] | null | undefined;
  variant: "body" | "faq";
}) {
  const blocks = portableTextBlocks(value);
  if (blocks.length === 0) return null;
  return (
    <PortableText
      value={blocks}
      components={variant === "faq" ? faqComponents : bodyComponents}
    />
  );
}
