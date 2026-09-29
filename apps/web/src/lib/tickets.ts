import type { PriceTier, TicketFields } from './shapes'

/**
 * What an Event shows where tickets would be (homepage hero, Event page sidebar and sticky
 * bar). Availability is inferred from the ticket link; there is no status field. An Event
 * that has ended shows nothing, whatever its ticket fields hold.
 */
export type TicketDisplay =
  | { kind: 'buy'; url: string; headline?: PriceTier }
  | { kind: 'note'; note: string }
  | { kind: 'none' }

export function ticketDisplay(event: TicketFields): TicketDisplay {
  if (event.hasEnded) return { kind: 'none' }
  if (event.ticketUrl) return { kind: 'buy', url: event.ticketUrl, headline: event.priceTiers?.[0] }
  if (event.ticketNote) return { kind: 'note', note: event.ticketNote }
  return { kind: 'none' }
}
