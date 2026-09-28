// Usage: import { fetchContent } from './content'
//   const home = await fetchContent(HOMEPAGE_QUERY)
import groq from 'groq'

const image = `{..., asset->{_id, url, metadata{lqip, dimensions}}}`

/** GROQ filter: hidden once its "Hide after" date passes (top banner, Quick links). */
const visibleUntilFilter = (field: string) =>
  `(!defined(${field}) || dateTime(${field}) > dateTime(now()))`

// The top banner shows only while it's enabled and before its "Hide after" date.
export const SETTINGS_QUERY = groq`*[_id == "siteSettings"][0]{
  logo, navigation[]{_key, label, href}, socials, footerText, seo,
  "announcement": select(
    announcement.enabled == true && ${visibleUntilFilter('announcement.visibleUntil')} => announcement{text, url}
  )
}`

/** The homepage's upcoming list, About numbers and Quick links each show at most this many. */
const HOMEPAGE_LIST_MAX = 4

/** An Event has ended once its end time has passed, or its start time if it has no end time. */
const HAS_ENDED = `dateTime(coalesce(endsAt, startsAt)) < dateTime(now())`

/** What ticketDisplay in tickets.ts needs to decide what shows where tickets would be. */
const TICKET_FIELDS = `ticketUrl, ticketNote, priceTiers[]{_key, label, amount}, "hasEnded": ${HAS_ENDED}`

// featuredEvent is only what an editor picked, so the hero can take it over. The upcoming
// list never repeats it, and there is no next-event fallback when nothing is picked.
export const HOMEPAGE_QUERY = groq`{
  "page": *[_id == "homepage"][0]{
    hero, about{heading, text, "stats": stats[0...${HOMEPAGE_LIST_MAX}]}, seo,
    "quickLinks": highlightedLinks[${visibleUntilFilter('visibleUntil')}][0...${HOMEPAGE_LIST_MAX}]{_key, label, url},
    "featuredEvent": featuredEvent->{
      title, "slug": slug.current, startsAt, summary, heroImage, ${TICKET_FIELDS}
    }
  },
  "upcoming": *[
    _type == "event" && !(${HAS_ENDED}) && _id != *[_id == "homepage"][0].featuredEvent._ref
  ] | order(startsAt asc)[0...${HOMEPAGE_LIST_MAX}]{_id, title, "slug": slug.current, startsAt},
  "instagram": *[_id == "siteSettings"][0].socials.instagram
}`

export const EVENTS_QUERY = groq`*[_type == "event"] | order(startsAt desc){
  title, "slug": slug.current, startsAt, venue{name}, summary, heroImage${image}
}`

// Detail queries list their fields rather than spreading the document, so data the design
// dropped (e.g. Event organisers) never reaches a page even if an old document still holds it.
export const EVENT_QUERY = groq`*[_type == "event" && slug.current == $slug][0]{
  title, "slug": slug.current, startsAt, endsAt, venue, heroImage${image}, summary, description,
  programme[]{_key, time, title, description}, dressCode, faq[]{_key, question, answer},
  ticketInfo, seo, ${TICKET_FIELDS},
  album->{title, "slug": slug.current}
}`

export const EVENT_SLUGS_QUERY = groq`*[_type == "event" && defined(slug.current)].slug.current`

export const SECTIONS_QUERY = groq`*[_type == "section"] | order(order asc){..., "slug": slug.current}`

export const SECTION_QUERY = groq`*[_type == "section" && slug.current == $slug][0]{
  name, shortName, "slug": slug.current, university, logo, coverImage${image}, tagline, about,
  buddyProgramUrl, email, office, mapUrl, socials
}`

export const ALBUMS_QUERY = groq`*[_type == "album"] | order(date desc){title, "slug": slug.current, date, cover${image}}`

export const ALBUM_QUERY = groq`*[_type == "album" && slug.current == $slug][0]{
  ..., cover${image}, photos[]${image},
  "event": *[_type == "event" && album._ref == ^._id][0]{title, "slug": slug.current}
}`

export const FAQ_QUERY = groq`*[_id == "faqPage"][0]`

export const CONTACTS_QUERY = groq`*[_id == "contactsPage"][0]{
  title, intro, generalEmail, address, socials, seo,
  "sections": select(showSectionContacts => *[_type == "section"] | order(order asc){name, email, office, socials})
}`

// Links whose "Hide after" date passed are filtered at build time.
export const LINKS_QUERY = groq`*[_id == "linksPage"][0]{
  ...,
  "links": links[!defined(visibleUntil) || visibleUntil > now()]
}`
