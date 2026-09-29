/** GROQ pieces the queries share, each written once with the content rule it encodes. */

/** An image with its asset's URL, blur placeholder and size, as Picture needs it. */
export const IMAGE = `{..., asset->{_id, url, metadata{lqip, dimensions}}}`

/** GROQ filter: hidden once its "Hide after" date passes (top banner, Quick links, Links page). */
export const visibleUntilFilter = (field: string) =>
  `(!defined(${field}) || dateTime(${field}) > dateTime(now()))`

/** An Event has ended once its end time has passed, or its start time if it has no end time. */
export const HAS_ENDED = `dateTime(coalesce(endsAt, startsAt)) < dateTime(now())`

/** What ticketDisplay in tickets.ts needs to decide what shows where tickets would be. */
export const TICKET_FIELDS = `ticketUrl, ticketNote, priceTiers[]{_key, label, amount}, "hasEnded": ${HAS_ENDED}`

/** An Album without photos has no photos field, so its count is null without coalesce. */
export const PHOTO_COUNT = `"photoCount": coalesce(count(photos), 0)`

/** An Album as the Gallery and the homepage's Latest albums show it. */
export const ALBUM_CARD = `{
  _id, title, "slug": slug.current, date, cover${IMAGE}, ${PHOTO_COUNT}
}`

/** A Section as the Sections list and the homepage's Sections block show it. */
export const SECTION_SUMMARY = `{
  name, "slug": slug.current, university, tagline
}`

/** The 5 Sections in website order, as the Sections list and the homepage block show them. */
export const SECTIONS_IN_ORDER = `*[_type == "section"] | order(order asc)${SECTION_SUMMARY}`

/** The homepage's upcoming list, About numbers, Quick links and Latest albums each show at most this many. */
export const HOMEPAGE_LIST_MAX = 4
