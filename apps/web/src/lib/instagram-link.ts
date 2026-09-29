/**
 * The link rules for an Instagram post, shared by the Studio (validation) and the site
 * (normalising at render time, so links stored before a fix still work). Keep this file
 * free of imports: the Studio imports it by relative path.
 */
export const INSTAGRAM_LINK_MESSAGE = 'Paste a post or reel link, not a profile or story'

export type InstagramLinkCheck = { ok: true; url: string } | { ok: false; message: string }

const INSTAGRAM_HOSTS = new Set(['instagram.com', 'www.instagram.com'])
/** /p/<code> or /reel/<code>, with or without a trailing slash. */
const POST_PATH = /^\/(p|reel)\/([\w-]+)\/?$/

const parse = (link: string): URL | undefined => {
  try {
    return new URL(link.trim())
  } catch {
    return undefined
  }
}

/** Accepts a post or reel link and returns it as https://www.instagram.com/<p|reel>/<code>/. */
export function checkInstagramLink(link: string): InstagramLinkCheck {
  const url = parse(link)
  const match = url && INSTAGRAM_HOSTS.has(url.hostname) ? POST_PATH.exec(url.pathname) : null
  if (!match) return { ok: false, message: INSTAGRAM_LINK_MESSAGE }
  const [, kind, code] = match
  return { ok: true, url: `https://www.instagram.com/${kind}/${code}/` }
}

/**
 * The picked links an Instagram post list renders, normalised and in the editor's order.
 * Broken references (null), invalid links and repeats of the same post are skipped.
 */
export const instagramPostUrls = (
  links: readonly (string | null)[] | null | undefined,
): string[] => [
  ...new Set(
    (links ?? []).flatMap((link) => {
      const check = typeof link === 'string' ? checkInstagramLink(link) : undefined
      return check?.ok ? [check.url] : []
    }),
  ),
]
