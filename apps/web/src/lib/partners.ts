import type { PartnerCredit } from './events'
import type { UiString } from './ui-strings'

/** Display order of the Partner groups; the keys are the ones the Studio stores. */
const PARTNER_GROUP_ORDER = [
  { key: 'university', label: 'partnerGroupUniversity' satisfies UiString },
  { key: 'commercial', label: 'partnerGroupCommercial' satisfies UiString },
] as const

export type PartnerGroupKey = (typeof PARTNER_GROUP_ORDER)[number]['key']

/** Credits sorted into the fixed group order, editor order kept within a group; empty groups dropped.
 * A credit whose `partnerGroup` is not a known key is dropped too (the Studio makes the field required). */
export const groupPartners = (credits: PartnerCredit[]) =>
  PARTNER_GROUP_ORDER.map(({ key, label }) => ({
    key,
    label,
    credits: credits.filter((c) => c.partnerGroup === key),
  })).filter((g) => g.credits.length > 0)
