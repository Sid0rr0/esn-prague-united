# 04: Sections content-read module

**What to build:** The Sections list, the Section page and its static paths read their content through the Sections module:

- `readSections()` returns the 5 Sections in website order.
- `readSection(slug)` returns the Section or `null` for an unknown slug.
- `readSectionSlugs()` returns every Section slug.

Section brand colours stay fixed in code, keyed by slug (ADR 0001). Visitors see exactly what they see today.

**Blocked by:** 01.

**Status:** ready-for-agent

- [ ] The Sections list and the Section page import no query, result shape or `fetchContent`.
- [ ] An unknown slug still renders a 404 on the Section page.
- [ ] Sections tests pass unchanged; type checking passes.
