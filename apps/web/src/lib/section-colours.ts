/**
 * Each Section's brand colour, fixed in code and keyed by its slug. There is no schema field,
 * so editors can't change it or give two Sections the same colour (ADR 0001).
 */
export interface SectionColours {
  /** The Section's brand colour: stripes, the band on its page. */
  colour: string
  /** Text on the brand colour: white on magenta and blue, ink on the lighter colours. */
  textClass: 'text-white' | 'text-ink'
  /**
   * The university line under the name. Magenta gives white only 4.3:1, so it passes for bold
   * text of 19px and up. Blue takes a pale tint; the ink bands take ink in Kelson Light, never grey.
   */
  universityClass: string
}

const MAGENTA: SectionColours = {
  colour: 'var(--color-esn-magenta)',
  textClass: 'text-white',
  universityClass: 'text-white text-[19px] font-bold',
}
const BLUE: SectionColours = {
  colour: 'var(--color-esn-blue)',
  textClass: 'text-white',
  universityClass: 'text-on-blue-muted text-sm font-bold lg:text-base',
}
const ORANGE: SectionColours = {
  colour: 'var(--color-esn-orange)',
  textClass: 'text-ink',
  universityClass: 'text-ink text-sm font-light lg:text-base',
}
const GREEN: SectionColours = {
  colour: 'var(--color-esn-green)',
  textClass: 'text-ink',
  universityClass: 'text-ink text-sm font-light lg:text-base',
}
const CYAN: SectionColours = {
  colour: 'var(--color-esn-cyan)',
  textClass: 'text-ink',
  universityClass: 'text-ink text-sm font-light lg:text-base',
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
