const EXTERNAL_URL = /^https?:\/\//i

/** Anchor attributes that open an outgoing link in a new tab; nothing for site paths and mailto. */
export const externalLinkProps = (url: string | undefined) =>
  url && EXTERNAL_URL.test(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {}
