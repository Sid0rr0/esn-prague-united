# 02: Group Partners by Partner tier

**What to build:** The Event page's Partners section groups logos by Partner tier, so the main supporters stand out (see `../spec.md`):

- Tiers always appear in the order General partner → Partner → Media partner, whatever order the editor used across tiers. Within a tier, the editor's order is kept.
- Tiers with no Partners are hidden. Tier sub-headings appear only when two or more tiers have Partners. With a single tier, only the "Partners" heading shows.
- General partner logos are rendered larger than the other tiers.
- The "Partners" heading and tier names are translated like the rest of the site.
- In the Studio, each Partner credit on an Event previews with the Partner's logo, its name and the tier.

**Blocked by:** 01

**Status:** ready-for-agent

- [ ] Seam test: tiers render in the order General partner → Partner → Media partner, regardless of the editor's order across tiers.
- [ ] Seam test: within a tier, Partners keep the editor's order.
- [ ] Seam test: with Partners in only one tier, no tier sub-heading is rendered.
- [ ] Seam test: with Partners in two or more tiers, each used tier has a sub-heading and unused tiers have none.
- [ ] Seam test: General partner logos are marked as the larger size.
- [ ] Manual check in the Studio: a Partner credit's preview shows logo, name and tier.
