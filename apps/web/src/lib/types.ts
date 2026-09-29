/** Shapes returned by the GROQ queries in queries.ts, after i18n.ts resolved translated fields. */
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

export interface Settings {
  logo?: SanityImage
  navigation?: { _key: string; label: string; href: string }[]
  footerText?: string
  seo?: Seo
  /** Only set while the banner is enabled and before its "Hide after" date. */
  announcement?: { text?: string; url?: string } | null
}

/** Portable Text blocks (and inline images) as stored by the Studio's rich text field. */
export type RichText = Extract<Parameters<typeof toHTML>[0], unknown[]>

export interface Cta {
  label?: string
  url?: string
}

export interface LinkItem {
  _key: string
  label: string
  url: string
}

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

/** The Events list page: Upcoming soonest first, Past newest first. */
export interface EventsList {
  upcoming: EventCardData[]
  past: EventCardData[]
}

export interface FeaturedEvent extends TicketFields {
  title: string
  slug: string
  startsAt: string
  summary?: string
  heroImage?: SanityImage
}

export interface ProgrammeItem {
  _key: string
  time: string
  title: string
  description?: string
}

export interface FaqEntry {
  _key: string
  question: string
  answer?: RichText
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

export interface Venue {
  name?: string
  address?: string
  mapUrl?: string
  transport?: string
}

export interface EventDetail extends TicketFields {
  title: string
  slug: string
  startsAt: string
  endsAt?: string
  venue?: Venue | null
  heroImage?: SanityImage
  summary?: string
  description?: RichText
  programme?: ProgrammeItem[] | null
  dressCode?: RichText
  faq?: FaqEntry[] | null
  ticketInfo?: RichText
  seo?: Seo
  album?: { title: string; slug: string } | null
}

export interface Stat {
  _key: string
  value: string
  label: string
}

export interface Homepage {
  page: {
    hero?: {
      heading?: string
      subheading?: string
      image?: SanityImage
      primaryButton?: Cta
      secondaryButton?: Cta
    }
    about?: { heading?: string; text?: RichText; stats?: Stat[] | null } | null
    quickLinks?: LinkItem[] | null
    featuredEvent?: FeaturedEvent | null
    /** Null when the Homepage turns the Sections block off. */
    sections?: SectionSummary[] | null
    /** Newest first, at most 4; null when the Homepage turns Latest albums off. */
    latestAlbums?: AlbumSummary[] | null
    seo?: Seo
  } | null
  /** Upcoming Events other than the Featured event, soonest first, at most 4. */
  upcoming: EventSummary[]
}

export interface SectionSummary {
  name: string
  slug: string
  university?: string
  tagline?: string
}

export interface SectionDetail {
  name: string
  slug: string
  university?: string
  coverImage?: SanityImage
  tagline?: string
  about?: RichText
  buddyProgramUrl?: string
  email?: string
  /** Office hours and place as the editor wrote them, shown as prose. */
  office?: string
  mapUrl?: string
  socials?: Socials | null
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
