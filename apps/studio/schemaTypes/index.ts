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
import { localeRichText, localeString, localeText } from './objects/locale'
import { section } from './documents/section'
import { event } from './documents/event'
import { album } from './documents/album'
import { siteSettings } from './singletons/siteSettings'
import { homepage } from './singletons/homepage'
import { siteUpdateRequest } from './singletons/siteUpdateRequest'
import { faqPage, contactsPage, linksPage } from './singletons/pages'

export const SINGLETONS = [
  'siteSettings',
  'homepage',
  'faqPage',
  'contactsPage',
  'linksPage',
  'siteUpdateRequest',
] as const

export const schemaTypes = [
  // objects
  localeString,
  localeText,
  localeRichText,
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
  siteUpdateRequest,
]
