# Spec: Partners on the Event page

Status: ready-for-agent

## Problem Statement

ESN Prague United Events such as the Czech Ball are supported by outside organisations: companies that pay, venues, drink brands, radio stations. These supporters expect to be credited, usually with their logo on the Event's page. Right now there's nowhere to put them. Editors have to paste logos into the "About the event" rich text by hand, which gives no consistent look, no ordering by importance, and no reuse: the same company that supported last year's Ball has to be set up again from scratch.

## Solution

Editors keep each **Partner** once in the Studio: its name, logo and an optional website link. On any Event they pick the Partners that supported it and give each a **Partner tier** (General partner, Partner or Media partner). The Event page shows a "Partners" section after the Event FAQ, with logos grouped by tier and General partners shown largest. The section stays on the page after the Event has ended, so the Event keeps crediting its Partners.

## User Stories

1. As an editor, I want to create a Partner with a name, logo and optional website link, so that I can credit it on Events.
2. As an editor, I want a Partner's name to be required, so that every logo has a readable name for screen readers.
3. As an editor, I want a Partner's logo to be required, so that the Partners section never shows an empty slot.
4. As an editor, I want the logo field to tell me to upload an SVG or a PNG with a transparent background, so that logos look clean on the page.
5. As an editor, I want the Partner's name entered once and not per language, so that I don't retype a brand name for every locale.
6. As an editor, I want a "Partners" list in the Studio sidebar, so that I can find, fix and replace Partner logos in one place.
7. As an editor, I want to add a Partner to an Event by picking it from existing Partners, so that I reuse last year's logo and link.
8. As an editor, I want to create a new Partner directly from the Event form when it doesn't exist yet, so that I don't have to leave the Event I'm editing.
9. As an editor, I want to choose a Partner tier (General partner, Partner, Media partner) for each Partner on an Event, so that more important supporters get more prominence.
10. As an editor, I want to choose tiers from a fixed list rather than type them, so that there are no near-duplicates like "Media partner" vs "Media Partners".
11. As an editor, I want the same Partner to hold different tiers on different Events, so that a sponsor can be General partner at the Ball and a plain Partner elsewhere.
12. As an editor, I want the Studio to flag when I add the same Partner twice to one Event, so that nobody is credited twice.
13. As an editor, I want to drag Partners into order on an Event, so that I can honour placement agreements within a tier.
14. As an editor, I want Partners in the Event's list to show their logo, name and tier in the preview, so that I can check the list at a glance.
15. As an editor, I want the Partners fields grouped with the other Event details in the Studio, so that I know where to find them.
16. As an editor, I want to update a Partner's logo once and have every Event use the new one, so that rebrands don't need editing on every Event.
17. As an editor, I want the Studio to stop me deleting a Partner that an Event still credits, so that no Event page loses a logo by accident.
18. As a visitor, I want to see which organisations support an Event, so that I know who's behind it.
19. As a visitor, I want General partners shown first and with larger logos, so that the main supporters stand out.
20. As a visitor, I want tiers always shown in the order General partner, Partner, Media partner, so that every Event page reads the same way.
21. As a visitor, I want a sub-heading per tier when an Event uses more than one tier, so that I can tell the main supporters from media partners.
22. As a visitor, I want no lone tier sub-heading when an Event uses only one tier, so that the section doesn't read "Partners / Partner".
23. As a visitor, I want no Partners section at all on an Event without Partners, so that I don't see an empty heading.
24. As a visitor, I want tiers with no Partners hidden, so that I don't see empty sub-headings.
25. As a visitor, I want to click a Partner's logo to visit its website in a new tab, so that I can learn more without losing the Event page.
26. As a visitor, I want a logo with no website link to be plain and not clickable, so that I don't click a link that goes nowhere.
27. As a visitor, I want logos shown in full colour on a light panel, so that they are legible in both light and dark mode.
28. As a visitor using a screen reader, I want each logo announced by the Partner's name, so that I know who is credited.
29. As a visitor, I want the Partners section after the Event FAQ, so that it doesn't get in the way of the Event's practical information.
30. As a visitor looking at a Past event, I want to still see its Partners, so that the page remains a full record of the Event.
31. As a Partner, I want my link marked as sponsored, so that search engines treat it correctly and the credit follows good practice.
32. As a visitor reading the site in another language, I want the "Partners" heading and tier names translated, so that the section matches the rest of the page.

## Implementation Decisions

