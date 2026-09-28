import type { PriceTier, TicketFields } from './types'

/**
 * What an Event shows where tickets would be (e.g. the homepage hero). Availability is
 * inferred from the ticket link; there is no status field.
 */
export type TicketDisplay =
  | { kind: 'buy'; url: string; headline?: PriceTier }
  | { kind: 'note'; note: string }
  | { kind: 'none' }

export function ticketDisplay(event: TicketFields): TicketDisplay {
  if (event.ticketUrl) return { kind: 'buy', url: event.ticketUrl, headline: event.priceTiers?.[0] }
  if (event.ticketNote) return { kind: 'note', note: event.ticketNote }
  return { kind: 'none' }
}
