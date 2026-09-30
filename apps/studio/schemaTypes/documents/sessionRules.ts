/** More Sessions than this is most likely a typo (a whole year), so the Studio warns. */
export const SESSIONS_MAX = 40

type Check = true | string

interface Span {
  startsAt?: string
  endsAt?: string
}

const isBlank = (value: unknown): boolean => {
  if (value === undefined || value === null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (typeof value === 'object') return Object.values(value).every(isBlank)
  return false
}

/** A Session can't end before it starts. */
export const checkSessionEnd = (startsAt?: string, endsAt?: string): Check =>
  !startsAt || !endsAt || Date.parse(endsAt) >= Date.parse(startsAt)
    ? true
    : 'Ends is before Starts.'

/** A Session should sit inside the Event's Starts to Ends span. */
export const checkSessionSpan = (session: Span, event: Span): Check => {
  if (!session.startsAt || !event.startsAt) return true
  const sessionStart = Date.parse(session.startsAt)
  const sessionEnd = Date.parse(session.endsAt ?? session.startsAt)
  const isBeforeEvent = sessionStart < Date.parse(event.startsAt)
  const isAfterEvent = event.endsAt !== undefined && sessionEnd > Date.parse(event.endsAt)
  return isBeforeEvent || isAfterEvent
    ? "This Session is outside the Event's Starts and Ends. Check the dates."
    : true
}

export const checkSessionCount = (count?: number): Check =>
  (count ?? 0) <= SESSIONS_MAX
    ? true
    : `More than ${SESSIONS_MAX} Sessions. Check that you didn't add a whole year by mistake.`

/** The Event's own Ticket link and Ticket note lose to Sessions on the site. */
export const checkTicketFieldIgnored = (value: unknown, sessions?: readonly unknown[]): Check =>
  isBlank(value) || !sessions?.length
    ? true
    : 'Ignored while the Event has Sessions. Each Session has its own ticket link and note.'