- **New Partner document type** in the Studio schema: a name (plain string, required, not localised), a logo (image, required, with a field hint asking for SVG or PNG with a transparent background) and a website link (URL, optional). The logo is a plain image, not the shared image-with-alt type: the Partner's name is its alt text, so there's no separate alt field to fill in.
- **Partner list in the Studio sidebar**, next to Events and Photo albums. Partners can be created there or from the "+ Create" menu, like Events and Albums, unlike Sections.
- **Event gets a `partners` array** of Partner credits. Each credit is an object holding a reference to a Partner and a Partner tier. The array order is the editor's order within a tier. The reference field allows creating a new Partner inline.
- **Partner tier is a fixed list** of three values with stable stored keys (General partner, Partner, Media partner), picked with a radio or dropdown. Display labels and their translations live in the site's i18n strings, not in content.
- **The credit's preview** shows the Partner's name as the title, its logo as the media and the tier as the subtitle.
- **Studio validation** on the Event's `partners` array rejects the same Partner referenced twice. Sanity already blocks deleting a Partner that an Event references, so no extra work is needed for story 17.
- **Event query** projects the credits with the Partner dereferenced: its name, logo (image URL via the existing image helper) and website link, plus the tier. Credits whose Partner reference is broken or missing a logo are dropped.
- **Event page component**: a Partners section rendered after the Event FAQ, whether the Event is upcoming or past. It groups credits by tier in the fixed order, keeps the editor's order within each tier, hides empty tiers, shows tier sub-headings only when two or more tiers have Partners, and renders nothing when there are no credits. The grouping and ordering logic lives in a small pure helper alongside the other page helpers in the web app's lib folder.
- **Logo rendering**: full colour on a light panel with a consistent logo height. General partner logos are rendered at a larger height than other tiers. `alt` is the Partner's name. With a website link, the logo is wrapped in a link with `target="_blank"` and `rel="sponsored noopener"`. Without one, it's a plain image.
- **Shared types** get a Partner credit type (tier plus dereferenced Partner) used by the query result and the component.
- **Seed data** gains a couple of sample Partners on the seeded Czech Ball Event, so the section is visible in local development.
- The domain terms **Partner** and **Partner tier** are already defined in `CONTEXT.md`. Use them in code, Studio labels and copy. Don't use "sponsor" in field names or UI copy.

## Testing Decisions

- A good test renders the real Event page through the existing page seam (in-memory Sanity documents, real GROQ queries, current time pinned) and checks only the HTML a visitor receives. It doesn't test the grouping helper, query shape or component props directly.
- **The only seam is the Event page render seam** already used by the Event page tests. Add Partner fixtures next to the existing Event fixtures and extend the Event page test file (or add a sibling Partners test file) with cases for:
  - An Event with no Partners renders no Partners section.
  - Tiers appear in the order General partner → Partner → Media partner, whatever order the editor used across tiers.
  - Within a tier, Partners appear in the editor's order.
  - With Partners in only one tier, there are no tier sub-headings, just the "Partners" heading.
  - With Partners in two or more tiers, each used tier has its sub-heading and unused tiers have none.
  - A Partner with a website link renders a link opening in a new tab with `rel` containing `sponsored`. A Partner without one renders no link.
  - Each logo's alt text is the Partner's name.
  - General partner logos are marked as the larger size, e.g. via a tier data attribute the test can check.
  - A Past event still shows its Partners section.
  - A credit whose Partner reference is broken is skipped without breaking the page.
- The Studio-side rule against a duplicate Partner on one Event is **not automatically tested**; check it by hand in the Studio. The Studio has no test seam, and this doesn't justify adding one.
- Prior art: the existing Event page tests (ticket sidebar, ended state, Album link) and the Events list tests for Past events.

## Out of Scope

- A site-wide partner list (footer, About page or a dedicated partners page). ESN Prague United has no site-wide partners.
- Partners in the homepage hero, on Event cards in the Events list, or on Album pages.
- Partner descriptions or "what they contributed" text.
- Greyscale or hover-to-colour logo effects.
- Tiers beyond General partner, Partner and Media partner, or editor-defined tiers.
- Partners belonging to individual Sections.
- Migrating logos already pasted into existing Events' rich text. Editors move them by hand if they want.

## Further Notes

- If a site-wide partner list is ever wanted, it should reuse the Partner documents from this spec rather than add a second kind of partner.
- Adding a fourth Partner tier later means changing the schema's fixed list, the i18n strings and the tier order in one place each. That's cheap, so there's no ADR.
