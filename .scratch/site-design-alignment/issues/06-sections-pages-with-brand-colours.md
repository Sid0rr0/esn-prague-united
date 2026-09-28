# 06: Sections list and Section page with fixed brand colours

**What to build:** Each Section's brand colour and tint are fixed in code and keyed to the Section. There's no schema field, following ADR 0001.

- CU: cyan
- CTU: magenta
- VŠE: green
- CZU: orange
- UCT: dark blue

**Sections list page (3m):** all 5 Sections in website order, each with its colour, logo, name, university and one-line description.

**Section page (3n):**

- Cover photo, and a colour band with the logo, name and university.
- About text.
- A "Get a buddy" button to the buddy programme sign-up.
- Office info as prose, the email, and "Open in Maps".
- Socials.
- No events or albums.

The homepage Sections block uses the same colours.

**Blocked by:** 03.

**Status:** ready-for-agent

- [ ] Seam test: the Sections list renders all 5 Sections in website order, each with its fixed colour.
- [ ] Seam test: a Section page renders about, buddy sign-up, office as prose, email and socials.
- [ ] Seam test: a Section page renders no events or albums.
- [ ] Seam test: "Get a buddy" is hidden when there's no buddy sign-up link.
- [ ] The homepage Sections block renders using the same colour mapping.
- [ ] Editors can't change a Section's colour from the Studio.
