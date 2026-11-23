/**
 * Shared lists for the treatment page schema.
 * Parent paths are existing hub folders. A treatment page cannot be a parent.
 */

export const TREATMENT_SCHEMA_API_VERSION = '2025-03-25'

export const TREATMENT_SLUG_MAX_LENGTH = 80

/** Leaf slug: lowercase letters, numbers, and single hyphens. */
export const TREATMENT_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const TREATMENT_SECTIONS = [
  {title: 'Men', value: 'men'},
  {title: 'Women', value: 'women'},
] as const

export type TreatmentSection = (typeof TREATMENT_SECTIONS)[number]['value']

export const TREATMENT_PARENTS = [
  {section: 'men', value: 'prostate-cancer', title: 'Men: Prostate cancer'},
  {
    section: 'men',
    value: 'prostate-cancer/radiation-treatments',
    title: 'Men: Prostate cancer / Radiation treatments',
  },
  {section: 'men', value: 'enlarged-prostate', title: 'Men: Enlarged prostate'},
  {section: 'men', value: 'bladder-cancer', title: 'Men: Bladder cancer'},
  {
    section: 'men',
    value: 'male-sexual-dysfunction',
    title: 'Men: Male sexual dysfunction',
  },
  {
    section: 'women',
    value: 'hormone-replacement-therapy',
    title: 'Women: Hormone replacement therapy',
  },
] as const

export type TreatmentParentPath = (typeof TREATMENT_PARENTS)[number]['value']

export const TREATMENT_VISIBILITY = [
  {title: 'Unlisted', value: 'unlisted'},
  {title: 'Public', value: 'public'},
] as const
