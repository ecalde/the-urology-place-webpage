import {defineArrayMember, defineField} from 'sanity'

import {siteLinkError} from './contentRules'

/**
 * Link annotation shared by body text and FAQ answers.
 * A link is a site path or an https address.
 */
function linkAnnotation() {
  return {
    name: 'link',
    type: 'object' as const,
    title: 'Link',
    fields: [
      defineField({
        name: 'href',
        title: 'Link address',
        type: 'string',
        description:
          'A page on this site, starting with /, or a secure link starting with https://.',
        validation: (Rule) => Rule.required().custom((value) => siteLinkError(value)),
      }),
    ],
  }
}

/**
 * Portable Text block matching the blog post body: headings, paragraphs,
 * lists, and the standard text styles. Links are limited to a site path
 * or an https address.
 */
export function treatmentPortableTextBlock() {
  return defineArrayMember({
    type: 'block',
    marks: {
      annotations: [linkAnnotation()],
    },
  })
}

/**
 * FAQ answers. Paragraphs, bold text, and lists only, plus the same links
 * as body text. Headings, images, and HTML are not included.
 */
export function treatmentBasicPortableTextBlock() {
  return defineArrayMember({
    type: 'block',
    styles: [{title: 'Paragraph', value: 'normal'}],
    lists: [
      {title: 'Bulleted list', value: 'bullet'},
      {title: 'Numbered list', value: 'number'},
    ],
    marks: {
      decorators: [{title: 'Bold', value: 'strong'}],
      annotations: [linkAnnotation()],
    },
  })
}

export function treatmentTextField(name: string, title: string, description: string) {
  return defineField({
    name,
    title,
    type: 'array',
    description,
    of: [treatmentPortableTextBlock()],
    validation: (Rule) => Rule.required().min(1),
  })
}
