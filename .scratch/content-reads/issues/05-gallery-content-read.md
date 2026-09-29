# 05: Gallery and Album content-read module

**What to build:** The Gallery, the Album page and its static paths read their content through the Albums module:

- `readAlbums()` returns Albums newest first, with photo counts.
- `readAlbum(slug)` returns the Album, with its photos and the Event that links to it if any, or `null` for an unknown slug.
- `readAlbumSlugs()` returns every Album slug.

Albums still don't read an old Album's Sections. Visitors see exactly what they see today.

**Blocked by:** 01.

**Status:** done

- [x] The Gallery and the Album page import no query, result shape or `fetchContent`.
- [x] An unknown slug still renders a 404 on the Album page.
- [x] Gallery and dropped-data tests pass unchanged; type checking passes.

## Comments

Done. `readAlbums()`, `readAlbum(slug)` and `readAlbumSlugs()` live in `apps/web/src/lib/albums.ts`, and the GROQ strings are unchanged. `AlbumDetail` moved there as well. `AlbumSummary` and `ALBUM_CARD` stay shared, because the Homepage's Latest albums uses them too. The dropped-data test reads no Album query, so none of them stays exported. There was no test for an unknown slug, so I added one to the Gallery tests (it answers 404).
