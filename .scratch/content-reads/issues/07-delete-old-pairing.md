# 07: Delete the old query and shape pairing

**What to build:** With every page reading through a content-read module, the old pairing goes:

- the shared queries module;
- the page-only shapes left in the shared types module;
- `fetchContent`.

Only the shared pieces, the shared shapes, `localise` and the `fetchRaw` seam (with its two adapters) remain. Visitors see exactly what they see today.

**Blocked by:** 02, 03, 04, 05, 06.

**Status:** ready-for-agent

- [ ] No module exports a GROQ query for pages to pick up; no page names a query or a result shape.
- [ ] `fetchContent` no longer exists.
- [ ] The test setup still answers `fetchRaw` from in-memory documents with real GROQ.
- [ ] All page tests pass unchanged; type checking and lint pass.
