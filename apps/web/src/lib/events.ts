/** The Events list, each Event page and their static paths, read ready to render. */
import groq from 'groq'
import { DEFAULT_LANGUAGE, localise, type Language } from './i18n'
import { EVENT_DATES, HAS_ENDED, IMAGE, TICKET_FIELDS } from './query-pieces'
import { fetchRaw } from './sanity-client'
import type { EventCardData, FaqEntry, RichText, SanityImage, Seo, TicketFields } from './shapes'

/** An Event as the Events list page's cards show it: no price or Ticket note. */
const EVENT_CARD = `{
  _id, title, "slug": slug.current, ${EVENT_DATES}, "venueName": venue.name, heroImage${IMAGE}
}`

// The Featured event is listed like any other here. Past events keep their Albums reachable,
// newest first by the same end time that makes them past.
const EVENTS_LIST_QUERY = groq`{
  "upcoming": *[_type == "event" && !(${HAS_ENDED})] | order(startsAt asc)${EVENT_CARD},
  "past": *[_type == "event" && ${HAS_ENDED}] | order(coalesce(endsAt, startsAt) desc)${EVENT_CARD}
}`

// Detail queries list their fields rather than spreading the document, so data the design
// dropped (e.g. Event organisers) never reaches a page even if an old document still holds it.
const EVENT_QUERY = groq`*[_type == "event" && slug.current == $slug][0]{
  title, "slug": slug.current, startsAt, endsAt, venue, heroImage${IMAGE}, summary, description,
  programme[]{_key, time, title, description}, dressCode, faq[]{_key, question, answer},
  ticketInfo, seo, ${TICKET_FIELDS},
  "sessions": sessions[!(${HAS_ENDED})] | order(startsAt asc){_key, startsAt, endsAt, ticketUrl, note},
  album->{title, "slug": slug.current},
  "relatedEvents": (relatedEvents[]->${EVENT_CARD})[defined(slug)]
}`

const EVENT_SLUGS_QUERY = groq`*[_type == "event" && defined(slug.current)].slug.current`

/** The Events list page: Upcoming soonest first, Past newest first. */
export interface EventsList {
  upcoming: EventCardData[]
  past: EventCardData[]
}

interface ProgrammeItem {
  _key: string
  time: string
  title: string
  description?: string
}

/** An upcoming Session of an Event, as a row of its "Dates & tickets" table. */
export interface SessionRow {
  _key: string
  startsAt: string
  endsAt?: string
  ticketUrl?: string
  note?: string
}

interface Venue {
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
  /** Only the upcoming Sessions, soonest first; null when the Event has none. */
  sessions?: SessionRow[] | null
  /** In the editor's order, without entries that no longer resolve to an Event with a web address. */
  relatedEvents?: EventCardData[] | null
}

export async function readEventsList(language: Language = DEFAULT_LANGUAGE): Promise<EventsList> {
  return localise(await fetchRaw<EventsList>(EVENTS_LIST_QUERY), language)
}

/** The Event with this slug, or null when there is none. */
export async function readEvent(
  slug: string,
  language: Language = DEFAULT_LANGUAGE,
): Promise<EventDetail | null> {
  return localise(await fetchRaw<EventDetail | null>(EVENT_QUERY, { slug }), language)
}

export async function readEventSlugs(): Promise<string[]> {
  return fetchRaw<string[]>(EVENT_SLUGS_QUERY)
}
