import {DocumentIcon, DocumentsIcon} from '@sanity/icons'
import type {StructureResolver} from 'sanity/structure'

import PagesPane from '../components/pagesPane'

/**
 * Studio content structure.
 *
 * "Pages" is a read-only inventory of website files. It does not create
 * documents or change how public pages fetch content.
 * "Treatment pages" is where staff create new Men and Women treatment
 * documents. Those documents do not replace the hardcoded pages listed above.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Pages')
        .id('pages-inventory')
        .icon(DocumentsIcon)
        .child(S.component(PagesPane).title('Pages').id('pages-inventory-pane')),

      S.divider(),

      S.listItem()
        .title('Treatment pages')
        .id('treatmentPage')
        .icon(DocumentIcon)
        .child(
          S.documentTypeList('treatmentPage')
            .title('Treatment pages')
            .defaultOrdering([
              {field: 'section', direction: 'asc'},
              {field: 'title', direction: 'asc'},
            ]),
        ),

      S.listItem()
        .title("What's New (Home)")
        .id('homeAnnouncement')
        .child(S.documentTypeList('homeAnnouncement').title("What's New (Home)")),

      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId()
        return id !== 'homeAnnouncement' && id !== 'treatmentPage'
      }),
    ])
