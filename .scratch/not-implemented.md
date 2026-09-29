# Tickets not implemented

Snapshot of every ticket under `.scratch/*/issues/` whose `Status:` is not `done`. Last checked 2026-09-29. Update it when a ticket is finished, or regenerate it by scanning the `Status:` lines.

Workflow: pick a ticket whose blockers are done, run `/implement` on it, then mark the ticket `**Status:** done` and remove its row here.

## Open

| Feature        | Ticket                                                                                                                                   | Status                          | Blocked by | Notes                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ---------- | ----------------------------------------------------------------- |
| content-reads  | [01 Pull shared query pieces and shapes out of the queries and types modules](content-reads/issues/01-shared-query-pieces-and-shapes.md) | ready-for-agent                 | none       | Prefactor; no page changes                                        |
| content-reads  | [02 Homepage content-read module](content-reads/issues/02-homepage-content-read.md)                                                      | ready-for-agent                 | 01         |                                                                   |
| content-reads  | [03 Events content-read module](content-reads/issues/03-events-content-read.md)                                                          | ready-for-agent                 | 01         |                                                                   |
| content-reads  | [04 Sections content-read module](content-reads/issues/04-sections-content-read.md)                                                      | ready-for-agent                 | 01         |                                                                   |
| content-reads  | [05 Gallery and Album content-read module](content-reads/issues/05-gallery-content-read.md)                                              | ready-for-agent                 | 01         |                                                                   |
| content-reads  | [06 Singleton content-read modules](content-reads/issues/06-singleton-content-reads.md)                                                  | ready-for-agent                 | 01         |                                                                   |
| content-reads  | [07 Delete the old query and shape pairing](content-reads/issues/07-delete-old-pairing.md)                                               | ready-for-agent                 | 02–06      |                                                                   |
| event-partners | [01 Partners section on the Event page](event-partners/issues/01-partners-section-on-event-page.md)                                      | no `Status:` line (not started) | none       | Needs triage: add a `Status:` line                                |
| event-partners | [02 Group Partners by Partner tier](event-partners/issues/02-group-partners-by-tier.md)                                                  | no `Status:` line (not started) | 01         | Needs triage: add a `Status:` line                                |
| related-events | [01 Related events on the Event page](related-events/issues/01-related-events-on-event-page.md)                                          | ready-for-agent                 | none       |                                                                   |
| related-events | [02 Studio rules for Related events](related-events/issues/02-studio-rules-for-related-events.md)                                        | ready-for-agent                 | 01         | Checked by hand in the Studio                                     |
| vercel-deploy  | [03 Rebuild the site every morning](vercel-deploy/issues/03-daily-rebuild.md)                                                            | ready-for-agent                 | 01         | Agent writes workflow and docs; replaces site-design-alignment 13 |

## Suggested order

1. content-reads 01, then 02–06 (any order, or in parallel), then 07. Do it before new page work, so new pages follow the content-read pattern
2. event-partners 01, then 02
3. related-events 01, then 02
4. vercel-deploy 03 (01 and 02 done; their dashboard steps are with the maintainer)

## Fully done

- site-design-alignment: 01–13 (13 was superseded by vercel-deploy 03)
- brand-compliance: 01, 02, 03
