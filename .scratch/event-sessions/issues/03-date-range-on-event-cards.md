# 03: Date range on Event cards

**What to build:** An Event card for an Event with Sessions shows the Event's date range, so a running course doesn't look like it happened weeks ago (see `../spec.md`):

- The Event card data gains the Event's Ends and whether it has Sessions.
- A card for an Event with Sessions shows the range from Starts to Ends (e.g. "1 Oct – 15 Dec"). Without Ends, it shows Starts as today.
- This applies everywhere Event cards appear: the Events list, the homepage's upcoming list and Related events.
- Cards for Events without Sessions are unchanged. List ordering is unchanged.

**Blocked by:** 01 (Sessions table on the Event page)

**Status:** done

- [x] Seam test (Events list): a card for an Event with Sessions shows the date range.
- [x] Seam test (Events list): a card for an Event without Sessions shows only its start date.
- [x] The homepage upcoming list and Related events show the same range for an Event with Sessions.
