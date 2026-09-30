import { formatDateRange, formatShortDate } from './format'
import type { EventSummary } from './shapes'

/** "1 Oct – 15 Dec" for an Event with Sessions that ends on a later day, otherwise null: cards show the start date. */
export const eventDateRange = ({ startsAt, endsAt, hasSessions }: EventSummary): string | null => {
  if (!hasSessions || !endsAt) return null
  return formatShortDate(startsAt) === formatShortDate(endsAt)
    ? null
    : formatDateRange(startsAt, endsAt)
}
