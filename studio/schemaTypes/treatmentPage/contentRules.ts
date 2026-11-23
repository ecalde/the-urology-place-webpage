import {existingStaticPathError} from './paths'

export type ImageWithAlt =
  | {
      asset?: {_ref?: string}
      alt?: string
    }
  | null
  | undefined

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/

export function siteLinkError(value: unknown): true | string {
  const invalid = 'Use a page on this site (starts with /) or a secure link (starts with https://).'
  if (typeof value !== 'string' || value.trim() === '') return invalid
  const href = value.trim()
  if (href.startsWith('/') && !href.startsWith('//')) {
    if (/[\s\\]/.test(href)) return 'Links cannot contain spaces.'
    return true
  }
  if (href.startsWith('https://')) {
    try {
      const url = new URL(href)
      if (url.protocol !== 'https:') return invalid
      return true
    } catch {
      return 'Enter a valid https:// link.'
    }
  }
  return invalid
}

export function youtubeIdError(value: unknown): true | string {
  if (typeof value === 'string' && YOUTUBE_ID_PATTERN.test(value)) return true
  return 'Enter the 11-character YouTube video id. Do not paste the full web address or upload a video file.'
}

export function imageAltError(value: unknown, required: boolean): true | string {
  if (!value || typeof value !== 'object') return required ? 'Add an image.' : true
  const image = value as {asset?: {_ref?: string}; alt?: string}
  const hasAsset = Boolean(image.asset?._ref)
  if (!hasAsset) return required ? 'Add an image.' : true
  if (typeof image.alt === 'string' && image.alt.trim()) return true
  return 'Describe this image for people using screen readers.'
}

export function comparisonTableError(value: unknown): true | string {
  if (!value || typeof value !== 'object') return 'Add at least two columns and one row.'
  const table = value as {
    columns?: unknown[]
    rows?: {cells?: unknown[]}[]
  }
  const columnCount = table.columns?.length ?? 0
  if (columnCount < 2) return 'Add at least two columns.'
  const rows = table.rows ?? []
  if (rows.length < 1) return 'Add at least one row.'
  const mismatch = rows.findIndex((row) => (row?.cells?.length ?? 0) !== columnCount)
  if (mismatch >= 0) {
    return `Row ${mismatch + 1} needs ${columnCount} cells, one for each column.`
  }
  return true
}

export function relatedTreatmentError(value: unknown): true | string {
  if (!value || typeof value !== 'object') {
    return 'Choose a treatment page or an existing page address.'
  }
  const related = value as {
    linkKind?: string
    treatment?: {_ref?: string}
    manualPath?: unknown
  }
  if (related.linkKind === 'treatment') {
    if (related.treatment?._ref) return true
    return 'Choose a treatment page.'
  }
  if (related.linkKind === 'path') return existingStaticPathError(related.manualPath)
  return 'Choose a treatment page or an existing page address.'
}

export function twoColumnBandError(value: unknown): true | string {
  if (!value || typeof value !== 'object') return 'Choose an image or a team member.'
  const band = value as {
    media?: string
    image?: ImageWithAlt
    teamMember?: {_ref?: string}
  }
  if (band.media === 'image') return imageAltError(band.image, true)
  if (band.media === 'teamMember') {
    if (band.teamMember?._ref) return true
    return 'Choose a team member.'
  }
  return 'Choose an image or a team member.'
}

export function appointmentReasonError(value: unknown, allowed: readonly string[]): true | string {
  if (value === undefined || value === null || value === '') return true
  if (typeof value === 'string' && allowed.includes(value)) return true
  return 'Choose a reason from the list. A custom reason needs a code change before it can be used.'
}
