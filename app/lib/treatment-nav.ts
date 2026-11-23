import { TREATMENT_NAV_TAG, TREATMENT_REVALIDATE_SECONDS } from "@/app/lib/treatment-cache";
import {
  isTreatmentSection,
  normalizeTreatmentParent,
  treatmentPublicPath,
} from "@/app/lib/treatment-pages";
import type { TreatmentSection } from "@/studio/schemaTypes/treatmentPage/constants";

/**
 * Published public treatment links for the navbar, section cards, and sitemap.
 * Body, hero, and portable text stay out of this query.
 */
export const TREATMENT_NAV_QUERY = `*[
  _type == "treatmentPage" &&
  visibility == "public" &&
  !(_id in path("drafts.**"))
]{
  _id,
  title,
  "menuLabel": coalesce(menuLabel, title),
  "cardDescription": coalesce(cardDescription, ""),
  section,
  parentPath,
  "slug": slug.current,
  sortOrder,
  visibility
}`;

export type TreatmentNavLink = {
  menuLabel: string;
  title: string;
  cardDescription: string;
  section: TreatmentSection;
  parentPath: string;
  slug: string;
  sortOrder: number;
  href: string;
};

export type TreatmentNavTreeNode = {
  label: string;
  href?: string;
  badgeLabel?: string;
  children?: TreatmentNavTreeNode[];
};

export type TreatmentServiceCard = {
  title: string;
  href: string;
  description: string;
};

const CARD_DESCRIPTION_MAX = 200;

export function treatmentNavFetchOptions() {
  return {
    useCdn: false as const,
    next: {
      revalidate: TREATMENT_REVALIDATE_SECONDS,
      tags: [TREATMENT_NAV_TAG],
    },
  };
}

export function publishedTreatmentNavFetchArgs() {
  return [TREATMENT_NAV_QUERY, {}, treatmentNavFetchOptions()] as const;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function sortOrderValue(value: unknown): number {
  return typeof value === "number" && Number.isInteger(value) ? value : 0;
}

export function compareTreatmentNavLinks(
  a: TreatmentNavLink,
  b: TreatmentNavLink,
): number {
  if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
  const byLabel = a.menuLabel.localeCompare(b.menuLabel, "en");
  if (byLabel !== 0) return byLabel;
  return a.href.localeCompare(b.href, "en");
}

/**
 * Keep public rows with a valid Men or Women path. Drafts, unlisted pages,
 * and unpublished rows are omitted. Lower sortOrder comes first.
 */
export function readTreatmentNavItems(rows: unknown): TreatmentNavLink[] {
  if (!Array.isArray(rows)) return [];
  const candidates: TreatmentNavLink[] = [];
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const record = row as Record<string, unknown>;
    if (typeof record._id === "string" && record._id.startsWith("drafts.")) continue;
    if (record.visibility !== "public") continue;
    if (!isTreatmentSection(record.section)) continue;
    const title = text(record.title);
    const menuLabel = text(record.menuLabel) || title;
    if (!menuLabel) continue;
    const parentPath = normalizeTreatmentParent(record.parentPath);
    const slug = text(record.slug);
    const href = treatmentPublicPath({
      section: record.section,
      parentPath,
      slug,
    });
    if (!href) continue;
    candidates.push({
      menuLabel,
      title: title || menuLabel,
      cardDescription: text(record.cardDescription).slice(0, CARD_DESCRIPTION_MAX),
      section: record.section,
      parentPath,
      slug,
      sortOrder: sortOrderValue(record.sortOrder),
      href,
    });
  }
  candidates.sort(compareTreatmentNavLinks);
  const seen = new Set<string>();
  const links: TreatmentNavLink[] = [];
  for (const item of candidates) {
    if (seen.has(item.href)) continue;
    seen.add(item.href);
    links.push(item);
  }
  return links;
}

function cloneTree<T extends TreatmentNavTreeNode>(nodes: readonly T[]): T[] {
  return nodes.map((node) => ({
    ...node,
    ...(node.children ? { children: cloneTree(node.children) } : {}),
  }));
}

function collectHrefs(nodes: readonly TreatmentNavTreeNode[], hrefs: Set<string>) {
  for (const node of nodes) {
    if (node.href) hrefs.add(node.href);
    if (node.children) collectHrefs(node.children, hrefs);
  }
}

function findNode(
  nodes: readonly TreatmentNavTreeNode[] | undefined,
  href: string,
): TreatmentNavTreeNode | undefined {
  if (!nodes) return undefined;
  for (const node of nodes) {
    if (node.href === href) return node;
    const nested = findNode(node.children, href);
    if (nested) return nested;
  }
  return undefined;
}

/**
 * Append public CMS links to a copy of the hardcoded tree.
 * Existing labels, order, and addresses are left as they are.
 * A parented page is inserted under its hub. A top-level page is appended
 * to Men or Women. A hub that is not in the tree is skipped.
 */
export function mergeTreatmentNav<T extends TreatmentNavTreeNode>(
  staticTree: readonly T[],
  cmsItems: readonly TreatmentNavLink[],
): T[] {
  const tree = cloneTree(staticTree);
  const hrefs = new Set<string>();
  collectHrefs(tree, hrefs);
  for (const item of cmsItems) {
    if (!item.href.startsWith(`/${item.section}/`) || hrefs.has(item.href)) continue;
    const section = tree.find((node) => node.href === `/${item.section}`);
    if (!section) continue;
    const parent = item.parentPath
      ? findNode(section.children, `/${item.section}/${item.parentPath}`)
      : section;
    if (!parent) continue;
    parent.children = [
      ...(parent.children ?? []),
      { label: item.menuLabel, href: item.href },
    ];
    hrefs.add(item.href);
  }
  return tree;
}

/**
 * Top-level public pages for the Men or Women service grid.
 * Parented pages stay in the navbar under their hub.
 */
export function treatmentServiceCards(
  section: TreatmentSection,
  items: readonly TreatmentNavLink[],
  existingHrefs: ReadonlySet<string> = new Set(),
): TreatmentServiceCard[] {
  return items
    .filter(
      (item) =>
        item.section === section &&
        item.parentPath === "" &&
        !existingHrefs.has(item.href),
    )
    .map((item) => ({
      title: item.title,
      href: item.href,
      description: item.cardDescription,
    }));
}

/** Public CMS paths that are not already listed as static or excluded pages. */
export function treatmentSitemapPaths(
  items: readonly TreatmentNavLink[],
  excludedPaths: ReadonlySet<string>,
): string[] {
  const paths: string[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    if (excludedPaths.has(item.href) || seen.has(item.href)) continue;
    seen.add(item.href);
    paths.push(item.href);
  }
  return paths;
}
