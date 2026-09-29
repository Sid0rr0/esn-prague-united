# 02: Section tiles show no Section logo

**What to build:** On the homepage Sections block and the Sections list, each Section tile shows the Section's name, university, tagline (list only) and brand-colour stripe, with no Section logo. That leaves no more than one ESN star in view. See the parent spec: `.scratch/brand-compliance/spec.md`.

**Blocked by:** 01 (Write down the brand rules for developers and editors). The tile's comment points to the brand rules doc.

**Status:** ready-for-agent

- [ ] Section tiles on the Sections list render no `<img>` and no logo placeholder square, even when every Section has a Section logo.
- [ ] Section tiles in the homepage Sections block render no `<img>` and no logo placeholder, on desktop cards or mobile rows.
- [ ] Tiles keep their order, brand colour, name, university, tagline (list only), link and arrow. The existing Sections list and homepage Sections block tests still pass.
- [ ] The Section summary query and type no longer carry `logo` (unless something else still needs it). The full Section query keeps it for the Section page.
- [ ] A short comment on the tile says why there's no Section logo and points to the brand rules doc.
- [ ] New tests go through the page render seam, with Section fixtures that have logos: no tile on either page contains an `<img>` or a logo asset URL.
