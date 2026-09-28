import { linkItem } from './objects/linkItem'
import {
  imageWithAlt,
  richText,
  cta,
  socials,
  seo,
  programmeItem,
  faqEntry,
} from './objects/common'
import { section } from './documents/section'
import { event } from './documents/event'
import { album } from './documents/album'
import { siteSettings } from './singletons/siteSettings'
import { homepage } from './singletons/homepage'
import { faqPage, contactsPage, linksPage } from './singletons/pages'

export const SINGLETONS = [
  'siteSettings',
  'homepage',
  'faqPage',
  'contactsPage',
  'linksPage',
] as const

export const schemaTypes = [
  // objects
  imageWithAlt,
  richText,
  cta,
  socials,
  seo,
  programmeItem,
  faqEntry,
  linkItem,
  // collections
  section,
  event,
  album,
  // singletons (one document each)
  siteSettings,
  homepage,
  faqPage,
  contactsPage,
  linksPage,
]
