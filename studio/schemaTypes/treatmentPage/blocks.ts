import {
  BlockContentIcon,
  HelpCircleIcon,
  ImageIcon,
  InlineIcon,
  LinkIcon,
  PlayIcon,
  ThListIcon,
  TransferIcon,
} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {
  comparisonTableError,
  imageAltError,
  relatedTreatmentError,
  siteLinkError,
  twoColumnBandError,
  youtubeIdError,
} from './contentRules'
import {treatmentBasicPortableTextBlock, treatmentTextField} from './portableText'

function imageAltField(required: boolean) {
  return defineField({
    name: 'alt',
    title: 'Alternative text',
    type: 'string',
    description: 'Describe the image for people using screen readers.',
    validation: required
      ? (Rule) => Rule.required().error('Describe this image for people using screen readers.')
      : undefined,
  })
}

export const treatmentRichTextType = defineType({
  name: 'treatmentRichText',
  title: 'Rich text',
  type: 'object',
  icon: BlockContentIcon,
  fields: [
    treatmentTextField(
      'content',
      'Text',
      'Headings, paragraphs, lists, bold text, and links. Links must be a page on this site or an https address.',
    ),
  ],
  preview: {
    select: {content: 'content'},
    prepare({content}: {content?: {children?: {text?: string}[]}[]}) {
      const first = content?.find((block) => block?.children?.some((child) => child?.text))
      const text = first?.children?.map((child) => child?.text ?? '').join('')
      return {
        title: text?.trim() || 'Rich text',
        subtitle: 'Rich text',
      }
    },
  },
})

export const treatmentImageType = defineType({
  name: 'treatmentImage',
  title: 'Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [imageAltField(true)],
      validation: (Rule) => Rule.required().custom((value) => imageAltError(value, true)),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional line shown under the image.',
    }),
  ],
  preview: {
    select: {caption: 'caption', alt: 'image.alt', media: 'image'},
    prepare({caption, alt, media}) {
      return {
        title: caption || alt || 'Image',
        subtitle: 'Image',
        media,
      }
    },
  },
})

export const treatmentYouTubeType = defineType({
  name: 'treatmentYouTube',
  title: 'YouTube video',
  type: 'object',
  icon: PlayIcon,
  description: 'Stores a YouTube video id. Do not upload a video file.',
  fields: [
    defineField({
      name: 'videoId',
      title: 'YouTube video id',
      type: 'string',
      description:
        'The short id from the watch link, such as dQw4w9WgXcQ. Paste the id only, not the full address and not a video file.',
      validation: (Rule) => Rule.required().custom((value) => youtubeIdError(value)),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Name of the video, used as the player title.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional line shown under the video.',
    }),
  ],
  preview: {
    select: {title: 'title', videoId: 'videoId'},
    prepare({title, videoId}: {title?: string; videoId?: string}) {
      return {
        title: title || 'YouTube video',
        subtitle: videoId ? `YouTube · ${videoId}` : 'YouTube video',
      }
    },
  },
})

export const treatmentFaqType = defineType({
  name: 'treatmentFaq',
  title: 'Questions and answers',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      description: 'Each question opens to show its answer.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'treatmentFaqItem',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'array',
              description:
                'Paragraphs, bold text, lists, and links. A link must be a page on this site or an https address.',
              of: [treatmentBasicPortableTextBlock()],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {title: 'question', answer: 'answer'},
            prepare({
              title,
              answer,
            }: {
              title?: string
              answer?: {children?: {text?: string}[]}[]
            }) {
              const first = answer?.find((block) => block?.children?.some((child) => child?.text))
              const text = first?.children?.map((child) => child?.text ?? '').join('')
              return {
                title: title || 'Question',
                subtitle: text?.trim() || 'Answer',
              }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {question: 'items.0.question'},
    prepare({question}: {question?: string}) {
      return {
        title: question || 'Questions and answers',
        subtitle: 'Questions and answers',
      }
    },
  },
})

