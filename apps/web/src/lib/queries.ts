// Usage: import { fetchContent } from './content'
//   const sections = await fetchContent(SECTIONS_QUERY)
import groq from 'groq'
import {
  ALBUM_CARD,
  HAS_ENDED,
  IMAGE,
  PHOTO_COUNT,
  SECTIONS_IN_ORDER,
  TICKET_FIELDS,
  visibleUntilFilter,
} from './query-pieces'

// The top banner shows only while it's enabled and before its "Hide after" date. The footer's
// Privacy policy and Cookie settings links follow the Homepage's "Show the Updates block".
export const SETTINGS_QUERY = groq`*[_id == "siteSettings"][0]{
  logo, navigation[]{_key, label, href}, footerText, seo,
  "showsInstagram": *[_id == "homepage"][0].showUpdates != false,
  "announcement": select(
    announcement.enabled == true && ${visibleUntilFilter('announcement.visibleUntil')} => announcement{text, url}
  )
}`

/** The Sections list page; the Homepage reads the same list through homepage.ts. */
export const SECTIONS_QUERY = groq`${SECTIONS_IN_ORDER}`

/** An Event as the Events list page's cards show it: no price or Ticket note. */
const EVENT_CARD = `{
  _id, title, "slug": slug.current, startsAt, "venueName": venue.name, heroImage${IMAGE}
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
  title, "slug": slug.current, startsAt, endsAt, venue, heroImage${IMAGE}, summary, description,
  programme[]{_key, time, title, description}, dressCode, faq[]{_key, question, answer},
  ticketInfo, seo, ${TICKET_FIELDS},
  album->{title, "slug": slug.current}
}`

export const EVENT_SLUGS_QUERY = groq`*[_type == "event" && defined(slug.current)].slug.current`

export const SECTION_SLUGS_QUERY = groq`*[_type == "section" && defined(slug.current)].slug.current`

export const SECTION_QUERY = groq`*[_type == "section" && slug.current == $slug][0]{
  name, shortName, "slug": slug.current, university, coverImage${IMAGE}, tagline, about,
  buddyProgramUrl, email, office, mapUrl, socials
}`

export const ALBUM_SLUGS_QUERY = groq`*[_type == "album" && defined(slug.current)].slug.current`

// Albums don't belong to Sections: neither query reads an old Album's sections field.
export const ALBUMS_QUERY = groq`*[_type == "album"] | order(date desc)${ALBUM_CARD}`

export const ALBUM_QUERY = groq`*[_type == "album" && slug.current == $slug][0]{
  title, "slug": slug.current, date, photographer, fullAlbumUrl,
  photos[]${IMAGE}, ${PHOTO_COUNT},
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
