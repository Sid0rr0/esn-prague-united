/**
 * Pure transform behind localise-text-fields.ts: wraps plain text values in the
 * { _type, en } shape of field-level translation (ADR 0002). Values that are
 * already localised are left alone, so running the migration twice is harmless.
 */

type LocaleType = 'localeString' | 'localeText' | 'localeRichText'
/** Where the translatable fields sit inside a document. `[spec]` means "each array item". */
type FieldSpec = LocaleType | [FieldSpec] | { [field: string]: FieldSpec }
type Doc = { _id: string; _type: string; [field: string]: unknown }

const L = 'localeString'
const T = 'localeText'
const R = 'localeRichText'

const IMAGE = { alt: L, caption: L } as const
const CTA = { label: L } as const
const SEO = { title: L, description: T } as const
const FAQ_ENTRY = { question: L, answer: R } as const

export const TRANSLATABLE_FIELDS: Record<string, FieldSpec> = {
  event: {
    title: L,
    venue: { transport: T },
    heroImage: IMAGE,
    summary: T,
    description: R,
    programme: [{ title: L, description: T }],
    dressCode: R,
    faq: [FAQ_ENTRY],
    priceTiers: [{ label: L }],
    ticketNote: L,
    ticketInfo: R,
    seo: SEO,
  },
  album: { title: L, cover: IMAGE, photos: [IMAGE] },
  section: { name: L, university: L, coverImage: IMAGE, tagline: L, about: R, office: T },
  homepage: {
    hero: { heading: L, subheading: T, image: IMAGE, primaryButton: CTA, secondaryButton: CTA },
    about: { heading: L, text: R, stats: [{ label: L }] },
    highlightedLinks: [{ label: L }],
    seo: SEO,
  },
  siteSettings: {
    announcement: { text: L },
    navigation: [{ label: L }],
    footerText: T,
    seo: SEO,
  },
  faqPage: { title: L, intro: T, groups: [{ title: L, items: [FAQ_ENTRY] }], seo: SEO },
  contactsPage: { title: L, intro: T, seo: SEO },
  linksPage: { title: L, intro: L, links: [{ label: L }], seo: SEO },
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isLocalised = (value: unknown) => isPlainObject(value) && ('en' in value || 'cs' in value)

/** Images inside rich text carry their own translatable alt text. */
const localiseRichTextImages = (blocks: unknown[]) =>
  blocks.map((block) =>
    isPlainObject(block) && block._type === 'imageWithAlt' ? localiseValue(block, IMAGE) : block,
  )

function localiseValue(value: unknown, spec: FieldSpec): unknown {
  if (value === undefined || value === null) return value
  if (typeof spec === 'string') {
    if (isLocalised(value)) return value
    const en = spec === R && Array.isArray(value) ? localiseRichTextImages(value) : value
    return { _type: spec, en }
  }
  if (Array.isArray(spec)) {
    return Array.isArray(value) ? value.map((item) => localiseValue(item, spec[0])) : value
  }
  if (!isPlainObject(value)) return value
  return Object.fromEntries(
    Object.entries(value).map(([field, fieldValue]) => [
      field,
      field in spec ? localiseValue(fieldValue, spec[field]) : fieldValue,
    ]),
  )
}

/** The top-level fields of `doc` that change, with their localised values. */
export function localisedFields(doc: Doc): Record<string, unknown> {
  const spec = TRANSLATABLE_FIELDS[doc._type]
  if (!spec || typeof spec === 'string' || Array.isArray(spec)) return {}
  return Object.fromEntries(
    Object.keys(spec)
      .filter((field) => doc[field] !== undefined)
      .map((field) => [field, localiseValue(doc[field], spec[field])] as const)
      .filter(([field, value]) => JSON.stringify(value) !== JSON.stringify(doc[field])),
  )
}
