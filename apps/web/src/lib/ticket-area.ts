import type { PriceTier, RichText, TicketFields } from './shapes'

/**
 * Choose a date or Buy ticket with the headline price (the first Price tier), the Ticket note,
 * or nothing. Availability is inferred from the ticket link; there is no status field.
 */
export type TicketAction =
  | { kind: 'choose-date'; href: string; headline?: PriceTier }
  | { kind: 'buy'; url: string; headline?: PriceTier }
  | { kind: 'note'; note: string }
  | { kind: 'none' }

/** The ticket sidebar: every Price tier, the ticket action and the ticket info. */
export interface TicketsAside {
  kind: 'tickets'
  tiers: PriceTier[]
  ticketAction: TicketAction
  info?: RichText
}

/** What sits beside an Event's content: the ticket sidebar, its Album once ended, or nothing. */
export type Aside = TicketsAside | { kind: 'album'; albumSlug: string } | { kind: 'none' }

/**
 * The Ticket area: everything an Event shows where tickets would be. Every rule about it
 * lives here, so the Event page and the Homepage hero only render what this returns.
 */
export interface TicketArea {
  /** Shown in the Homepage hero, the ticket sidebar and the sticky bar. */
  ticketAction: TicketAction
  aside: Aside
  /** Whether the sticky bar shows on mobile, which also needs extra room at the bottom. */
  hasStickyBar: boolean
}

/** Ticket info and the Album are optional: the Homepage's Featured event doesn't read them. */
export interface TicketAreaFields extends TicketFields {
  ticketInfo?: RichText
  album?: { slug: string } | null
}

/**
 * An Event that has ended offers no tickets, whatever its ticket fields hold. Upcoming
 * Sessions send visitors to the Sessions table, ignoring the Event's own link and note.
 */
function ticketActionOf(event: TicketAreaFields, sessionsHref: string): TicketAction {
  if (event.hasEnded) return { kind: 'none' }
  if (event.hasUpcomingSessions) {
    return { kind: 'choose-date', href: sessionsHref, headline: event.priceTiers?.[0] }
  }
  if (event.ticketUrl) return { kind: 'buy', url: event.ticketUrl, headline: event.priceTiers?.[0] }
  if (event.ticketNote) return { kind: 'note', note: event.ticketNote }
  return { kind: 'none' }
}

/**
 * Once ended, an Event points to its Album instead, or shows nothing without one. Before
 * that, it shows the ticket sidebar when there is anything to put in it.
 */
function asideOf(event: TicketAreaFields, ticketAction: TicketAction): Aside {
  if (event.hasEnded) {
    return event.album ? { kind: 'album', albumSlug: event.album.slug } : { kind: 'none' }
  }
  const tiers = event.priceTiers ?? []
  const hasSidebarContent =
    ticketAction.kind !== 'none' || tiers.length > 0 || Boolean(event.ticketInfo)
  return hasSidebarContent
    ? { kind: 'tickets', tiers, ticketAction, info: event.ticketInfo }
    : { kind: 'none' }
}

/** `sessionsHref` is where the "Dates & tickets" section is, relative to the page showing this. */
export function ticketArea(event: TicketAreaFields, sessionsHref: string): TicketArea {
  const ticketAction = ticketActionOf(event, sessionsHref)
  return {
    ticketAction,
    aside: asideOf(event, ticketAction),
    hasStickyBar: ticketAction.kind !== 'none',
  }
}
