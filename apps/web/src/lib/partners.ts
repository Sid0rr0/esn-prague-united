import type { PartnerCredit } from './events'
import type { UiString } from './ui-strings'

/** Display order of the Partner groups; the keys are the ones the Studio stores. */
const GROUPS: { key: string; label: UiString }[] = [
  { key: 'general', label: 'partnerGroupGeneral' },
  { key: 'partner', label: 'partnerGroupPartner' },
  { key: 'media', label: 'partnerGroupMedia' },
]

/** Credits sorted into the fixed group order, editor order kept within a group; empty groups dropped. */
export const groupPartners = (credits: PartnerCredit[]) =>
  GROUPS.map(({ key, label }) => ({
    key,
    label,
    credits: credits.filter((c) => c.partnerGroup === key),
  })).filter((g) => g.credits.length > 0)
