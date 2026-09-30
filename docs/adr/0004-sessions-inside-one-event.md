# Repeating Events as Sessions inside one Event

A repeating Event (e.g. dance classes twice a week for a semester) is one Event document holding a list of Sessions, each with its own date, optional ticket link and note. It is not one Event per class grouped into a series. We chose this so the Events list and homepage show the course once instead of 25–30 near-identical cards, and editors enter the title, image, venue and Price tiers once. The Event keeps its own Starts and Ends as the span of the course, so being upcoming or past, list order and the daily Site update don't need to know Sessions exist. The cost is that a single class has no page, card or URL of its own, and anything that wants "the next class" (card dates, list order) has to look inside the Event's Sessions.

## Considered Options

- **One Event per class, linked as a series**: each class gets its own page, card and search result, and Related events or a series reference could build the table. It was rejected because it floods the lists, makes editors copy the same content 25+ times, and needs a new series concept.
- **Sessions generated from a repeat rule** ("every Tue and Thu 19:00 until 15 Dec"): it was rejected because holidays, cancellations and moved rooms turn into exceptions to the rule, which cost more than typing each Session.

## Consequences

Switching to one Event per class later means splitting every Event with Sessions into separate documents. There is nothing to redirect, since Sessions have no URLs. Per-Session venue or price, if ever needed, become fields on the Session, not new Events.
