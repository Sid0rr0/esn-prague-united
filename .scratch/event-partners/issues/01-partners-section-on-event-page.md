# 01: Partners section on the Event page

**What to build:** Editors can credit the Partners that supported an Event, and visitors see their logos on the Event page (see `../spec.md`):

- In the Studio, editors keep each Partner once: name (required, not translated), logo (required, with a hint to upload SVG or a transparent PNG) and an optional website link. Partners have their own "Partners" list in the sidebar, and editors can also create one inline while editing an Event.
- On an Event, editors add Partners from the existing ones, give each a Partner tier (General partner, Partner, Media partner), and drag them into order. The tier is stored now but not shown on the page yet (ticket 02). The Studio flags the same Partner added twice to one Event.
- The Event page shows a "Partners" section after the Event FAQ with every Partner's logo in the editor's order, full colour on a light panel. Each logo's alt text is the Partner's name. A logo with a website link opens it in a new tab and is marked as a sponsored link. A logo without one is a plain image.
- The section shows on Upcoming and Past events alike. An Event with no Partners has no section. A Partner credit whose reference is broken is skipped without breaking the page.
- The seeded Czech Ball has a couple of sample Partners, so the section is visible in local development.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Seam test: an Event with no Partners renders no Partners section.
- [ ] Seam test: an Event's Partners are rendered after the Event FAQ, in the editor's order.
- [ ] Seam test: each logo's alt text is the Partner's name.
- [ ] Seam test: a Partner with a website link renders a link opening in a new tab with `rel` containing `sponsored`, and a Partner without one renders no link.
- [ ] Seam test: a Past event still shows its Partners section.
- [ ] Seam test: a Partner credit whose reference is broken is skipped and the rest still render.
- [ ] Manual check in the Studio: a Partner can be created from the sidebar and inline from an Event, and adding the same Partner twice to one Event is flagged.
- [ ] Seed data includes sample Partners on the Czech Ball.
