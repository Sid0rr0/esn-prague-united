# 05: Gallery and Album content-read module

**What to build:** The Gallery, the Album page and its static paths read their content through the Albums module:

- `readAlbums()` returns Albums newest first, with photo counts.
- `readAlbum(slug)` returns the Album, with its photos and the Event that links to it if any, or `null` for an unknown slug.
- `readAlbumSlugs()` returns every Album slug.

Albums still don't read an old Album's Sections. Visitors see exactly what they see today.

**Blocked by:** 01.

**Status:** ready-for-agent

- [ ] The Gallery and the Album page import no query, result shape or `fetchContent`.
- [ ] An unknown slug still renders a 404 on the Album page.
- [ ] Gallery and dropped-data tests pass unchanged; type checking passes.
