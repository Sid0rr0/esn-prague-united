# 03: Privacy policy page

**What to build:** Editors maintain a Privacy policy in the Studio, and visitors can read it on its own page. The consent banner in ticket 04 links to it (see `../spec.md`):

- **Studio:** a new Privacy policy Singleton with a translated heading and translated rich text. It's added to the Studio structure's singleton list, so it opens directly from the sidebar with no list view and no delete action.
- **Site:** the Privacy policy renders as its own page. Its route and footer link follow the pattern of the other Singleton pages.
- **Seed data:** includes placeholder Privacy policy text.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Seam test: the Privacy policy page renders its heading and rich text.
- [ ] Seam test: the footer links to the Privacy policy page.
- [ ] Manual check in the Studio: the Privacy policy opens from the sidebar as a Singleton and can't be duplicated or deleted.
