/** Shapes returned by the GROQ queries in queries.ts, after i18n.ts resolved translated fields. */

export interface SanityImage {
  asset?: { _ref: string }
  alt?: string
}

export interface Socials {
  instagram?: string
  facebook?: string
  tiktok?: string
  whatsapp?: string
  linkedin?: string
  website?: string
}

export interface Seo {
  title?: string
  description?: string
  image?: SanityImage
}

export interface Settings {
  logo?: SanityImage
  navigation?: { _key: string; label: string; href: string }[]
  socials?: Socials | null
  footerText?: string
  seo?: Seo
  /** Only set while the banner is enabled and before its "Hide after" date. */
  announcement?: { text?: string; url?: string } | null
}

export interface Homepage {
  page: { hero?: { heading?: string; subheading?: string }; seo?: Seo } | null
}
