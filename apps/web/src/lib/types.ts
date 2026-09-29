/** Page-only shapes returned by the GROQ queries in queries.ts, after i18n.ts resolved translated fields. */
import type { FaqEntry, LinkItem, RichText, SanityImage, Seo, Socials } from './shapes'

export interface Settings {
  logo?: SanityImage
  navigation?: { _key: string; label: string; href: string }[]
  footerText?: string
  seo?: Seo
  /** Only set while the banner is enabled and before its "Hide after" date. */
  announcement?: { text?: string; url?: string } | null
  /** False while the Homepage hides its Updates block (see SETTINGS_QUERY). */
  showsInstagram?: boolean
}

export interface FaqTopic {
  _key: string
  title: string
  items: FaqEntry[]
}

export interface FaqPage {
  title?: string
  intro?: string
  seo?: Seo
  topics?: FaqTopic[] | null
}

export interface PrivacyPolicy {
  title?: string
  body?: RichText
  seo?: Seo
}

/** A Section's name and email as the Contacts page lists them. */
export interface SectionContact {
  name: string
  slug: string
  email?: string
}

export interface ContactsPage {
  title?: string
  intro?: string
  generalEmail?: string
  address?: string
  socials?: Socials | null
  seo?: Seo
  /** The Sections in website order; null when "Also list the 5 sections' contacts" is off. */
  sections?: SectionContact[] | null
}

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

export interface AlbumDetail {
  title: string
  slug: string
  date: string
  photographer?: string
  fullAlbumUrl?: string
  photos?: (SanityImage & { _key: string })[] | null
  photoCount: number
  /** The Event that links to this Album, if any. */
  event?: { slug: string } | null
}
