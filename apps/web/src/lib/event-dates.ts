import { formatShortDate } from './format'
import type { EventSummary } from './shapes'
import { uiString } from './ui-strings'

/** "From 1 Oct" for an Event with Sessions, otherwise null: cards show the start date. */
export const eventFromDate = ({ startsAt, hasSessions }: EventSummary): string | null =>
  hasSessions ? `${uiString('from')} ${formatShortDate(startsAt)}` : null
