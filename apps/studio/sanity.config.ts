import { defineConfig } from 'sanity'
import { structureTool, type StructureResolver } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { UpdateWebsiteNavbar } from './siteUpdate/UpdateWebsiteNavbar'
import { schemaTypes, SINGLETONS } from './schemaTypes'

/**
 * Editor-friendly sidebar:
 * - singletons open directly (no list, no "create new", no delete)
 * - sections shown as a fixed list of 5
 */
const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(type).title(title))

const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      singleton(S, 'homepage', 'Homepage'),
      S.documentTypeListItem('event').title('Events'),
      S.documentTypeListItem('album').title('Photo albums'),
      S.documentTypeListItem('instagramPost').title('Instagram posts'),
      S.divider(),
      S.listItem()
        .title('ESN sections')
        .schemaType('section')
        .child(
          S.documentTypeList('section')
            .title('ESN sections')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
            .initialValueTemplates([]),
        ),
      singleton(S, 'faqPage', 'FAQ'),
      singleton(S, 'contactsPage', 'Contacts'),
      singleton(S, 'linksPage', 'Links page'),
      S.divider(),
      singleton(S, 'siteSettings', 'Site settings'),
    ])

const singletonSet = new Set<string>(SINGLETONS)
// Only admins should create sections (there are exactly 5).
const noCreate = new Set<string>([...SINGLETONS, 'section'])

export default defineConfig({
  name: 'esn-prague',
  title: 'ESN Prague',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    // hide singletons and sections from the global "+ Create" menu
    templates: (templates) => templates.filter(({ schemaType }) => !noCreate.has(schemaType)),
  },
  studio: { components: { navbar: UpdateWebsiteNavbar } },
  document: {
    // no duplicate/delete on singletons
    actions: (actions, { schemaType }) =>
      singletonSet.has(schemaType)
        ? actions.filter(
            ({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action),
          )
        : actions,
  },
})
