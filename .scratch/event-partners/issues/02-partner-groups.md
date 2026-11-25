# 02: Sort Partners into Partner groups

**What to build:** The Event page's Partners section sorts logos into Partner groups, so the main supporters stand out (see `../spec.md`):

- Groups always appear in the order General partner → Partner → Media partner, whatever order the editor used across groups. Within a group, the editor's order is kept.
- Groups with no Partners are hidden. Group sub-headings appear only when two or more groups have Partners. With a single group, only the "Partners" heading shows.
- General partner logos are rendered larger than the other groups.
- The "Partners" heading and group names are translated like the rest of the site.
- In the Studio, each Partner credit on an Event previews with the Partner's logo, its name and the group.

**Blocked by:** 01

**Status:** resolved

- [ ] Seam test: groups render in the order General partner → Partner → Media partner, regardless of the editor's order across groups.
- [ ] Seam test: within a group, Partners keep the editor's order.
- [ ] Seam test: with Partners in only one group, no group sub-heading is rendered.
- [ ] Seam test: with Partners in two or more groups, each used group has a sub-heading and unused groups have none.
- [ ] Seam test: General partner logos are marked as the larger size.
- [ ] Manual check in the Studio: a Partner credit's preview shows logo, name and group.

## Answer

Implemented in the commit "sort Partners into Partner groups on the Event page": groups sorted General partner, Partner, Media partner via `apps/web/src/lib/partners.ts`, sub-headings only with two or more groups, larger General partner logos, translated labels. The Studio preview (logo, name, group) already shipped with ticket 01. Manual Studio check not run here.
