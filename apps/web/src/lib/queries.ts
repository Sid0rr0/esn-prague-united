// Usage: import { fetchContent } from './content'
//   const faq = await fetchContent(FAQ_QUERY)
import groq from 'groq'
import { ALBUM_CARD, IMAGE, PHOTO_COUNT, visibleUntilFilter } from './query-pieces'

// The dropped-data test still reads these queries here; pages read through events.ts and sections.ts.
export { EVENT_QUERY } from './events'
export { SECTION_QUERY } from './sections'

// The top banner shows only while it's enabled and before its "Hide after" date. The footer's
// Privacy policy and Cookie settings links follow the Homepage's "Show the Updates block".
export const SETTINGS_QUERY = groq`*[_id == "siteSettings"][0]{
  logo, navigation[]{_key, label, href}, footerText, seo,
  "showsInstagram": *[_id == "homepage"][0].showUpdates != false,
  "announcement": select(
    announcement.enabled == true && ${visibleUntilFilter('announcement.visibleUntil')} => announcement{text, url}
  )
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
