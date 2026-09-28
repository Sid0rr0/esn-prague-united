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

/** "Thursday 26 November · 18:00", the line above a Featured event's title. */
export const formatKicker = (iso: string): string => {
  const date = new Date(iso)
  const day = `${datePart(date, { weekday: 'long' })} ${datePart(date, { day: 'numeric' })} ${datePart(date, { month: 'long' })}`
  return `${day} · ${formatTime(iso)}`
}

/** "590 CZK" */
export const formatPrice = (amount: number): string => `${amount} CZK`
