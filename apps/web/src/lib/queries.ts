// Usage: import { fetchContent } from './content'
//   const home = await fetchContent(HOMEPAGE_QUERY)
import groq from 'groq'

const image = `{..., asset->{_id, url, metadata{lqip, dimensions}}}`

/** GROQ filter: hidden once its "Hide after" date passes (top banner, Quick links, Links page). */
const visibleUntilFilter = (field: string) =>
  `(!defined(${field}) || dateTime(${field}) > dateTime(now()))`

// The top banner shows only while it's enabled and before its "Hide after" date.
export const SETTINGS_QUERY = groq`*[_id == "siteSettings"][0]{
  logo, navigation[]{_key, label, href}, footerText, seo,
  "announcement": select(
    announcement.enabled == true && ${visibleUntilFilter('announcement.visibleUntil')} => announcement{text, url}
  )
}`

/** The 5 Sections in website order, as the Sections list and the homepage block show them. */
export const SECTIONS_QUERY = groq`*[_type == "section"] | order(order asc){
  name, "slug": slug.current, university, tagline
}`

/** An Album without photos has no photos field, so its count is null without coalesce. */
const PHOTO_COUNT = `"photoCount": coalesce(count(photos), 0)`

/** An Album as the Gallery and the homepage's Latest albums show it. */
const ALBUM_CARD = `{
  _id, title, "slug": slug.current, date, cover${image}, ${PHOTO_COUNT}
}`

/** The homepage's upcoming list, About numbers, Quick links and Latest albums each show at most this many. */
const HOMEPAGE_LIST_MAX = 4

/** An Event has ended once its end time has passed, or its start time if it has no end time. */
const HAS_ENDED = `dateTime(coalesce(endsAt, startsAt)) < dateTime(now())`

/** What ticketDisplay in tickets.ts needs to decide what shows where tickets would be. */
const TICKET_FIELDS = `ticketUrl, ticketNote, priceTiers[]{_key, label, amount}, "hasEnded": ${HAS_ENDED}`

/** A picked Instagram post list as just its links, in order; a broken reference is null. */
const INSTAGRAM_POST_LINKS = `[]->link`

// featuredEvent is only what an editor picked, so the hero can take it over. The upcoming
// list never repeats it, and there is no next-event fallback when nothing is picked.
export const HOMEPAGE_QUERY = groq`{
  "page": *[_id == "homepage"][0]{
    hero, about{heading, text, "stats": stats[0...${HOMEPAGE_LIST_MAX}]}, seo,
    "sections": select(showSections != false => ${SECTIONS_QUERY}),
    "latestAlbums": select(
      showGallery != false => *[_type == "album"] | order(date desc)[0...${HOMEPAGE_LIST_MAX}]${ALBUM_CARD}
    ),
    "updates": updates{heading, "links": posts${INSTAGRAM_POST_LINKS}},
    "quickLinks": highlightedLinks[${visibleUntilFilter('visibleUntil')}][0...${HOMEPAGE_LIST_MAX}]{_key, label, url},
    "featuredEvent": featuredEvent->{
      title, "slug": slug.current, startsAt, summary, heroImage, ${TICKET_FIELDS}
    }
  },
  "upcoming": *[
    _type == "event" && !(${HAS_ENDED}) && _id != *[_id == "homepage"][0].featuredEvent._ref
  ] | order(startsAt asc)[0...${HOMEPAGE_LIST_MAX}]{_id, title, "slug": slug.current, startsAt}
}`

/** An Event as the Events list page's cards show it: no price or Ticket note. */
const EVENT_CARD = `{
  _id, title, "slug": slug.current, startsAt, "venueName": venue.name, heroImage${image}
}`

// The Featured event is listed like any other here. Past events keep their Albums reachable,
// newest first by the same end time that makes them past.
export const EVENTS_LIST_QUERY = groq`{
  "upcoming": *[_type == "event" && !(${HAS_ENDED})] | order(startsAt asc)${EVENT_CARD},
  "past": *[_type == "event" && ${HAS_ENDED}] | order(coalesce(endsAt, startsAt) desc)${EVENT_CARD}
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

export const SECTION_SLUGS_QUERY = groq`*[_type == "section" && defined(slug.current)].slug.current`

export const SECTION_QUERY = groq`*[_type == "section" && slug.current == $slug][0]{
  name, shortName, "slug": slug.current, university, coverImage${image}, tagline, about,
  buddyProgramUrl, email, office, mapUrl, socials
}`

export const ALBUM_SLUGS_QUERY = groq`*[_type == "album" && defined(slug.current)].slug.current`

// Albums don't belong to Sections: neither query reads an old Album's sections field.
export const ALBUMS_QUERY = groq`*[_type == "album"] | order(date desc)${ALBUM_CARD}`

export const ALBUM_QUERY = groq`*[_type == "album" && slug.current == $slug][0]{
  title, "slug": slug.current, date, photographer, fullAlbumUrl,
  photos[]${image}, ${PHOTO_COUNT},
  "event": *[_type == "event" && album._ref == ^._id && defined(slug.current)][0]{"slug": slug.current}
}`

// A topic without questions has nothing to open, so it gets no chip and no heading.
export const FAQ_QUERY = groq`*[_id == "faqPage"][0]{
  title, intro, seo,
  "topics": groups[count(items) > 0]{_key, title, items[]{_key, question, answer}}
}`

// The Section contacts toggle starts on, so a document that never touched it lists them too.
export const CONTACTS_QUERY = groq`*[_id == "contactsPage"][0]{
  title, intro, generalEmail, address, socials, seo,
  "sections": select(
    showSectionContacts != false => *[_type == "section"] | order(order asc){name, "slug": slug.current, email}
  )
}`

// Links whose "Hide after" date passed are filtered at build time, like the top banner.
export const LINKS_QUERY = groq`*[_id == "linksPage"][0]{
  title, intro, avatar, seo,
  "links": links[${visibleUntilFilter('visibleUntil')}]{_key, label, url, highlight}
}`

export const PRIVACY_POLICY_QUERY = groq`*[_id == "privacyPolicy"][0]{title, body, seo}`
