import type { PartnerCredit } from './events'
import type { UiString } from './ui-strings'

/** Display order of the Partner groups; the keys are the ones the Studio stores. */
const PARTNER_GROUP_ORDER = [
  { key: 'general', label: 'partnerGroupGeneral' satisfies UiString },
  { key: 'partner', label: 'partnerGroupPartner' satisfies UiString },
  { key: 'media', label: 'partnerGroupMedia' satisfies UiString },
] as const

export type PartnerGroupKey = (typeof PARTNER_GROUP_ORDER)[number]['key']

/** Credits sorted into the fixed group order, editor order kept within a group; empty groups dropped.
 * A credit whose `partnerGroup` is not a known key is dropped too (the Studio makes the field required). */
export const groupPartners = (credits: PartnerCredit[]) =>
  PARTNER_GROUP_ORDER.map(({ key, label }) => ({
    key,
    label,
    size: key === 'general' ? ('large' as const) : ('regular' as const),
    credits: credits.filter((c) => c.partnerGroup === key),
  })).filter((g) => g.credits.length > 0)
