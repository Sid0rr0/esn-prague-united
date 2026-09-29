# 02: Homepage content-read module

**What to build:** The Homepage reads its content through one call, `readHomepage()`, and no longer names a query or a result shape. The Homepage module owns its projection, its shape, language resolution and the Upcoming list state. That state comes back as a tagged union:

- **list:** the Upcoming events other than the Featured event, soonest first, at most 4;
- **hidden:** a Featured event is set and nothing else is upcoming;
- **coming soon:** no Featured event and nothing upcoming.

The Homepage renders from the tag instead of computing the state. Visitors see exactly what they see today.

**Blocked by:** 01.

**Status:** ready-for-agent

- [ ] The Homepage calls one read function and imports no query, result shape or `fetchContent`.
- [ ] The Upcoming list state is decided in the Homepage module, not in the page.
- [ ] The read function takes an optional language, defaulting to English.
- [ ] Homepage tests pass unchanged; type checking passes.
