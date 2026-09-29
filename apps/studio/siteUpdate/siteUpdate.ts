export const SITE_UPDATE_REQUEST_TYPE = 'siteUpdateRequest'
export const SITE_UPDATE_REQUEST_ID = 'siteUpdateRequest'
export const COOLDOWN_MS = 45_000

export type SiteUpdateUser = { id: string; name?: string }

export type SiteUpdateRequest = {
  _id: typeof SITE_UPDATE_REQUEST_ID
  _type: typeof SITE_UPDATE_REQUEST_TYPE
  pressedAt: string
  pressedBy: string
}

export const buildSiteUpdateRequest = (
  user: SiteUpdateUser | null,
  now: Date,
): SiteUpdateRequest => ({
  _id: SITE_UPDATE_REQUEST_ID,
  _type: SITE_UPDATE_REQUEST_TYPE,
  pressedAt: now.toISOString(),
  pressedBy: user?.name || user?.id || 'unknown',
})

/** Milliseconds left of the shared cooldown; 0 when a press is allowed. */
export const cooldownRemainingMs = (pressedAt: string | undefined, now: Date): number => {
  const pressedMs = pressedAt ? Date.parse(pressedAt) : NaN
  if (Number.isNaN(pressedMs)) return 0
  const remaining = pressedMs + COOLDOWN_MS - now.getTime()
  return Math.min(COOLDOWN_MS, Math.max(0, remaining))
}
