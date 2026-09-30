import { PRAGUE_TIME_ZONE } from './site'

const LOCALE = 'en-GB'

/** One piece of a date (e.g. its weekday), in Prague time. */
const datePart = (date: Date, options: Intl.DateTimeFormatOptions): string =>
  new Intl.DateTimeFormat(LOCALE, { ...options, timeZone: PRAGUE_TIME_ZONE }).format(date)

/** "18:00" in Prague time. */
const formatTime = (iso: string): string =>
  datePart(new Date(iso), { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })

/** "26 Nov" */
export const formatShortDate = (iso: string): string => {
  const date = new Date(iso)
  return `${datePart(date, { day: 'numeric' })} ${datePart(date, { month: 'short' })}`
}

/** "1 Oct – 15 Dec", the span of an Event with Sessions. */
export const formatDateRange = (startIso: string, endIso: string): string =>
  `${formatShortDate(startIso)} – ${formatShortDate(endIso)}`

/** "Thu 26 Nov" in Prague time, the date of a Session row. */
export const formatWeekdayDate = (iso: string): string => {
  const date = new Date(iso)
  return `${datePart(date, { weekday: 'short' })} ${formatShortDate(iso)}`
}

/** "Thursday 26 November" in Prague time. */
export const formatLongDate = (iso: string): string => {
  const date = new Date(iso)
  return `${datePart(date, { weekday: 'long' })} ${datePart(date, { day: 'numeric' })} ${datePart(date, { month: 'long' })}`
}

/** "20 September 2026", for a date without a time (e.g. an Album's). */
export const formatDayMonthYear = (isoDate: string): string =>
  new Intl.DateTimeFormat(LOCALE, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(isoDate))

/** "1 photo", "24 photos" */
export const formatPhotoCount = (count: number): string =>
  `${count} ${count === 1 ? 'photo' : 'photos'}`

/** "18:00–02:00", or "18:00" when there's no end time. */
export const formatTimeRange = (startIso: string, endIso?: string): string =>
  endIso ? `${formatTime(startIso)}–${formatTime(endIso)}` : formatTime(startIso)

/** "Thursday 26 November · 18:00", the line above a Featured event's title. */
export const formatKicker = (iso: string): string => `${formatLongDate(iso)} · ${formatTime(iso)}`

/** "590 CZK" */
export const formatPrice = (amount: number): string => `${amount} CZK`
