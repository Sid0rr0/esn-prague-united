# Tickets not implemented

Snapshot of every ticket under `.scratch/*/issues/` whose `Status:` is not `done`. Last checked 2026-09-29. Update it when a ticket is finished, or regenerate it by scanning the `Status:` lines.

Workflow: pick a ticket whose blockers are done, run `/implement` on it, then mark the ticket `**Status:** done` and remove its row here.

## Open

| Feature          | Ticket                                                                                                                          | Status                          | Blocked by | Notes                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------- |
| brand-compliance | [03 Section page shows its whole Section logo on a white plate](brand-compliance/issues/03-section-page-logo-on-white-plate.md) | ready-for-agent                 | none       | In progress: uncommitted changes in `Picture.astro`, `image.ts`, `sections/[slug].astro` and `sections.test.ts` |
| event-partners   | [01 Partners section on the Event page](event-partners/issues/01-partners-section-on-event-page.md)                             | no `Status:` line (not started) | none       | Needs triage: add a `Status:` line                                                                              |
| event-partners   | [02 Group Partners by Partner tier](event-partners/issues/02-group-partners-by-tier.md)                                         | no `Status:` line (not started) | 01         | Needs triage: add a `Status:` line                                                                              |
| related-events   | [01 Related events on the Event page](related-events/issues/01-related-events-on-event-page.md)                                 | ready-for-agent                 | none       |                                                                                                                 |
| related-events   | [02 Studio rules for Related events](related-events/issues/02-studio-rules-for-related-events.md)                               | ready-for-agent                 | 01         | Checked by hand in the Studio                                                                                   |
| vercel-deploy    | [03 Rebuild the site every morning](vercel-deploy/issues/03-daily-rebuild.md)                                                   | ready-for-agent                 | 01         | Agent writes workflow and docs; replaces site-design-alignment 13                                               |

## Suggested order

1. brand-compliance 03 (unblocked, already started)
2. event-partners 01, then 02
3. vercel-deploy 03 (01 and 02 done; their dashboard steps are with the maintainer)

## Fully done

- site-design-alignment: 01–13 (13 was superseded by vercel-deploy 03)
- brand-compliance: 01, 02
