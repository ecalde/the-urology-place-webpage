import {
  formatTreatmentPath,
  isTreatmentSection,
  parentPathError,
  slugFormatError,
} from '../schemaTypes/treatmentPage/paths'

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

function slugCurrent(slug: unknown): string | undefined {
  if (typeof slug === 'string') return slug
  if (isRecord(slug) && typeof slug.current === 'string') return slug.current
  return undefined
}

function pathList(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

/**
 * Full public path for a Studio document. Slug may be a string or a slug object.
 * An unfinished or invalid address returns null so it is not stored.
 */
export function treatmentDocumentPath(document: unknown): string | null {
  if (!isRecord(document)) return null
  const section = document.section
  const slug = slugCurrent(document.slug)
  if (!isTreatmentSection(section) || !slug) return null
  if (slugFormatError(slug) !== true) return null
  if (parentPathError(section, document.parentPath) !== true) return null
  return formatTreatmentPath(section, document.parentPath, slug)
}

function isStoredPreviousPath(path: string): boolean {
  const parts = path.split('/').filter(Boolean)
  if (parts.length < 2 || parts.length > 4) return false
  const section = parts[0]
  const slug = parts[parts.length - 1]
  const parent = parts.slice(1, -1).join('/')
  if (!slug) return false
  return treatmentDocumentPath({section, parentPath: parent, slug}) === path
}

function samePaths(left: string[], right: string[]): boolean {
  return left.length === right.length && left.every((item, index) => item === right[index])
}

/**
 * Previous addresses to store when a publish changes the section, parent, or slug.
 * Returns null when the address is unchanged, so the publish action does not patch.
 * Editors do not type this field.
 */
export function previousPathsForPublish(draft: unknown, published: unknown): string[] | null {
  const oldPath = treatmentDocumentPath(published)
  const newPath = treatmentDocumentPath(draft)
  if (!oldPath || !newPath || oldPath === newPath) return null
  if (!isRecord(draft) || !isRecord(published)) return null

  const merged: string[] = []
  const candidates = [
    ...pathList(published.previousPaths),
    ...pathList(draft.previousPaths),
    oldPath,
  ]
  for (const path of candidates) {
    if (path === newPath || !isStoredPreviousPath(path) || merged.includes(path)) continue
    merged.push(path)
  }
  const current = pathList(draft.previousPaths).filter(isStoredPreviousPath)
  if (samePaths(current, merged)) return null
  return merged
}

/**
 * Replace only the treatment publish action. Other document types and the
 * other treatment actions stay on Sanity's defaults.
 */
export function withTreatmentPublishAction<Action extends {action?: string}>(
  previous: Action[],
  schemaType: string,
  publish: (action: Action) => Action,
): Action[] {
  if (schemaType !== 'treatmentPage') return previous
  return previous.map((action) => (action.action === 'publish' ? publish(action) : action))
}
