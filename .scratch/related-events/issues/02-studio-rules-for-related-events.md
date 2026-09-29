# 02: Studio rules for Related events

**What to build:** The Studio stops editors from saving Related events that the site shouldn't show (see `../spec.md`), so what an editor sees in the Studio is exactly what visitors see:

- An Event can have at most 3 Related events.
- An Event can't be its own Related event. The picker doesn't offer the Event being edited, whether it's opened as a draft or as the published version.
- The same Event can't be picked twice.

These rules are checked by hand in the Studio. The Studio has no test seam, and this doesn't justify adding one.

**Blocked by:** 01 (Related events on the Event page)

**Status:** ready-for-agent

- [ ] Manual check: adding a 4th Related event shows a validation error.
- [ ] Manual check: the Related events picker doesn't list the Event being edited, as a draft or as the published version.
- [ ] Manual check: picking the same Event twice shows a validation error.
- [x] The Studio builds and its existing tests still pass.
