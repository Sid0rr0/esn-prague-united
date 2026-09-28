/**
 * Each Section's brand colour, fixed in code and keyed by its slug. There is no schema field,
 * so editors can't change it or give two Sections the same colour (ADR 0001).
 */
export interface SectionColours {
  /** The Section's brand colour: stripes, the band on its page. */
  colour: string
  /** A pale tint of the brand colour, e.g. behind a missing logo. */
  tint: string
  /** Text on the brand colour: white on magenta and blue, ink on the lighter colours. */
  textClass: 'text-white' | 'text-ink'
}

const MAGENTA: SectionColours = {
  colour: 'var(--color-esn-magenta)',
  tint: 'var(--color-magenta-50)',
  textClass: 'text-white',
}
const BLUE: SectionColours = {
  colour: 'var(--color-esn-blue)',
  tint: 'var(--color-blue-50)',
  textClass: 'text-white',
}
const ORANGE: SectionColours = {
  colour: 'var(--color-esn-orange)',
  tint: 'var(--color-orange-50)',
  textClass: 'text-ink',
}
const GREEN: SectionColours = {
  colour: 'var(--color-esn-green)',
  tint: 'var(--color-green-50)',
  textClass: 'text-ink',
}
const CYAN: SectionColours = {
  colour: 'var(--color-esn-cyan)',
  tint: 'var(--color-cyan-50)',
  textClass: 'text-ink',
}

const BY_SLUG: Record<string, SectionColours> = {
  'esn-cu': MAGENTA,
  'esn-ctu': BLUE,
  'esn-vse': ORANGE,
  'esn-czu': GREEN,
  'esn-uct': CYAN,
}

/** A Section's colours; an unknown slug gets ESN blue rather than no colour at all. */
export const sectionColours = (slug: string): SectionColours => BY_SLUG[slug] ?? BLUE
