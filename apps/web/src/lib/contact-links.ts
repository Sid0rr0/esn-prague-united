const parse = (url: string): URL | null => {
  try {
    return new URL(url)
  } catch {
    return null
  }
}

/** `@handle` from an Instagram profile URL; the raw URL when there's no handle in it. */
export const instagramHandle = (url: string): string => {
  const handle = parse(url)?.pathname.split('/').find(Boolean)
  return handle ? `@${handle}` : url
}

/** The bare domain of a website URL, without `www.`; the raw URL when it can't be parsed. */
export const websiteDomain = (url: string): string => {
  const host = parse(url)?.hostname.replace(/^www\./, '')
  return host || url
}
