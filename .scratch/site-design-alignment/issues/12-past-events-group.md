# 12: Past events group

**What to build:** A "Past" group on the Events list page, below "Upcoming", so ended Events (and, through their Event pages, their Albums) stay reachable:

- Past events are listed newest first, with the same cards as Upcoming events.
- An Event is past once its end time has passed, or its start time when it has no end time.
- With no Past events, the "Past" heading is hidden. With no Events at all, only the Upcoming heading and the Instagram line remain.

**Blocked by:** 11.

**Status:** ready-for-agent

- [ ] Seam test: Past events are listed below Upcoming events, newest first.
- [ ] Seam test: an Event whose end time has passed is past, even if its start time is recent.
- [ ] Seam test: an Event with no end time is past once its start time has passed.
- [ ] Seam test: an Event that has started but not ended is still upcoming.
- [ ] Seam test: with no Past events, the "Past" heading isn't rendered.
