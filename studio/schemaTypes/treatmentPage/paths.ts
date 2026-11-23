import {routeInventory} from '../../routeInventory.generated'

import {
  TREATMENT_PARENTS,
  TREATMENT_SLUG_MAX_LENGTH,
  TREATMENT_SLUG_PATTERN,
  type TreatmentSection,
} from './constants'

export type TreatmentPathDocument = {
  _id?: string
  section?: string
  parentPath?: string
  slug?: {current?: string}
}

export type TreatmentPathClient = {
  fetch: (query: string, params?: Record<string, unknown>) => Promise<unknown>
}

const staticRoutePaths = new Set(
  routeInventory.filter((entry) => entry.kind === 'static').map((entry) => entry.path),
)

export function normalizeParentPath(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim().replace(/^\/+|\/+$/g, '')
}

export function slugFormatError(slug: string): true | string {
  if (slug.length > TREATMENT_SLUG_MAX_LENGTH) {
    return `Use ${TREATMENT_SLUG_MAX_LENGTH} characters or fewer.`
  }
  if (!TREATMENT_SLUG_PATTERN.test(slug)) {
    return 'Use lowercase letters, numbers, and hyphens only. Do not start or end with a hyphen.'
  }
  return true
}

export function isTreatmentSection(value: unknown): value is TreatmentSection {
  return value === 'men' || value === 'women'
}

export function parentPathError(section: unknown, parentPath: unknown): true | string {
  const parent = normalizeParentPath(parentPath)
  if (!parent) return true
  if (!isTreatmentSection(section)) {
    return 'Choose Men or Women before choosing a parent page.'
  }
  const allowed = TREATMENT_PARENTS.some(
    (option) => option.section === section && option.value === parent,
  )
  if (allowed) return true
  return section === 'men'
    ? 'Choose a Men hub, or clear the parent for a top-level page.'
    : 'Choose a Women hub, or clear the parent for a top-level page.'
}

export function formatTreatmentPath(section: string, parentPath: unknown, slug: string): string {
  const parent = normalizeParentPath(parentPath)
  const parts = [section]
  if (parent) parts.push(parent)
  parts.push(slug)
  return `/${parts.join('/')}`
}

/**
 * Dynamic inventory rows such as /patient-resources/blog/[slug] are ignored.
 * Only a path listed as a static page blocks publishing.
 */
export function staticTreatmentPathError(path: string): true | string {
  if (!staticRoutePaths.has(path)) return true
  return `This address is already a page on the website (${path}). Choose a different slug. Publishing it would not replace that page.`
}

export function readTreatmentPathDocument(document: unknown): TreatmentPathDocument {
  if (!document || typeof document !== 'object') return {}
  const doc = document as Record<string, unknown>
  const slug = doc.slug
  const current =
    slug && typeof slug === 'object' && typeof (slug as {current?: unknown}).current === 'string'
      ? (slug as {current: string}).current
      : undefined
  return {
    _id: typeof doc._id === 'string' ? doc._id : undefined,
    section: typeof doc.section === 'string' ? doc.section : undefined,
    parentPath: typeof doc.parentPath === 'string' ? doc.parentPath : undefined,
    slug: current === undefined ? undefined : {current},
  }
}

/**
 * Collision check for a complete section, parent, and slug.
 * An unfinished slug or a parent that does not match the section is left to those fields.
 */
export function staticPathCombinationError(document: unknown): true | string {
  const doc = readTreatmentPathDocument(document)
  if (!isTreatmentSection(doc.section)) return true
  const slug = doc.slug?.current
  if (!slug || slugFormatError(slug) !== true) return true
  if (parentPathError(doc.section, doc.parentPath) !== true) return true
  return staticTreatmentPathError(formatTreatmentPath(doc.section, doc.parentPath, slug))
}

export const UNIQUE_TREATMENT_PATH_QUERY = `count(*[
  _type == "treatmentPage" &&
  section == $section &&
  coalesce(parentPath, "") == $parentPath &&
  slug.current == $slug &&
  !(_id in [$publishedId, $draftId])
])`

export async function uniqueTreatmentPathError(
  client: TreatmentPathClient,
  document: unknown,
): Promise<true | string> {
  const doc = readTreatmentPathDocument(document)
  const slug = doc.slug?.current
  if (!isTreatmentSection(doc.section) || !slug) return true

  const publishedId = (doc._id ?? '').replace(/^drafts\./, '') || 'new-treatment-page'
  let count: unknown
  try {
    count = await client.fetch(UNIQUE_TREATMENT_PATH_QUERY, {
      section: doc.section,
      parentPath: normalizeParentPath(doc.parentPath),
      slug,
      publishedId,
      draftId: `drafts.${publishedId}`,
    })
  } catch {
    return 'Could not check whether this address is already used. Try publishing again.'
  }

  if (typeof count !== 'number') {
    return 'Could not check whether this address is already used. Try publishing again.'
  }
  if (count > 0) {
    return 'A treatment page with this section, parent, and slug already exists. Change the slug or the parent.'
  }
  return true
}

export function existingStaticPathError(value: unknown): true | string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return 'Enter a page address that already exists on the website, starting with /.'
  }
  const entry = routeInventory.find((item) => item.path === value)
  if (!entry || entry.kind !== 'static') {
    return 'Choose a page that is already on the website. Link to a new treatment from the treatment list instead.'
  }
  return true
}
