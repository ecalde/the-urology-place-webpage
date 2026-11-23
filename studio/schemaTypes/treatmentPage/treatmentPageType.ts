import {DocumentIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {APPOINTMENT_REASON_OPTIONS} from '../../../app/lib/contact-form-defaults'
import {treatmentBlockTypes} from './blocks'
import {
  TREATMENT_PARENTS,
  TREATMENT_SCHEMA_API_VERSION,
  TREATMENT_SECTIONS,
  TREATMENT_SLUG_MAX_LENGTH,
  TREATMENT_VISIBILITY,
} from './constants'
import {appointmentReasonError} from './contentRules'
import {
  formatTreatmentPath,
  isTreatmentSection,
  parentPathError,
  readTreatmentPathDocument,
  slugFormatError,
  staticPathCombinationError,
  uniqueTreatmentPathError,
  type TreatmentPathClient,
} from './paths'

const appointmentReasonOptions = APPOINTMENT_REASON_OPTIONS.map((reason) => ({
  title: reason,
  value: reason,
}))

/**
 * New Men and Women treatment pages edited in Studio.
 * Public routes for these documents come in a later phase.
 * This does not replace hardcoded treatment pages.
 */
export const treatmentPageType = defineType({
  name: 'treatmentPage',
  title: 'Treatment page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'content', title: 'Page', default: true},
    {name: 'seo', title: 'SEO'},
    {name: 'form', title: 'Contact form'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      description: 'Page heading. The contact form uses this as the page name.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      description:
        'The last part of the web address. Use lowercase letters, numbers, and hyphens. Generate it from the title, then change it if this address is already a page.',
      options: {
        source: 'title',
        maxLength: TREATMENT_SLUG_MAX_LENGTH,
        // The same leaf slug may exist under Men and Women, or under different hubs.
        // Uniqueness for one section and parent is checked below, not by Sanity's default slug rule.
        isUnique: async () => true,
      },
      validation: (Rule) =>
        Rule.required().custom(async (slug, context) => {
          const current =
            slug && typeof slug === 'object' && typeof slug.current === 'string' ? slug.current : ''
          if (!current) return true
          const format = slugFormatError(current)
          if (format !== true) return format
          const doc = readTreatmentPathDocument(context.document)
          const parent = parentPathError(doc.section, doc.parentPath)
          if (parent !== true) return parent
          const collision = staticPathCombinationError(context.document)
          if (collision !== true) return collision
          const client = context.getClient({
            apiVersion: TREATMENT_SCHEMA_API_VERSION,
          }) as TreatmentPathClient
          return uniqueTreatmentPathError(client, context.document)
        }),
    }),
    defineField({
      name: 'section',
      title: 'Website section',
      type: 'string',
      group: 'content',
      description:
        'Men or Women. This chooses where the page lives. It is not the appointment reason.',
      options: {
        list: TREATMENT_SECTIONS.map((section) => ({...section})),
        layout: 'radio',
      },
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!isTreatmentSection(value)) return 'Choose Men or Women.'
          return staticPathCombinationError({...context.document, section: value})
        }),
    }),
    defineField({
      name: 'parentPath',
      title: 'Parent page',
      type: 'string',
      group: 'content',
      description:
        'Optional. Place this page under an existing hub. Leave it empty for a top-level Men or Women page. Men hubs only work for Men, and the Women hub only works for Women. A treatment page cannot be the parent of another treatment page.',
      options: {
        list: TREATMENT_PARENTS.map((parent) => ({title: parent.title, value: parent.value})),
        layout: 'dropdown',
      },
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = parentPathError(context.document?.section, value)
          if (parent !== true) return parent
          return staticPathCombinationError({...context.document, parentPath: value})
        }),
    }),
    defineField({
      name: 'menuLabel',
      title: 'Menu label',
      type: 'string',
      group: 'content',
      description: 'Label in the menu. Leave this blank to use the page title.',
    }),
    defineField({
      name: 'cardDescription',
      title: 'Card description',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Short text on the Men or Women service card. 200 characters or fewer.',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      group: 'content',
      description:
        'Order among new treatment links only. Existing menu links stay in their current order. Lower numbers come first.',
      initialValue: 0,
      validation: (Rule) =>
        Rule.custom((value) => {
          if (value === undefined || value === null) return true
          if (typeof value === 'number' && Number.isInteger(value)) return true
          return 'Use a whole number.'
        }),
    }),
    defineField({
      name: 'visibility',
      title: 'Visibility',
      type: 'string',
      group: 'content',
      description:
        'Unlisted pages can be opened by their address but stay out of the menu, the Men and Women cards, and the sitemap. A new page stays unlisted until you choose Public.',
      options: {
        list: TREATMENT_VISIBILITY.map((option) => ({...option})),
        layout: 'radio',
      },
      initialValue: 'unlisted',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (value === 'public' || value === 'unlisted') return true
          return 'Choose Public or Unlisted.'
        }),
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'content',
      description: 'The large image and heading at the top of the page.',
      fields: [
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {hotspot: true},
          description: 'Background image for the top of the page.',
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
              description: 'Describe the hero image for people using screen readers.',
              validation: (Rule) =>
                Rule.required().error('Describe this image for people using screen readers.'),
            }),
          ],
          validation: (Rule) => Rule.required().error('Add a hero image.'),
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          description: 'Large heading on the hero image.',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'text',
          rows: 2,
          description: 'Short line under the hero title. Optional.',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Page sections',
      type: 'array',
      group: 'content',
      description:
        'Add sections in the order they should appear: text, images, YouTube videos, questions, tables, buttons, related pages, and two-column bands.',
      of: treatmentBlockTypes.map((block) => defineArrayMember({type: block.name})),
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      group: 'seo',
      description: 'Optional. Replaces the page title in the browser tab and in search results.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      group: 'seo',
      rows: 3,
      description: 'Optional. Short summary for search results and link previews.',
    }),
    defineField({
      name: 'shareImage',
      title: 'Share image',
      type: 'image',
      group: 'seo',
      description:
        'Optional image used when this page is shared. The site image is used when this is empty.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Describe the image for people using screen readers.',
        }),
      ],
    }),
    defineField({
      name: 'showContactForm',
      title: 'Show contact form',
      type: 'boolean',
      group: 'form',
      description: 'Turn it off only when this page should not embed the patient form.',
      initialValue: true,
    }),
    defineField({
      name: 'defaultAppointmentReason',
      title: 'Default appointment reason',
      type: 'string',
      group: 'form',
      description:
        'The website section and the appointment reason are different. This list is the same one patients see on the contact form. For an erectile dysfunction page, choose Erectile Dysfunction Treatment. Leave this empty to let the page title choose the reason.',
      options: {
        list: appointmentReasonOptions,
        layout: 'dropdown',
      },
      validation: (Rule) =>
        Rule.custom((value) => appointmentReasonError(value, APPOINTMENT_REASON_OPTIONS)),
    }),
    defineField({
      name: 'previousPaths',
      title: 'Previous addresses',
      type: 'array',
      description:
        'Saved automatically when the section, parent, or slug changes. Editors do not type these.',
      of: [defineArrayMember({type: 'string'})],
      readOnly: true,
      hidden: true,
    }),
  ],
  orderings: [
    {
      title: 'Section, then title',
      name: 'sectionTitle',
      by: [
        {field: 'section', direction: 'asc'},
        {field: 'title', direction: 'asc'},
      ],
    },
    {
      title: 'Sort order',
      name: 'sortOrderAsc',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      section: 'section',
      parentPath: 'parentPath',
      slug: 'slug.current',
      visibility: 'visibility',
      media: 'hero.image',
    },
    prepare({title, section, parentPath, slug, visibility, media}) {
      const path =
        isTreatmentSection(section) && typeof slug === 'string' && slug
          ? formatTreatmentPath(section, parentPath, slug)
          : 'Address not set'
      const listed = visibility === 'public' ? 'Public' : 'Unlisted'
      return {
        title: title || 'Untitled treatment',
        subtitle: `${listed} · ${path}`,
        media,
      }
    },
  },
})

export default treatmentPageType