export const treatmentComparisonTableType = defineType({
  name: 'treatmentComparisonTable',
  title: 'Comparison table',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Describe what this table compares.',
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      description:
        'Add one heading per column. The first heading can be blank when that column is only a row label.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'treatmentComparisonColumn',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              description: 'Leave this blank for a row-label column.',
            }),
          ],
          preview: {
            select: {title: 'heading'},
            prepare({title}: {title?: string}) {
              return {title: title?.trim() ? title : 'Blank heading'}
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      description: 'Each row needs one cell for every column, in the same order.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'treatmentComparisonRow',
          fields: [
            defineField({
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'treatmentComparisonCell',
                  fields: [
                    defineField({
                      name: 'text',
                      title: 'Text',
                      type: 'text',
                      rows: 2,
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                  preview: {
                    select: {title: 'text'},
                  },
                }),
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {cells: 'cells'},
            prepare({cells}: {cells?: {text?: string}[]}) {
              const label = cells?.map((cell) => cell?.text ?? '').find((text) => text.trim())
              return {title: label || 'Row'}
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  validation: (Rule) => Rule.custom((value) => comparisonTableError(value)),
  preview: {
    select: {caption: 'caption'},
    prepare({caption}: {caption?: string}) {
      return {
        title: caption || 'Comparison table',
        subtitle: 'Comparison table',
      }
    },
  },
})

export const treatmentCallToActionType = defineType({
  name: 'treatmentCallToAction',
  title: 'Button or call to action',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'The words on the button.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'A page on this site, starting with /, or a secure link starting with https://.',
      validation: (Rule) => Rule.required().custom((value) => siteLinkError(value)),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'href'},
    prepare({title, subtitle}: {title?: string; subtitle?: string}) {
      return {
        title: title || 'Button',
        subtitle: subtitle || 'Button or call to action',
      }
    },
  },
})

export const treatmentRelatedType = defineType({
  name: 'treatmentRelated',
  title: 'Related treatment',
  type: 'object',
  icon: TransferIcon,
  fields: [
    defineField({
      name: 'linkKind',
      title: 'Link to',
      type: 'string',
      description: 'Choose another treatment page, or a page that is already on the website.',
      options: {
        list: [
          {title: 'Treatment page', value: 'treatment'},
          {title: 'Existing website page', value: 'path'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'treatment',
      title: 'Treatment page',
      type: 'reference',
      to: [{type: 'treatmentPage'}],
      description: 'Another treatment page written in Studio.',
      hidden: ({parent}) => parent?.linkKind !== 'treatment',
      options: {
        filter: ({document}) => {
          const id = (document?._id ?? '').replace(/^drafts\./, '')
          if (!id) return {filter: '_type == "treatmentPage"'}
          return {
            filter: '!(_id in [$publishedId, $draftId])',
            params: {publishedId: id, draftId: `drafts.${id}`},
          }
        },
      },
    }),
    defineField({
      name: 'manualPath',
      title: 'Existing page address',
      type: 'string',
      description:
        'A page that is already on the website, such as /women/emsella-for-incontinence.',
      hidden: ({parent}) => parent?.linkKind !== 'path',
    }),
  ],
  validation: (Rule) => Rule.custom((value) => relatedTreatmentError(value)),
  preview: {
    select: {
      kind: 'linkKind',
      treatment: 'treatment.title',
      path: 'manualPath',
    },
    prepare({kind, treatment, path}: {kind?: string; treatment?: string; path?: string}) {
      return {
        title: treatment || path || 'Related treatment',
        subtitle: kind === 'path' ? 'Existing website page' : 'Related treatment',
      }
    },
  },
})

export const treatmentTwoColumnType = defineType({
  name: 'treatmentTwoColumn',
  title: 'Two-column band',
  type: 'object',
  icon: InlineIcon,
  description: 'Text beside an image or a team member.',
  fields: [
    treatmentTextField(
      'text',
      'Text',
      'The words shown beside the image or team member. You can include a heading.',
    ),
    defineField({
      name: 'media',
      title: 'Show beside the text',
      type: 'string',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Team member', value: 'teamMember'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [imageAltField(false)],
      hidden: ({parent}) => parent?.media !== 'image',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {media?: string} | undefined
          if (parent?.media !== 'image') return true
          return imageAltError(value, true)
        }),
    }),
    defineField({
      name: 'teamMember',
      title: 'Team member',
      type: 'reference',
      to: [{type: 'teamMember'}],
      description: 'Someone already listed under Team member.',
      hidden: ({parent}) => parent?.media !== 'teamMember',
    }),
  ],
  validation: (Rule) => Rule.custom((value) => twoColumnBandError(value)),
  preview: {
    select: {mediaType: 'media', image: 'image', team: 'teamMember.name'},
    prepare({mediaType, image, team}) {
      const detail = mediaType === 'teamMember' ? team || 'Team member' : 'Image'
      return {
        title: 'Two-column band',
        subtitle: detail,
        media: mediaType === 'image' ? image : undefined,
      }
    },
  },
})

export const treatmentBlockTypes = [
  treatmentRichTextType,
  treatmentImageType,
  treatmentYouTubeType,
  treatmentFaqType,
  treatmentComparisonTableType,
  treatmentCallToActionType,
  treatmentRelatedType,
  treatmentTwoColumnType,
]
