/** Shapes more than one page reads, after i18n.ts resolved translated fields. */
import type { toHTML } from '@portabletext/to-html'

export interface SanityImage {
  asset?: { _ref: string }
  alt?: string
}

export interface Socials {
  instagram?: string
  facebook?: string
  tiktok?: string
  whatsapp?: string
  linkedin?: string
  website?: string
}

export interface Seo {
  title?: string
  description?: string
  image?: SanityImage
}

/** Portable Text blocks (and inline images) as stored by the Studio's rich text field. */
export type RichText = Extract<Parameters<typeof toHTML>[0], unknown[]>

export interface PriceTier {
  _key: string
  label: string
  amount: number
}

export interface TicketFields {
  ticketUrl?: string
  ticketNote?: string
  priceTiers?: PriceTier[] | null
  /** Its end time has passed, or its start time if it has no end time. */
  hasEnded: boolean
}

export interface EventSummary {
  _id: string
  title: string
  slug: string
  startsAt: string
}

/** An Event as a card on the Events list page shows it. */
export interface EventCardData extends EventSummary {
  venueName?: string
  heroImage?: SanityImage
}

export interface AlbumSummary {
  _id: string
  title: string
  slug: string
  /** "2026-09-20", the day the photos were taken. */
  date: string
  cover?: SanityImage
  photoCount: number
}

export interface SectionSummary {
  name: string
  slug: string
  university?: string
  tagline?: string
}

export interface FaqEntry {
  _key: string
  question: string
  answer?: RichText
}

/** A link as the Homepage's Quick links and the Links page show it. */
export interface LinkItem {
  _key: string
  label: string
  url: string
}
