// Usage (with @sanity/astro): import {sanityClient} from 'sanity:client'
//   const home = await sanityClient.fetch(HOMEPAGE_QUERY)
import groq from 'groq'

const image = `{..., asset->{_id, url, metadata{lqip, dimensions}}}`

export const SETTINGS_QUERY = groq`*[_id == "siteSettings"][0]`

export const HOMEPAGE_QUERY = groq`{
  "page": *[_id == "homepage"][0]{
    ...,
    hero{..., image${image}},
    "featuredEvent": coalesce(
      featuredEvent->,
      *[_type == "event" && startsAt > now()] | order(startsAt asc)[0]
    ){title, "slug": slug.current, startsAt, venue, summary, ticketUrl, heroImage${image}}
  },
  "sections": *[_type == "section"] | order(order asc){name, shortName, "slug": slug.current, tagline, logo},
  "albums": *[_type == "album"] | order(date desc)[0...4]{title, "slug": slug.current, date, cover${image}}
}`

export const EVENTS_QUERY = groq`*[_type == "event"] | order(startsAt desc){
  title, "slug": slug.current, startsAt, venue{name}, summary, heroImage${image}
}`

export const EVENT_QUERY = groq`*[_type == "event" && slug.current == $slug][0]{
  ...,
  heroImage${image},
  organisers[]->{name, shortName, "slug": slug.current},
  album->{title, "slug": slug.current, cover${image}}
}`

export const SECTIONS_QUERY = groq`*[_type == "section"] | order(order asc){..., "slug": slug.current}`

export const SECTION_QUERY = groq`*[_type == "section" && slug.current == $slug][0]{
  ...,
  "events": *[_type == "event" && references(^._id)] | order(startsAt desc)[0...6]{title, "slug": slug.current, startsAt},
  "albums": *[_type == "album" && references(^._id)] | order(date desc){title, "slug": slug.current, cover${image}}
}`

export const ALBUMS_QUERY = groq`*[_type == "album"] | order(date desc){title, "slug": slug.current, date, cover${image}}`

export const ALBUM_QUERY = groq`*[_type == "album" && slug.current == $slug][0]{
  ..., cover${image}, photos[]${image},
  "event": *[_type == "event" && album._ref == ^._id][0]{title, "slug": slug.current}
}`

export const FAQ_QUERY = groq`*[_id == "faqPage"][0]`

export const CONTACTS_QUERY = groq`*[_id == "contactsPage"][0]{
  ...,
  people[]{..., photo${image}, section->{shortName}},
  "sections": select(showSectionContacts => *[_type == "section"] | order(order asc){name, email, office, socials})
}`

// Links whose "Hide after" date passed are filtered at build time.
export const LINKS_QUERY = groq`*[_id == "linksPage"][0]{
  ...,
  "links": links[!defined(visibleUntil) || visibleUntil > now()]
}`
