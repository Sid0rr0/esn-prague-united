/** The Homepage's content, read in one call and ready to render. */
import groq from 'groq'
import { DEFAULT_LANGUAGE, localise, type Language } from './i18n'
import {
  ALBUM_CARD,
  EVENT_DATES,
  HAS_ENDED,
  HOMEPAGE_LIST_MAX,
  SECTIONS_IN_ORDER,
  TICKET_FIELDS,
  visibleUntilFilter,
} from './query-pieces'
import { fetchRaw } from './sanity-client'
import type {
  AlbumSummary,
  EventSummary,
  LinkItem,
  RichText,
  SanityImage,
  SectionSummary,
  Seo,
  TicketFields,
} from './shapes'

/** A picked Instagram post list as just its links, in order; a broken reference is null. */
const INSTAGRAM_POST_LINKS = `[]->link`

// featuredEvent is only what an editor picked, so the hero can take it over. The upcoming
// list never repeats it, and there is no next-event fallback when nothing is picked.
const HOMEPAGE_QUERY = groq`{
  "page": *[_id == "homepage"][0]{
    hero, about{heading, text, "stats": stats[0...${HOMEPAGE_LIST_MAX}]}, seo,
    "sections": select(showSections != false => ${SECTIONS_IN_ORDER}),
    "latestAlbums": select(
      showGallery != false => *[_type == "album"] | order(date desc)[0...${HOMEPAGE_LIST_MAX}]${ALBUM_CARD}
    ),
    "updates": select(showUpdates != false => updates{heading, "links": posts${INSTAGRAM_POST_LINKS}}),
    "quickLinks": highlightedLinks[${visibleUntilFilter('visibleUntil')}][0...${HOMEPAGE_LIST_MAX}]{_key, label, url},
    "featuredEvent": featuredEvent->{
      title, "slug": slug.current, startsAt, summary, heroImage, ${TICKET_FIELDS}
    }
  },
  "upcoming": select(
    *[_id == "homepage"][0].showUpcoming != false => *[
      _type == "event" && !(${HAS_ENDED}) && _id != *[_id == "homepage"][0].featuredEvent._ref
    ] | order(startsAt asc)[0...${HOMEPAGE_LIST_MAX}]{_id, title, "slug": slug.current, ${EVENT_DATES}}
  )
}`

interface Cta {
  label?: string
  url?: string
}

export interface Stat {
  _key: string
  value: string
  label: string
}

interface FeaturedEvent extends TicketFields {
  title: string
  slug: string
  startsAt: string
  summary?: string
  heroImage?: SanityImage
}

/** What the Homepage's Upcoming block shows. */
export type UpcomingList =
  /** Upcoming Events other than the Featured event, soonest first, at most HOMEPAGE_LIST_MAX. */
  | { state: 'list'; events: EventSummary[] }
  /** The Homepage turns the block off, or a Featured event is set and no other Event is upcoming. */
  | { state: 'hidden' }
  /** No Featured event and no Upcoming event: "New events coming soon". */
  | { state: 'coming-soon' }

interface HomepageFields {
  hero?: {
    heading?: string
    subheading?: string
    image?: SanityImage
    primaryButton?: Cta
    secondaryButton?: Cta
  }
  about?: { heading?: string; text?: RichText; stats?: Stat[] | null } | null
  quickLinks?: LinkItem[] | null
  /** The picked Instagram posts' links as stored; see instagramPostUrls. */
  updates?: { heading?: string; links?: (string | null)[] | null } | null
  featuredEvent?: FeaturedEvent | null
  /** Null when the Homepage turns the Sections block off. */
  sections?: SectionSummary[] | null
  /** Newest first, at most HOMEPAGE_LIST_MAX; null when the Homepage turns Latest albums off. */
  latestAlbums?: AlbumSummary[] | null
  seo?: Seo
}

interface HomepageResult {
  /** Null until an editor creates the Homepage Singleton. */
  page: HomepageFields | null
  /** Null when the Homepage turns the Upcoming block off. */
  upcoming: EventSummary[] | null
}

export interface Homepage extends HomepageFields {
  upcoming: UpcomingList
}

function upcomingList(events: EventSummary[] | null, hasFeaturedEvent: boolean): UpcomingList {
  if (events === null) return { state: 'hidden' }
  if (events.length > 0) return { state: 'list', events }
  return hasFeaturedEvent ? { state: 'hidden' } : { state: 'coming-soon' }
}

export async function readHomepage(language: Language = DEFAULT_LANGUAGE): Promise<Homepage> {
  const { page, upcoming } = localise(await fetchRaw<HomepageResult>(HOMEPAGE_QUERY), language)
  return { ...page, upcoming: upcomingList(upcoming, Boolean(page?.featuredEvent)) }
}
