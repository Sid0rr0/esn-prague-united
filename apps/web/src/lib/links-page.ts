/** The Links page, read ready to render. */
import groq from 'groq'
import { DEFAULT_LANGUAGE, localise, type Language } from './i18n'
import { visibleUntilFilter } from './query-pieces'
import { fetchRaw } from './sanity-client'
import type { LinkItem, SanityImage, Seo } from './shapes'

// Links whose "Hide after" date passed are filtered at build time, like the top banner.
const LINKS_QUERY = groq`*[_id == "linksPage"][0]{
  title, intro, avatar, seo,
  "links": links[${visibleUntilFilter('visibleUntil')}]{_key, label, url, highlight}
}`

export interface LinksPageLink extends LinkItem {
  /** Shown as a big coloured button above the plain rows. */
  highlight?: boolean | null
}

export interface LinksPage {
  title?: string
  intro?: string
  avatar?: SanityImage
  seo?: Seo
  /** In editor order, without links past their "Hide after" date. */
  links?: LinksPageLink[] | null
}

/** The Links page, or an empty shape before the Singleton exists. */
export async function readLinksPage(language: Language = DEFAULT_LANGUAGE): Promise<LinksPage> {
  return localise(await fetchRaw<LinksPage | null>(LINKS_QUERY), language) ?? {}
}
