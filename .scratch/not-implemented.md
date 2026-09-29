# Tickets not implemented

Snapshot of every ticket under `.scratch/*/issues/` whose `Status:` is not `done`. Last checked 2026-09-29. Update it when a ticket is finished, or regenerate it by scanning the `Status:` lines.

Workflow: pick a ticket whose blockers are done, run `/implement` on it, then mark the ticket `**Status:** done` and remove its row here.

## Open

| Feature           | Ticket                                                                                                                                      | Status          | Blocked by | Notes                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------- | ---------------------------------------------------------------------------------- |
| brand-compliance  | [04 Explore ways to show the Section logo on the Section page](brand-compliance/issues/04-explore-showing-the-section-logo.md)              | needs-triage    | none       | Exploration; triage before an agent picks it up                                    |
| event-partners    | [01 Partners section on the Event page](event-partners/issues/01-partners-section-on-event-page.md)                                         | ready-for-agent | none       |                                                                                    |
| event-partners    | [02 Group Partners by Partner tier](event-partners/issues/02-group-partners-by-tier.md)                                                     | ready-for-agent | 01         |                                                                                    |
| instagram-posts   | [02 Instagram posts on the Event page ("On Instagram")](instagram-posts/issues/02-instagram-posts-on-event-page.md)                         | ready-for-agent | 01 (done)  | Adds to the Event page                                                             |
| instagram-posts   | [03 Privacy policy page](instagram-posts/issues/03-privacy-policy-page.md)                                                                  | ready-for-agent | none       | Built in 7cabc1d and bbc5a14; only the Studio manual check is left, then mark done |
| related-events    | [01 Related events on the Event page](related-events/issues/01-related-events-on-event-page.md)                                             | ready-for-agent | none       |                                                                                    |
| related-events    | [02 Studio rules for Related events](related-events/issues/02-studio-rules-for-related-events.md)                                           | ready-for-agent | 01         | Checked by hand in the Studio                                                      |
| translated-fields | [01 The text migration leaves fields cleared in both languages alone](translated-fields/issues/01-migration-leaves-cleared-fields-alone.md) | ready-for-agent | none       | Studio only; fixes a latent migration bug                                          |
| translated-fields | [02 Create the translated-fields workspace and move the Studio onto it](translated-fields/issues/02-shared-workspace-and-studio.md)         | ready-for-agent | 01         | Adds a packages/ workspace                                                         |
| translated-fields | [03 Move the web onto the translated-fields workspace](translated-fields/issues/03-web-onto-shared-workspace.md)                            | ready-for-agent | 02         |                                                                                    |
| vercel-deploy     | [03 Rebuild the site every morning](vercel-deploy/issues/03-daily-rebuild.md)                                                               | ready-for-agent | 01         | Agent writes workflow and docs; replaces site-design-alignment 13                  |

## Suggested order

1. event-partners 01, then 02
2. related-events 01, then 02
3. instagram-posts 02
4. vercel-deploy 03 (01 and 02 done; their dashboard steps are with the maintainer)
5. translated-fields 01 any time (small, standalone); 02 then 03 just before the Czech rollout starts
6. instagram-posts 03: do the Studio manual check, then mark it done
7. brand-compliance 04: triage first

## Fully done

- site-design-alignment: 01–13 (13 was superseded by vercel-deploy 03)
- brand-compliance: 01, 02, 03
- content-reads: 01–07
- instagram-posts: 01, 04
- vercel-deploy: 01, 02
- ticket-area: 01, 02
